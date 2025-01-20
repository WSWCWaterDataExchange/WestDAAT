import { parseRoles, OrganizationRole, parseOrganizationRoles } from './useAuthenticationContext';

describe('useAuthenticationContext', () => {
  const rolesClaim = 'extension_westdaat_roles';
  const orgRolesClaim = 'extension_westdaat_organizationRoles';

  describe('parseRoles', () => {
    it('should parse multiple roles', () => {
      // Arrange
      const roles = ['Admin', 'SuperAdmin'];
      const token = buildToken({ roles });

      // Act
      const result = parseRoles(token);

      // Assert
      expect(result).toEqual(roles);
    });

    it('should return undefined if no roles', () => {
      // Arrange
      const token = buildToken({});

      // Act
      const result = parseRoles(token);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('parseOrganizationRoles', () => {
    it('should parse multiple organization roles', () => {
      // Arrange
      const orgRoles: OrganizationRole[] = [
        { organizationId: '1', roles: ['Admin', 'SuperAdmin'] },
        { organizationId: '2', roles: ['Admin'] },
      ];
      const token = buildToken({ orgRoles });

      // Act
      const result = parseOrganizationRoles(token);

      // Assert
      expect(result).toEqual(orgRoles);
    });

    it('should return undefined if no organization roles', () => {
      // Arrange
      const token = buildToken({});

      // Act
      const result = parseOrganizationRoles(token);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  const buildToken = (token: { roles?: string[]; orgRoles?: OrganizationRole[] }): { [key: string]: any } => {
    return {
      [rolesClaim]: token?.roles?.join(','),
      [orgRolesClaim]: token?.orgRoles
        ?.map((or) => or.roles.map((r) => `org_${or.organizationId}/rol_${r}`).join(','))
        .join(','),
    };
  };
});
