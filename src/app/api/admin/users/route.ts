// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { ROLES } from "@/lib/roles";
import { logger } from '@/lib/logger'
import { getDefaultPermissionsForRole } from "@/lib/permissions";
import { safeValidate, createUserSchema, updateUserSchema } from "@/lib/validations/schemas";
import bcrypt from "bcryptjs";

// GET - Fetch all users for admin panel
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SUPER_ADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        permissions: true,
        // Don't include password in response
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    logger.error("Error fetching users", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SUPER_ADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Extract permissions before validation (they are handled separately)
    const userPermissions = body.permissions || {};
    delete body.permissions;

    const validation = safeValidate(createUserSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors
        },
        { status: 400 }
      );
    }

    const { name, email, mobile, password, role } = body;

    // Validate required fields
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: "Name, email, mobile, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email }, // Using email as username
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 14);

    // Resolve permissions: if role is ADMIN, give all permissions; otherwise use what admin selected
    const finalRole = role || "EMPLOYEE";
    const resolvedPermissions = finalRole === ROLES.ADMIN
      ? getDefaultPermissionsForRole(ROLES.ADMIN)
      : userPermissions;

    // Prevent creating Super Admin
    if (finalRole === ROLES.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Cannot create Super Admin users manually" },
        { status: 403 }
      );
    }

    // Create user with permissions
    const user = await prisma.user.create({
      data: {
        username: email, // Using email as username
        email: email,
        password: hashedPassword,
        role: finalRole,
        isActive: true,
        permissions: resolvedPermissions,
      },
    });

    logger.debug('User creation metadata', { permissions: resolvedPermissions, mobile });

    // Send welcome email with credentials (non-blocking)
    try {
      await sendEmail(email, "userCredentials", {
        name: name,
        username: email,
        password: password,
        loginUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
      });
    } catch (emailError) {
      logger.error("Failed to send welcome email, but user was created", { emailError });
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_USER",
        table: "users",
        recordId: user.id,
        newValues: {
          username: user.username,
          email: user.email,
          role: user.role,
          permissions: resolvedPermissions,
        },
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: resolvedPermissions,
      },
    });
  } catch (error) {
    logger.error("Error creating user", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update existing user
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SUPER_ADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Extract permissions before validation
    const userPermissions = body.permissions;
    delete body.permissions;

    // VALIDATE INPUT
    const validation = safeValidate(updateUserSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors
        },
        { status: 400 }
      );
    }

    const { id, name, email, mobile, role, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get current user data for audit log
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true, email: true, isActive: true, permissions: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent modifying Super Admin unless you are Super Admin
    if (currentUser.role === ROLES.SUPER_ADMIN && session.user.role !== ROLES.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Only Super Admin can modify Super Admin account" },
        { status: 403 }
      );
    }

    // Prevent elevating anyone to Super Admin
    if (role === ROLES.SUPER_ADMIN && currentUser.role !== ROLES.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Cannot promote user to Super Admin" },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update permissions if provided
    if (userPermissions !== undefined) {
      // If changing to ADMIN role, give all permissions
      const finalRole = role || currentUser.role;
      updateData.permissions = finalRole === ROLES.ADMIN
        ? getDefaultPermissionsForRole(ROLES.ADMIN)
        : userPermissions;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_USER",
        table: "users",
        recordId: id,
        oldValues: {
          email: currentUser.email,
          role: currentUser.role,
          isActive: currentUser.isActive,
          permissions: currentUser.permissions,
        },
        newValues: {
          email: updatedUser.email,
          role: updatedUser.role,
          isActive: updatedUser.isActive,
          permissions: updatedUser.permissions,
        },
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        permissions: updatedUser.permissions,
      },
    });
  } catch (error) {
    logger.error("Error updating user", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SUPER_ADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Can't delete yourself
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Get user data for audit log
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Can't delete Super Admin
    if (userToDelete.role === ROLES.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Cannot delete Super Admin account" },
        { status: 403 }
      );
    }

    // Delete user (this will cascade delete related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE_USER",
        table: "users",
        recordId: userId,
        oldValues: {
          username: userToDelete.username,
          email: userToDelete.email,
          role: userToDelete.role,
        },
      },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting user", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
