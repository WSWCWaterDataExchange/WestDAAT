import { InteractionStatus } from '@azure/msal-browser';
import { useAccount, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { loginRequest } from '../authConfig';
import { Role } from '../config/role';

export interface User {
  emailAddress: string | null;
  externalAuthId?: string;

  /// <summary>
  /// The non-organization specific roles the user has been assigned to.
  /// This is a custom application attribute configured in b2c.
  /// </summary>
  roles?: Role[];

  /// <summary>
  /// The organization specific roles the user has been assigned to.
  /// This is a custom application attribute configured in b2c.
  /// </summary>
  organizationRoles?: OrganizationRole[];
}

export interface OrganizationRole {
  organizationId: string;
  roles: Role[];
}

export interface IAuthenticationContext {
  authenticationComplete: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export function useAuthenticationContext(): IAuthenticationContext {
  const [authContext, setAuthContext] = useState<IAuthenticationContext>({
    authenticationComplete: false,
    isAuthenticated: false,
    user: null,
  });
  const { inProgress, instance: msalContext } = useMsal();
  const activeAccount = useAccount() ?? undefined;
  const isAuthenticated = useIsAuthenticated(activeAccount);

  const authenticationComplete = inProgress === InteractionStatus.None;

  useEffect(() => {
    if (isAuthenticated && inProgress !== InteractionStatus.Startup) {
      msalContext.acquireTokenSilent(loginRequest).then((result) => {
        const idTokenClaims = result?.account?.idTokenClaims;
        setAuthContext({
          isAuthenticated,
          authenticationComplete,
          user: {
            emailAddress: result?.account?.username ?? null,
            externalAuthId: idTokenClaims?.sub, // Subject is b2c user id (object id)
            roles: parseRoles(idTokenClaims),
            organizationRoles: parseOrganizationRoles(idTokenClaims),
          },
        });
      });
    } else {
      setAuthContext({
        isAuthenticated,
        authenticationComplete,
        user: null,
      });
    }

    setAuthContext((prev) => ({
      ...prev,
      authenticationComplete: inProgress === InteractionStatus.None,
    }));
  }, [isAuthenticated, inProgress]);

  return authContext;
}

export const parseRoles = (token: { [key: string]: any } | undefined): Role[] | undefined => {
  // Come in the form of "rol_<role1>,rol_<role2>,rol_<role3>"
  const rolesClaims = parseTokenClaims(token, 'extension_westdaat_roles');

  if (!rolesClaims) {
    return [];
  }

  return rolesClaims?.split(',')?.map((role: string) => role.replace('rol_', '') as Role);
};

export const parseOrganizationRoles = (token: { [key: string]: any } | undefined): OrganizationRole[] | undefined => {
  // Come in the form of "org_<orgId1>/rol_<role1>,org_<orgId1>/rol_<role2>,org_<orgId2>/rol_<role1>"
  const orgRoleClaims = parseTokenClaims(token, 'extension_westdaat_organizationRoles');

  if (!orgRoleClaims) {
    return [];
  }

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
      existingOrgRole.roles.push(orgRole.role as Role);
    } else {
      acc.push({
        organizationId: orgRole.organizationId,
        roles: [orgRole.role as Role],
      });
    }
    return acc;
  }, []);

  return orgRoles;
};

const parseTokenClaims = (token: { [key: string]: any } | undefined, claim: string): string => {
  return token?.[claim];
};
