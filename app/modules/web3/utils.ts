import * as Eip55 from "eip55";
import * as Web3Utils from "web3-utils";

import { TBigNumberVariant } from '../../lib/web3/types';
import { EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId } from "../../types";
import { compareBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Number.utils";

export function makeEthereumAddressChecksummed(
  ethereumAddress: EthereumAddress,
): EthereumAddressWithChecksum {
  return Eip55.encode(ethereumAddress) as EthereumAddressWithChecksum;
}

export function ethereumNetworkIdToNetworkName(networkId: EthereumNetworkId): string {
  switch (networkId) {
    case "0":
      return "Dev";
    case "1":
      return "Mainnet";
    case "2":
      return "Morden";
    case "3":
      return "Ropsten";
    case "4":
      return "Rinkeby";
    default:
      return "Unknown";
  }
}

export const validateAddress = (value: string) => Web3Utils.isAddress(value.toUpperCase());

export const doesUserHaveEnoughEther = (
  value: TBigNumberVariant,
  maxEther: TBigNumberVariant,
): boolean => {
  if (value === "") return false;
  return compareBigNumbers(convertToBigInt(value || "0"), maxEther) < 0;
};
