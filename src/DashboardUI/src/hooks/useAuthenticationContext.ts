import { InteractionStatus } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

export interface User {
  emailAddress: string | null;
}

export interface IAuthenticationContext{
  isAuthenticated: boolean,
  user: User | null
}

export function useAuthenticationContext(): IAuthenticationContext {
  const { instance: msalContext, inProgress } = useMsal();
  //msalContext.acquireTokenSilent()
  const activeAccount = msalContext.getActiveAccount() ?? undefined;
  const isAuthenticated = useIsAuthenticated(activeAccount);
  let user: User | null = null;

  if(isAuthenticated && inProgress !== InteractionStatus.Startup){
    user = {
      emailAddress: activeAccount?.idTokenClaims?.emails?.find(_o => true) ?? null
    }
  }

  return {
    isAuthenticated: isAuthenticated,
    user: user
  }
}