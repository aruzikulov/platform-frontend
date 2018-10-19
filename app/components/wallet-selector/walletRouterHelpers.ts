import { appRoutes } from "../appRoutes";

export function getRedirectionUrl(rootPath: string): string {
  const { loginEto, registerEto } = appRoutes;

  switch (rootPath) {
    case loginEto:
    case registerEto:
      return `${rootPath}/ledger`;
    default:
      return `${rootPath}/light`;
  }
}
