import { BigNumber } from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { select } from "redux-saga/effects";
import { DeferredTransactionWrapper, ITxParams } from "../../../../lib/contracts/typechain-runtime";
import { compareBigNumbers } from "./../../../../utils/BigNumberUtils";
import { EInvestmentType } from "./../../../investmentFlow/reducer";
import { selectEtherTokenBalance } from "./../../../wallet/selectors";

import { TGlobalDependencies } from "../../../../di/setupBindings";
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
  value = "0",
): Promise<ITxData> {
  const txInitialDetails = {
    to: contractAddress,
    from: selectEthereumAddressWithChecksum(state),
    data: txData.getData(),
    value: value,
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
  const etherTokenBalance = selectEtherTokenBalance(state);
  const etherValue = state.investmentFlow.ethValueUlps;

  if (!etherTokenBalance) {
    throw new Error("No ether Token Balance");
  }
  if (compareBigNumbers(etherTokenBalance, etherValue) >= 0) {
    // transaction can be fully covered by etherTokens

    // rawWeb3Contract is called directly due to the need for calling the 3 args version of transfer method.
    // See the abi in the contract.
    const txInput = contractsService.etherToken.rawWeb3Contract.transfer[
      "address,uint256,bytes"
    ].getData(etoId, etherValue, "");
    return createTxData(state, txInput, contractsService.etherToken.address);
  } else {
    // fill up etherToken with ether from wallet
    const ethVal = new BigNumber(etherValue);
    const value = ethVal.sub(etherTokenBalance);
    const txCall = contractsService.etherToken.depositAndTransferTx(etoId, ethVal, [""]);

    return createTxData(state, txCall, contractsService.etherToken.address, value.toString());
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
