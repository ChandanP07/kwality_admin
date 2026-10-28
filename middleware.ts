// middleware.ts (in root directory)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Map route prefixes to permission keys
const routePermissionMap: Record<string, string> = {
  "/dashboard/admin": "admin",
  "/dashboard/mis": "mis",
  "/dashboard/chalan": "billing",
  "/dashboard/clients": "clients",
  "/dashboard/printers": "printers",
  "/dashboard/complaints": "complaints",
  "/dashboard/dispatch": "dispatch",
  "/dashboard/marketing": "marketing",
  "/dashboard/orders": "orders",
  "/dashboard/pending-work": "pendingWork",
  "/dashboard/billing": "billing",
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const permissions = (token?.permissions || {}) as Record<string, boolean>;

    // Check route-level permissions
    for (const [routePrefix, permKey] of Object.entries(routePermissionMap)) {
      if (pathname.startsWith(routePrefix) && !permissions[permKey]) {
        return NextResponse.redirect(new URL("/dashboard/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to login page without token
        if (pathname === "/login") {
          // If already logged in, redirect to dashboard
          return !token;
        }

        // Require token for dashboard routes - ANY logged-in user
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  // matcher: ['/dashboard/:path*', '/login']
  matcher: ["/dashboard/:path*"],
};
