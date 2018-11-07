import { IAppState } from "../store";
import { selectBackupCodesVerified, selectIsUserEmailVerified } from "./auth/selectors";
import { selectKycRequestStatus } from "./kyc/selectors";
import { selectIsLightWallet } from "./web3/selectors";

export const SelectIsVerificationFullyDone = (s: IAppState) =>
  !!(
    selectIsUserEmailVerified(s.auth) &&
    (selectBackupCodesVerified(s.auth) || !selectIsLightWallet(s.web3)) &&
    selectKycRequestStatus(s.kyc) === "Accepted"
  );
