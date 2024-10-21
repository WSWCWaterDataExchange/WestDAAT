import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { useAccount, useIsAuthenticated, useMsal, useMsalAuthentication } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { loginRequest } from "../authConfig";

export interface User {
  emailAddress: string | null;
}

export interface IAuthenticationContext{
  isAuthenticated: boolean,
  user: User | null,
}

export function useAuthenticationContext(): IAuthenticationContext {
  const [authContext, setAuthContext] = useState<IAuthenticationContext>({ isAuthenticated: false, user: null });
  const { inProgress } = useMsal();
  const activeAccount = useAccount() ?? undefined;  
  const isAuthenticated = useIsAuthenticated(activeAccount);

  const { result } = useMsalAuthentication(InteractionType.Silent, loginRequest);

  useEffect(() => {        
    if(isAuthenticated && inProgress !== InteractionStatus.Startup) {
      setAuthContext({
        isAuthenticated,
        user: {
          emailAddress: result?.account?.idTokenClaims?.emails?.find(() => true) ?? null
        }
      });   
    }
    else {
      setAuthContext({
        isAuthenticated,
        user: null
      });
    }
  }, [result, isAuthenticated, inProgress])
  
  return authContext;
}