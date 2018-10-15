import BigNumber from "bignumber.js";

export const LIGHT_WALLET_PASSWORD_CACHE_TIME = 1000 * 60 * 10;

/**
 * We assume common digits for all currencies on our platform.
 */
export const MONEY_DECIMALS = 18;

/**
 * Constants for permissions
 */
export const SUBMIT_KYC_PERMISSION = "submit-kyc";
export const CHANGE_EMAIL_PERMISSION = "change-email";
export const SUBMIT_ETO_PERMISSION = "submit-eto-listing";
export const UPLOAD_IMMUTABLE_DOCUMENT = "upload-issuer-immutable-document";
export const DO_BOOK_BUILDING = "do-bookbuilding";

/**
 *  Constants for JWT tokens
 */
export const MAX_EXPIRATION_DIFF_MINUTES = 10;

/**
 * Useful for money related calculations
 */
export const Q18 = new BigNumber(10).pow(18);

/**
 * Represesnt zero address on Etherum - non existing address used by ERC20 to mark minting and burning
 */
export const ETHEREUM_ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// TODO: Replace by loading terms from universe (smart contract)
export const PlatformTerms = {
  MIN_TICKET_EUR_ULPS: Q18.mul(100),
};
