import React from 'react';
import { IPublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

function handleLogin(msalContext: IPublicClientApplication | null) {    

  if(!msalContext) return;

  msalContext.loginPopup(loginRequest)
    .then((authResult) => {
      msalContext.setActiveAccount(authResult.account);    
    })
    .catch((e) => {
      console.error(e);
    });     
}

export const SignIn = () => {
  const { instance } = useMsal();

  return (
      <span className="sign-in-span" onClick={() => handleLogin(instance)}>Sign In</span>
  );
}