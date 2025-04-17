import { Role } from '../config/role';
import { User } from '../hooks/useAuthenticationContext';
import { Permission, RolePermissions } from '../roleConfig';
import { hasPermission } from './securityHelpers';

describe('securityHelpers', () => {
  describe('hasPermission', () => {
    it('should return false when user is null', () => {
      const result = hasPermission(null, 'PermissionA' as Permission);
      expect(result).toBe(false);
    });

    it('should return true when user is GlobalAdmin', () => {
      const user = { roles: [Role.GlobalAdmin] } as User;

      const result = hasPermission(user, 'AnyPermission' as Permission);

      expect(result).toBe(true);
    });

    it('should return true when user has the permission', () => {
      const user = { roles: [Role.Member] } as User;

      const result = hasPermission(user, RolePermissions[Role.Member][0]);

      expect(result).toBe(true);
    });

    it('should return false when user does not have the permission', () => {
      const user = { roles: [Role.Member] } as User;

      const adminOnlyPermissions = RolePermissions[Role.OrganizationAdmin].filter(permission => {
        return !RolePermissions[Role.Member].includes(permission)
      });

      const result = hasPermission(user, adminOnlyPermissions[0]);

      expect(result).toBe(false);
    });
  });
});
