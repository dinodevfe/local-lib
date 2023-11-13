export const ApplicationName = process.env.REACT_APP_NAME;

export const QueryParameterNames = {
  ReturnUrl: "returnUrl",
  Message: "message",
};

export const LogoutActions = {
  LogoutCallback: "logout-callback",
  Logout: "logout",
  LoggedOut: "logged-out",
  HomePage: "/",
};

export const LoginActions = {
  Login: "login",
  LoginCallback: "login-callback",
  LoginFailed: "login-failed",
  Profile: "profile",
  Register: "register",
  AccessDenied: "access-denied",
};

const prefix = "/authentication";

export const ApplicationPaths = {
  Origin: function (segment: string | undefined = process.env.PUBLIC_URL) {
    return window.location.origin + segment;
  },
  DefaultLoginRedirectPath: "/",
  ApiAuthorizationClientConfigurationUrl: `/_configuration/${ApplicationName}`,
  ApiAuthorizationPrefix: prefix,
  Login: `${prefix}/${LoginActions.Login}`,
  LoginFailed: `${prefix}/${LoginActions.LoginFailed}`,
  LoginCallback: `${prefix}/${LoginActions.LoginCallback}`,
  Register: `${prefix}/${LoginActions.Register}`,
  Profile: `${prefix}/${LoginActions.Profile}`,
  AccessDenied: `${prefix}/${LoginActions.AccessDenied}`,
  LogOut: `${prefix}/${LogoutActions.Logout}`,
  LoggedOut: `${prefix}/${LogoutActions.LoggedOut}`,
  LogOutCallback: `${prefix}/${LogoutActions.LogoutCallback}`,
  IdentityAccessDenied: "/Identity/Account/AccessDenied",
  IdentityRegisterPath: "Identity/Account/Register",
  IdentityManagePath: "Identity/Account/Manage",
  HomePage: `${LogoutActions.HomePage}`,
};
