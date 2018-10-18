import { promisify } from "bluebird";
import * as Eip55 from "eip55";
import * as LightWalletProvider from "eth-lightwallet";
import * as ethSig from "eth-sig-util";
import { addHexPrefix, hashPersonalMessage, toBuffer } from "ethereumjs-util";

/*
Pre-login user for faster tests
*/

const INVESTOR_WALLET_KEY = "NF_WALLET_METADATA";
const ISSUER_WALLET_KEY = "NF_WALLET_ISSUER_METADATA";
const JWT_KEY = "NF_JWT";

export const createAndLoginNewUser = (
  params: {
    type?: "investor" | "issuer";
    kyc?: "business" | "individual";
    seed?: string;
    clearPendingTransactions?: boolean;
  } = {},
) => {
  return cy.clearLocalStorage().then(async ls => {
    const userType = params.type ? params.type : "investor";

    const {
      lightWalletInstance,
      salt,
      address,
      privateKey,
      walletKey,
    } = await createLightWalletWithKeyPair(params.seed);

    // set wallet data on local storage
    ls.setItem(
      userType === "investor" ? INVESTOR_WALLET_KEY : ISSUER_WALLET_KEY,
      JSON.stringify({
        address,
        email: "dave@neufund.org",
        salt: salt,
        walletType: "LIGHT",
        vault: lightWalletInstance.serialize(),
      }),
    );

    // fetch a token and store it in local storage
    const jwt = await getJWT(address, lightWalletInstance, walletKey);
    ls.setItem(JWT_KEY, `"${jwt}"`);

    // create a user object on the backend
    await createUser(privateKey, userType, params.kyc);

    // mark backup codes verified
    await markBackupCodesVerified(jwt);

    if (params.clearPendingTransactions) {
      await clearPendingTransactions(jwt, address);
    }
  });
};

/**
 * Create a light wallet with a given seed
 * @param seed
 */
export const DEFAULT_PASSWORD = "blablabla";
export const DEFAULT_HD_PATH = "m/44'/60'/0'";
export const createLightWalletWithKeyPair = async (seed?: string) => {
  // promisify some stuff
  const create = promisify<any, any>(LightWalletProvider.keystore.createVault);

  // create a new wallet
  const entropyStrength = 256;
  seed = seed ? seed : LightWalletProvider.keystore.generateRandomSeed(undefined, entropyStrength);
  const salt = LightWalletProvider.keystore.generateSalt(32);
  const lightWalletInstance = await create({
    password: DEFAULT_PASSWORD,
    seedPhrase: seed,
    hdPathString: DEFAULT_HD_PATH,
    salt,
  });

  // create keypair
  const keyFromPassword = promisify<any, any>(
    lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
  );
  const walletKey: any = await keyFromPassword(DEFAULT_PASSWORD);
  lightWalletInstance.generateNewAddress(walletKey, 1);
  let address = lightWalletInstance.getAddresses()[0];
  address = Eip55.encode(address);
  const privateKey = lightWalletInstance.exportPrivateKey(address, walletKey);

  return { lightWalletInstance, salt, address, privateKey, walletKey };
};

/**
 * Create a user object with the dev services
 * User will have an accepted email address as well as
 * an accepted kyc, if requested
 */
const CREATE_USER_PATH = "/api/external-services-mock/e2e-tests/user/";

export const createUser = (
  privateKey: string,
  userType: "investor" | "issuer",
  kyc?: "business" | "individual",
) => {
  let path = `${CREATE_USER_PATH}?private_key=0x${privateKey}&user_type=${userType}`;
  if (kyc) {
    path += `&kyc=${kyc}`;
  }
  return fetch(path, {
    method: "POST",
  });
};

/**
 * Get a jwt from the server
 * This could maybe be replaced by a called to the mockservices
 */
const CHALLENGE_PATH = "/api/signature/jwt/challenge";
const JWT_PATH = "/api/signature/jwt/create";

export const getJWT = async (
  address: string,
  lightWalletInstance: any,
  walletKey: any,
): Promise<string> => {
  // first get a challenge
  const headers = {
    "Content-Type": "application/json",
  };
  const challenge_body = {
    address,
    salt: "4abc08069f8c6d26becd80fe96fbeaf4d17b84cdbe7071a8197ab5370bb85876",
    signer_type: "eth_sign",
    permissions: [],
  };
  const ch_response = await fetch(CHALLENGE_PATH, {
    headers,
    method: "POST",
    body: JSON.stringify(challenge_body),
  });
  const ch_result = await ch_response.json();
  const challenge = ch_result.challenge;

  // now sign it...
  const msgHash = hashPersonalMessage(toBuffer(addHexPrefix(challenge)));
  const rawSignedMsg = await LightWalletProvider.signing.signMsgHash(
    lightWalletInstance,
    walletKey,
    msgHash.toString("hex"),
    address,
  );

  // ... and request the jwt
  const signedChallenge = ethSig.concatSig(rawSignedMsg.v, rawSignedMsg.r, rawSignedMsg.s);
  const signed_body = {
    challenge,
    response: signedChallenge,
    signer_type: "eth_sign",
  };
  const sig_response = await fetch(JWT_PATH, {
    headers,
    method: "POST",
    body: JSON.stringify(signed_body),
  });
  const sig_result = await sig_response.json();
  return sig_result.jwt;
};

const USER_PATH = "/api/user/user/me";

export const markBackupCodesVerified = async (jwt: string) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${jwt}`,
  };
  const response = await fetch(USER_PATH, {
    headers,
    method: "GET",
  });
  const userJson = await response.json();

  userJson.backup_codes_verified = true;
  await fetch(USER_PATH, {
    headers,
    method: "PUT",
    body: JSON.stringify(userJson),
  });
};

const PENDING_TRANSACTIONS_PATH = "/api/user/pending_transactions/me/";
export const clearPendingTransactions = async (jwt: string, address: string) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${jwt}`,
  };
  await fetch(PENDING_TRANSACTIONS_PATH + address, {
    headers,
    method: "DELETE",
  });
};
