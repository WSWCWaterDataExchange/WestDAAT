import { Role } from '../config/role';
import { User } from '../hooks/useAuthenticationContext';
import { Permission, RolePermissions } from '../roleConfig';

export const getUserOrganization = (user: User | null): string | null => {
  // Assumes user only has one organization
  return user?.organizationRoles?.[0]?.organizationId ?? null;
};

export const hasUserRole = (user: User | null, role: Role): boolean => {
  return user?.roles?.some((userRole) => userRole === role) ?? false;
};

export const hasOrganizationRole = (user: User | null, role: Role): boolean => {
  return (
    user?.organizationRoles?.some((organizationRole) => organizationRole.roles.some((userRole) => userRole === role)) ??
    false
  );
};

export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) {
    return false;
  }

  if (hasUserRole(user, Role.GlobalAdmin)) {
    return true;
  }

  const nonOrgRoles = user.roles ?? [];
  const orgRoles = user.organizationRoles?.flatMap((orgRole) => orgRole.roles) ?? [];
  const userRoles = [...nonOrgRoles, ...orgRoles];

  return userRoles.some((role) => {
    const rolePermissions = RolePermissions[role];
    if (rolePermissions === undefined) {
      console.error(`Role '${role}' not found in RolePermissions`);
      return false;
    }

    return rolePermissions.includes(permission);
  });
};
