// All available module permission keys
export const ALL_PERMISSION_KEYS = [
  'admin',
  'mis',
  'clients',
  'printers',
  'complaints',
  'dispatch',
  'billing',
  'marketing',
  'orders',
  'pendingWork',
] as const;

export type PermissionKey = typeof ALL_PERMISSION_KEYS[number];
export type Permissions = Record<PermissionKey, boolean>;

/**
 * Returns default permissions based on role.
 * ADMIN gets all permissions enabled.
 * Other roles get all permissions disabled (admin assigns individually).
 */
export function getDefaultPermissionsForRole(role: string): Permissions {
  const allFalse: Permissions = {
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
  };

  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    // Super Admin and Admin get full access to everything
    const allTrue: Permissions = { ...allFalse };
    for (const key of ALL_PERMISSION_KEYS) {
      allTrue[key] = true;
    }
    return allTrue;
  }

  return allFalse;
}

/**
 * Merges stored permissions with defaults, ensuring all keys exist.
 * If user is ADMIN and has empty/no permissions, returns all-true.
 */
export function resolvePermissions(role: string, stored: Record<string, boolean> | null | undefined): Permissions {
  const defaults = getDefaultPermissionsForRole(role);

  if (!stored || Object.keys(stored).length === 0) {
    return defaults;
  }

  // Merge: stored values override defaults, but ensure all keys exist
  const merged: Permissions = { ...defaults };
  for (const key of ALL_PERMISSION_KEYS) {
    if (key in stored) {
      merged[key] = !!stored[key];
    }
  }

  return merged;
}
