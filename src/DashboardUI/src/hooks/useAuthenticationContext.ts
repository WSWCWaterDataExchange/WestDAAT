import { InteractionStatus, InteractionType } from '@azure/msal-browser';
import { useAccount, useIsAuthenticated, useMsal, useMsalAuthentication } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { loginRequest } from '../authConfig';

export interface User {
  emailAddress: string | null;
  externalAuthId?: string;

  /// <summary>
  /// The non-organization specific roles the user has been assigned to.
  /// This is a custom application attribute configured in b2c.
  /// </summary>
  roles?: string[];

  /// <summary>
  /// The organization specific roles the user has been assigned to.
  /// This is a custom application attribute configured in b2c.
  /// </summary>
  organizationRoles?: OrganizationRole[];
}

export interface OrganizationRole {
  organizationId: string;
  roles: string[];
}

export interface IAuthenticationContext {
  isAuthenticated: boolean;
  user: User | null;
}

export function useAuthenticationContext(): IAuthenticationContext {
  const [authContext, setAuthContext] = useState<IAuthenticationContext>({
    isAuthenticated: false,
    user: null,
  });
  const { inProgress } = useMsal();
  const activeAccount = useAccount() ?? undefined;
  const isAuthenticated = useIsAuthenticated(activeAccount);

  const { result } = useMsalAuthentication(InteractionType.Silent, loginRequest);

  useEffect(() => {
    if (isAuthenticated && inProgress !== InteractionStatus.Startup) {
      const idTokenClaims = result?.account?.idTokenClaims;

      setAuthContext({
        isAuthenticated,
        user: {
          emailAddress: result?.account?.username ?? null,
          externalAuthId: idTokenClaims?.sub, // Subject is b2c user id
          roles: parseRoles(idTokenClaims),
          organizationRoles: parseOrganizationRoles(idTokenClaims),
        },
      });
    } else {
      setAuthContext({
        isAuthenticated,
        user: null,
      });
    }
  }, [result, isAuthenticated, inProgress]);

  return authContext;
}

export const parseRoles = (token: { [key: string]: any } | undefined): string[] | undefined => {
  // Come in the form of "rol_<role1>,rol_<role2>,rol_<role3>"
  const rolesClaims = parseTokenClaims(token, 'extension_westdaat_roles');
  return rolesClaims?.split(',')?.map((role: string) => role.replace('rol_', ''));
};

export const parseOrganizationRoles = (token: { [key: string]: any } | undefined): OrganizationRole[] | undefined => {
  // Come in the form of "org_<orgId1>/rol_<role1>,org_<orgId1>/rol_<role2>,org_<orgId2>/rol_<role1>"
  const orgRoleClaims = parseTokenClaims(token, 'extension_westdaat_organizationRoles');

  const flatOrgRoles = orgRoleClaims?.split(',')?.map((orgRole: string) => {
    const [org, role] = orgRole.split('/');
    return {
      organizationId: org.replace('org_', ''),
      role: role.replace('rol_', ''),
    };
  });

  // Group by organizationId
  const orgRoles = flatOrgRoles?.reduce((acc: OrganizationRole[], orgRole) => {
    const existingOrgRole = acc.find((or) => or.organizationId === orgRole.organizationId);
    if (existingOrgRole) {
      existingOrgRole.roles.push(orgRole.role);
    } else {
      acc.push({
        organizationId: orgRole.organizationId,
        roles: [orgRole.role],
      });
    }
    return acc;
  }, []);

  return orgRoles;
};

const parseTokenClaims = (token: { [key: string]: any } | undefined, claim: string): string => {
  return token?.[claim];
};
