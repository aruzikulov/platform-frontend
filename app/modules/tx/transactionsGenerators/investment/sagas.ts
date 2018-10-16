import { BigNumber } from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { select } from "redux-saga/effects";
import { DeferredTransactionWrapper } from "./../../../../lib/contracts/typechain-runtime";
import { compareBigNumbers } from "./../../../../utils/BigNumberUtils";
import { EInvestmentType } from "./../../../investmentFlow/reducer";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxParams } from "../../../../lib/contracts/typechain-runtime";
import { ContractsService } from "../../../../lib/web3/ContractsService";
import { ITxData } from "../../../../lib/web3/Web3Manager";
import { IAppState } from "../../../../store";
import { selectGasPrice } from "../../../gas/selectors";
import { selectReadyToInvest } from "../../../investmentFlow/selectors";
import { selectEtoById } from "../../../public-etos/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";

async function createTxData(
  state: IAppState,
  txData: DeferredTransactionWrapper<ITxParams>,
  contractAddress: string,
): Promise<ITxData> {
  const txInitialDetails = {
    to: contractAddress,
    from: selectEthereumAddressWithChecksum(state),
    data: txData.getData(),
    value: "0",
    gasPrice: selectGasPrice(state)!.standard,
  };
  const estimatedGas = await txData.estimateGas(txInitialDetails);
  return {
    ...txInitialDetails,
    gas: addHexPrefix(new BigNumber(estimatedGas).toString(16)),
  };
}

function getEtherLockTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): Promise<ITxData> {
  const txData = contractsService.etherLock.transferTx(
    etoId,
    new BigNumber(state.investmentFlow.ethValueUlps),
    [""],
  );
  return createTxData(state, txData, contractsService.etherLock.address);
}

function getEuroLockTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): Promise<ITxData> {
  const txData = contractsService.euroLock.transferTx(
    etoId,
    new BigNumber(state.investmentFlow.euroValueUlps),
    [""],
  );
  return createTxData(state, txData, contractsService.euroLock.address);
}

async function getEtherTokenTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): Promise<ITxData> {
  const etherTokenBalance = state.wallet.data!.etherTokenBalance;
  const etherValue = state.investmentFlow.ethValueUlps;
  const gasPrice = selectGasPrice(state);

  // transaction can be fully covered by etherTokens
  if (compareBigNumbers(etherTokenBalance, etherValue) >= 0) {
    // need to call 3 args version of transfer method. See the abi in the contract.
    // so we call the rawWeb3Contract directly
    const txInput = contractsService.etherToken.rawWeb3Contract.transfer[
      "address,uint256,bytes"
    ].getData(etoId, etherValue, "");
    return createTxData(state, txInput, contractsService.etherToken.address);

    // fill up etherToken with ether from wallet
  } else {
    const ethVal = new BigNumber(etherValue);
    const difference = ethVal.sub(etherTokenBalance);
    const txCall = contractsService.etherToken.depositAndTransferTx(etoId, ethVal, [""]);

    const txInitialDetails = {
      to: contractsService.etherToken.address,
      from: selectEthereumAddressWithChecksum(state),
      data: txCall.getData(),
      value: difference.toString(),
      gasPrice: gasPrice!.standard,
    };

    const estimatedGas = await txCall.estimateGas(txInitialDetails);
    return {
      ...txInitialDetails,
      gas: addHexPrefix(new BigNumber(estimatedGas).toString(16)),
    };
  }
}

export function* generateInvestmentTransaction({ contractsService }: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const investmentState = state.investmentFlow;
  const eto = selectEtoById(state.publicEtos, investmentState.etoId);

  if (!eto || !selectReadyToInvest(investmentState)) {
    throw new Error("Investment data is not valid to create an Transaction");
  }

  switch (investmentState.investmentType) {
    case EInvestmentType.InvestmentWallet:
      return getEtherTokenTransaction(state, contractsService, eto.etoId);
    case EInvestmentType.ICBMEth:
      return getEtherLockTransaction(state, contractsService, eto.etoId);
    case EInvestmentType.ICBMnEuro:
      return getEuroLockTransaction(state, contractsService, eto.etoId);
  }
}
