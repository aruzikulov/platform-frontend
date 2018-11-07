import { createSelector } from "reselect";

import { EUserType, IUser } from "../../lib/api/users/interfaces";
import { IAppState } from "../../store";
import { selectKycRequestStatus } from "../kyc/selectors";
import { IAuthState } from "./reducer";

export const selectIsAuthorized = (state: IAuthState): boolean => !!(state.jwt && state.user);
export const selectUserType = (state: IAuthState): EUserType | undefined =>
  state.user && state.user.type;

export const selectUserEmail = (state: IAuthState): string | undefined =>
  state.user && (state.user.unverifiedEmail || state.user.verifiedEmail);

export const selectVerifiedUserEmail = (state: IAuthState): string | undefined =>
  state.user && state.user.verifiedEmail;

export const selectUnverifiedUserEmail = (state: IAuthState): string | undefined =>
  state.user && state.user.unverifiedEmail;

export const selectUser = (state: IAuthState): IUser | undefined => state.user;

export const selectBackupCodesVerified = (state: IAuthState): boolean =>
  !!state.user && !!state.user.backupCodesVerified;

export const selectIsUserEmailVerified = (state: IAuthState): boolean =>
  !!state.user && !!state.user.verifiedEmail;

export const selectIsThereUnverifiedEmail = (state: IAuthState): boolean =>
  !!state.user && !!state.user.unverifiedEmail;

export const selectDoesEmailExist = (state: IAuthState): boolean =>
  selectIsThereUnverifiedEmail(state) || selectIsUserEmailVerified(state);

export const selectIsUserVerified = (state: IAppState): boolean =>
  selectIsUserEmailVerified(state.auth) && selectKycRequestStatus(state.kyc) === "Accepted";

export const selectIsInvestor = (state: IAppState): boolean =>
  selectUserType(state.auth) === EUserType.INVESTOR;

export const selectIsVerifiedInvestor = createSelector(
  selectIsInvestor,
  selectIsUserVerified,
  (isInvestor, isUserVerified) => isInvestor && isUserVerified,
);
