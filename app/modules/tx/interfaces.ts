interface IWithdrawDraftType {
  type: ETxSenderType.WITHDRAW;
  to: string;
  value: string;
}

export type IDraftType = IWithdrawDraftType;

export enum ETxSenderType {
  WITHDRAW = "WITHDRAW",
  INVEST = "INVEST",
  UPGRADE = "UPGRADE",
}

export enum ETokenType {
  ETHER = "ETHER",
  EURO = "EURO",
}
