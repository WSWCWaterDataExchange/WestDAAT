import { Configuration } from "@azure/msal-browser";

export const msalConfig : Configuration = {
  auth: {
    clientId: "ab3cf308-8a7e-404e-977c-d0227f4a48c4",
    authority: "https://westdaatqa.b2clogin.com/westdaatqa.onmicrosoft.com/b2c_1_signupsignin", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    knownAuthorities: ["https://westdaatqa.b2clogin.com/westdaatqa.onmicrosoft.com"],
    redirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
 scopes: ["openid"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com"
};