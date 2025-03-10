import { Role } from '../config/role';
import { parseRoles, OrganizationRole, parseOrganizationRoles } from './useAuthenticationContext';

describe('useAuthenticationContext', () => {
  const rolesClaim = 'extension_westdaat_roles';
  const orgRolesClaim = 'extension_westdaat_organizationRoles';

  describe('parseRoles', () => {
    it('should parse multiple roles', () => {
      // Arrange
      const roles = [Role.GlobalAdmin, Role.TechnicalReviewer];
      const token = buildToken({ roles });

      // Act
      const result = parseRoles(token);

      // Assert
      expect(result).toEqual(roles);
    });

    it('should return empty array if no roles', () => {
      // Arrange
      const token = buildToken({});

      // Act
      const result = parseRoles(token);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('parseOrganizationRoles', () => {
    it('should parse multiple organization roles', () => {
      // Arrange
      const orgRoles: OrganizationRole[] = [
        { organizationId: '1', roles: [Role.GlobalAdmin, Role.TechnicalReviewer] },
        { organizationId: '2', roles: [Role.Member] },
      ];
      const token = buildToken({ orgRoles });

      // Act
      const result = parseOrganizationRoles(token);

      // Assert
      expect(result).toEqual(orgRoles);
    });

    it('should return empty if no organization roles', () => {
      // Arrange
      const token = buildToken({});

      // Act
      const result = parseOrganizationRoles(token);

      // Assert
      expect(result).toEqual([]);
    });
  });

  const buildToken = (token: { roles?: string[]; orgRoles?: OrganizationRole[] }): { [key: string]: any } => {
    return {
      [rolesClaim]: token?.roles?.join(',') ?? "",
      [orgRolesClaim]: token?.orgRoles
        ?.map((or) => or.roles.map((r) => `org_${or.organizationId}/rol_${r}`).join(','))
        .join(',') ?? "",
    };
  };
});
