export const appRoutes = {
  verify: "/email-verify",

  root: "/",

  register: "/register",
  registerEto: "/eto/register",
  login: "/login",
  loginEto: "/eto/login",
  restore: "/restore",
  restoreEto: "/eto/restore",
  etoIssuerView: "/eto/view",
  etoPublicView: "/eto/view/:previewCode",
  etoPublicViewById: "/eto/view/by-id/:etoId",
  etoWidgetView: "/embed/eto/widget/:previewCode",

  kyc: "/kyc",
  wallet: "/wallet",
  dashboard: "/dashboard",
  documents: "/documents",
  settings: "/settings",
  demo: "/demo",
  eto: "/eto",
  etoLanding: "/eto-landing",

  etoRegister: "/eto/registration",

  portfolio: "/portfolio",
};
