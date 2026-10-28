// lib/auth.ts — Unified auth for admin staff + client portal users
//
// Two login flows handled here:
//   1. Admin staff  → CredentialsProvider (username + password)
//   2. Client users → GoogleProvider + CredentialsProvider (email + password)
//
// The JWT and session always carry: id, role, onboarded, permissions
// Middleware in both apps uses role to route to the right dashboard.

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logger } from "./logger";
import { resolvePermissions, Permissions } from "./permissions";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

export const authOptions: NextAuthOptions = {
  // PrismaAdapter is required for Google OAuth to persist
  // Account, Session, and VerificationToken records.
  // Make sure these models exist in your schema (added in Phase 1).
  adapter: PrismaAdapter(prisma),

  // JWT strategy keeps sessions stateless — same as before for admin,
  // now also used for client Google users.
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    // ─────────────────────────────────────────────
    // GOOGLE — for client portal self-registration
    // Admin staff never use this; they always use username/password.
    // ─────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'CLIENT',
          username: '',
          onboarded: false,
          permissions: {
            admin: false,
            mis: false,
            clients: false,
            printers: false,
            complaints: false,
            dispatch: false,
            billing: false,
            marketing: false,
            orders: false,
            pendingWork: false,
          },
        }
      },
    }),

    // ─────────────────────────────────────────────
    // CREDENTIALS — handles two cases:
    //   a) Admin staff:  login with username + password
    //   b) Client users: login with email + password
    //
    // We detect which case by checking whether the submitted
    // identifier looks like an email address.
    // ─────────────────────────────────────────────
    CredentialsProvider({
      name: "credentials",
      credentials: {
        // "identifier" accepts either a username (admin) or email (client)
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("CREDENTIALS:", credentials)
          if (!credentials?.identifier || !credentials?.password) {
            logger.debug("Missing credentials");
            return null;
          }

          const isEmail = credentials.identifier.includes("@");

          // ── Case A: Admin staff login (username) ──────────────────
          if (!isEmail) {
            logger.debug("Admin login attempt", {
              username: credentials.identifier,
            });

            const user = await prisma.user.findUnique({
              where: { username: credentials.identifier },
            });

            if (!user || !user.isActive) {
              logger.warn("Admin user not found or inactive", {
                username: credentials.identifier,
              });
              return null;
            }

            if (!user.password) {
              logger.warn("Admin user has no password set", {
                username: credentials.identifier,
              });
              return null;
            }

            const isValid = await bcrypt.compare(
              credentials.password,
              user.password,
            );
            if (!isValid) {
              logger.warn("Invalid password for admin", {
                username: credentials.identifier,
              });
              return null;
            }

            await prisma.user.update({
              where: { id: user.id },
              data: { lastLogin: new Date() },
            });

            const permissions = resolvePermissions(
              user.role,
              user.permissions as Record<string, boolean> | null,
            );

            logger.info("Admin login successful", { username: user.username });

            return {
              id: user.id,
              email: user.email,
              name: user.name ?? user.username ?? "Admin",
              role: user.role,
              username: user.username ?? "",
              onboarded: true, // admin staff are always considered onboarded
              permissions,
            };
          }

          // ── Case B: Client user login (email + password) ──────────
          logger.debug("Client email login attempt", {
            email: credentials.identifier,
          });

          const user = await prisma.user.findUnique({
            where: { email: credentials.identifier.toLowerCase() },
          });

          if (!user) {
            logger.warn("Client user not found", {
              email: credentials.identifier,
            });
            return null;
          }

          if (!user.isActive) {
            throw new Error("Account is deactivated. Contact support.");
          }

          // Check account lock
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            const minutesLeft = Math.ceil(
              (user.lockedUntil.getTime() - Date.now()) / 60000,
            );
            throw new Error(
              `Account locked. Try again in ${minutesLeft} minutes.`,
            );
          }

          if (!user.password) {
            throw new Error("Please sign in with Google for this account.");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            const attempts = user.loginAttempts + 1;
            const shouldLock = attempts >= MAX_LOGIN_ATTEMPTS;

            await prisma.user.update({
              where: { id: user.id },
              data: {
                loginAttempts: attempts,
                lockedUntil: shouldLock
                  ? new Date(Date.now() + LOCK_TIME_MS)
                  : null,
              },
            });

            if (shouldLock) {
              throw new Error(
                "Too many failed attempts. Account locked for 15 minutes.",
              );
            }

            throw new Error(
              `Invalid password. ${MAX_LOGIN_ATTEMPTS - attempts} attempts remaining.`,
            );
          }

          // Reset lock on success
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: 0,
              lockedUntil: null,
              lastLogin: new Date(),
            },
          });

          const permissions = resolvePermissions(
            user.role,
            user.permissions as Record<string, boolean> | null,
          );

          logger.info("Client login successful", { email: user.email });

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? "",
            role: user.role,
            username: user.username ?? "",
            onboarded: user.onboarded,
            permissions,
          };
        } catch (error) {
          // Re-throw errors with messages (NextAuth surfaces these to the UI)
          if (error instanceof Error && error.message) throw error;
          logger.error("Unexpected auth error", { error });
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // ── signIn callback ─────────────────────────────────────────────
    // Called after every successful sign-in, including Google OAuth.
    // For Google users: create the user record if it doesn't exist yet,
    // or update their name/image if it changed.
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existing) {
          // Update display info from Google on each login
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              name: user.name ?? existing.name,
              image: user.image ?? existing.image,
              lastLogin: new Date(),
              loginAttempts: 0,
              lockedUntil: null,
            },
          });
        }
        // If user doesn't exist, PrismaAdapter creates them automatically
        // with role = CLIENT (set in GoogleProvider.profile above)
      }
      return true;
    },

    // ── JWT callback ─────────────────────────────────────────────────
    // Runs when a JWT is created (login) or accessed (request).
    // We embed role, onboarded, and permissions into the token so
    // middleware can read them without a DB call.
    async jwt({ token, user, trigger, session }) {
      // On first login, `user` is populated — embed everything
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = (user as any).username ?? "";
        token.onboarded = (user as any).onboarded ?? false;
        token.permissions = (user as any).permissions ?? {};
      }

      // If Google user — fetch onboarded status from DB
      // (PrismaAdapter doesn't pass our custom fields through user object)
      if (token.id && token.role === undefined) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            role: true,
            onboarded: true,
            permissions: true,
            username: true,
          },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.username = dbUser.username ?? "";
          token.onboarded = dbUser.onboarded;
          token.permissions = resolvePermissions(
            dbUser.role,
            dbUser.permissions as Record<string, boolean> | null,
          );
        }
      }

      // Support manual session updates (e.g. after onboarding completes)
      // Call: update({ onboarded: true }) from client to refresh token
      if (trigger === "update" && session?.onboarded !== undefined) {
        token.onboarded = session.onboarded;
      }

      return token;
    },

    // ── session callback ─────────────────────────────────────────────
    // Shapes the session object that useSession() returns on the frontend.
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          username: token.username as string,
          onboarded: token.onboarded as boolean,
          permissions: token.permissions as Permissions,
        },
      };
    },

    // ── redirect callback ─────────────────────────────────────────────
    // Controls where users land after login based on their role.
    //   CLIENT + not onboarded → /onboarding
    //   CLIENT + onboarded     → /clients/dashboard
    //   ADMIN/staff            → /dashboard
    async redirect({ url, baseUrl }) {
      // Allow relative URLs (NextAuth internal redirects)
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login/error",
    newUser: "/onboarding", // Google new users land here first
  },

  debug: process.env.NODE_ENV === "development",

  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        logger.debug("NextAuth Debug", { code, metadata });
      }
    },
  },
};

// ────────────────────────────────────────────────────────────────
// NextAuth type extensions
// These extend the built-in Session and JWT types so TypeScript
// knows about our custom fields throughout the app.
// ────────────────────────────────────────────────────────────────

declare module "next-auth" {
  interface User {
    role: string;
    username: string;
    onboarded: boolean;
    permissions: Permissions;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
      username: string;
      onboarded: boolean;
      permissions: Permissions;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    username: string;
    onboarded: boolean;
    permissions: Permissions;
  }
}
