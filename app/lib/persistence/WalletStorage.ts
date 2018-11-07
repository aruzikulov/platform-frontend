import { inject, injectable } from "inversify";
import { symbols } from "../../di/symbols";
import { selectUserType } from "../../modules/auth/selectors";
import { IAppState } from "../../store";
import { invariant } from "../../utils/invariant";
import { EUserType } from "../api/users/interfaces";
import { ILogger } from "../dependencies/Logger";
import { ObjectStorage } from "./ObjectStorage";
import { Storage } from "./Storage";

import {
  STORAGE_WALLET_METADATA_INVESTOR_KEY,
  STORAGE_WALLET_METADATA_ISSUER_KEY,
} from "./WalletMetadataObjectStorage";

/*
  Stores wallet metadata in the correct location based on whether the user was an 
  Investor or an Issuer. Generally when using this class it is better to let 
  methods automatically detect the user type this is done via selectUserType
  selector.

  In cases where user type is clear, Login or registration for example.
  Use `forcedUserType` to override the selector and use a forced user type
*/

@injectable()
export class WalletStorage<TWalletMetadata> {
  private walletMetadataStorageInvestor: ObjectStorage<TWalletMetadata>;
  private walletMetadataStorageIssuer: ObjectStorage<TWalletMetadata>;

  constructor(
    @inject(symbols.storage) private readonly storage: Storage,
    @inject(symbols.logger) private readonly logger: ILogger,
    @inject(symbols.getState) private readonly getState: () => IAppState,
  ) {
    this.walletMetadataStorageInvestor = new ObjectStorage<TWalletMetadata>(
      this.storage,
      this.logger,
      STORAGE_WALLET_METADATA_INVESTOR_KEY,
    );
    this.walletMetadataStorageIssuer = new ObjectStorage<TWalletMetadata>(
      this.storage,
      this.logger,
      STORAGE_WALLET_METADATA_ISSUER_KEY,
    );
  }

  public set(value: TWalletMetadata, forcedUserType?: EUserType): void {
    const userType = forcedUserType || selectUserType(this.getState().auth);

    switch (userType) {
      case EUserType.ISSUER:
        this.walletMetadataStorageIssuer.set(value);
        break;
      case EUserType.INVESTOR:
        this.walletMetadataStorageInvestor.set(value);
        break;
      default:
        invariant(false, "Unknown user type");
    }
  }

  public get(forcedUserType?: EUserType): TWalletMetadata | undefined {
    const userType = forcedUserType || selectUserType(this.getState().auth);

    switch (userType) {
      case EUserType.ISSUER:
        return this.walletMetadataStorageIssuer.get();
      case EUserType.INVESTOR:
        return this.walletMetadataStorageInvestor.get();
      default:
        invariant(false, "Unknown user type");
    }
  }

  public clear(userType: EUserType): void {
    switch (userType) {
      case EUserType.ISSUER:
        return this.walletMetadataStorageIssuer.clear();
      case EUserType.INVESTOR:
        return this.walletMetadataStorageInvestor.clear();
      default:
        invariant(false, "Unknown user type");
    }
  }
}
