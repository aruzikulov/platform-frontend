import * as Yup from "yup";
import { WalletSubType, WalletType } from "../../../modules/web3/types";
import * as YupTS from "../../yup-ts";

export enum EUserType {
  INVESTOR = "investor",
  ISSUER = "issuer",
}

export interface IUser {
  userId: string;
  backupCodesVerified?: boolean;
  language?: string;
  unverifiedEmail?: string;
  verifiedEmail?: string;
  type: EUserType;
  walletType: WalletType;
  walletSubtype: WalletSubType;
}

export interface IEmailStatus {
  isAvailable: boolean;
}

export interface IUserInput {
  newEmail?: string;
  salt?: string;
  language?: string;
  backupCodesVerified?: boolean;
  type: EUserType;
  walletType: WalletType;
  walletSubtype: WalletSubType;
}

export interface IVerifyEmailUser {
  verificationCode: string;
}

export const UserValidator = Yup.object()
  .shape({
    userId: Yup.string().required(),
    backupCodesVerified: Yup.boolean(),
    language: Yup.string(),
    unverifiedEmail: Yup.string(),
    verifiedEmail: Yup.string(),
    type: Yup.string().oneOf(["investor", "issuer"]),
    walletType: Yup.string().oneOf(Object.keys(WalletType).map(type => type.toLowerCase())),
    walletSubtype: Yup.string().oneOf(Object.keys(WalletSubType).map(type => type.toLowerCase())),
  })
  .required();

export const emailStatus = Yup.object().shape({
  isAvailable: Yup.boolean(),
});

export const TxSchema = YupTS.object({
  blockHash: YupTS.string().optional(),
  blockNumber: YupTS.string().optional(),
  chainId: YupTS.string().optional(),
  from: YupTS.string(),
  gas: YupTS.string(),
  gasPrice: YupTS.string(),
  hash: YupTS.string(),
  input: YupTS.string(),
  nonce: YupTS.string(),
  status: YupTS.string().optional(),
  to: YupTS.string(),
  transactionIndex: YupTS.string().optional(),
  value: YupTS.string(),
});

export const TxWithMetadataSchema = YupTS.object({
  transaction: TxSchema,
  transactionType: YupTS.string(),
});

export const PendingTxsSchema = YupTS.object({
  // it's a pending transaction issued by us
  pendingTransaction: TxWithMetadataSchema.optional(),
  // list of other pending transaction (out of bounds transactions) issued externally
  oooTransactions: YupTS.array(TxSchema),
});

export type TxWithMetadata = YupTS.TypeOf<typeof TxWithMetadataSchema>;
export type TPendingTxs = YupTS.TypeOf<typeof PendingTxsSchema>;
export const TxWithMetadataValidator = TxWithMetadataSchema.toYup();
export const TPendingTxsValidator = PendingTxsSchema.toYup();
export const TxWithMetadataListValidator = YupTS.array(TxWithMetadataSchema).toYup();
