import { BigNumber } from "bignumber.js";
import { put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ContractsService } from "../../../../lib/web3/ContractsService";
import { ITxData } from "../../../../lib/web3/Web3Manager";
import { IAppState } from "../../../../store";
import { selectGasPrice } from "../../../gas/selectors";
import { selectReadyToInvest } from "../../../investment-flow/selectors";
import { selectEtoById } from "../../../public-etos/selectors";
import { neuCall } from "../../../sagas";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { calculateGasPriceWithOverhead } from "../../utils";
import { compareBigNumbers } from "./../../../../utils/BigNumberUtils";
import { actions } from "./../../../actions";
import { EInvestmentType } from "./../../../investment-flow/reducer";
import { selectEtherTokenBalance } from "./../../../wallet/selectors";

export const INVESTMENT_GAS_AMOUNT = "600000";

async function createInvestmentTxData(
  state: IAppState,
  txData: string,
  contractAddress: string,
  value = "0",
): Promise<ITxData> {
  return {
    to: contractAddress,
    from: selectEthereumAddressWithChecksum(state),
    data: txData,
    value: value,
    gasPrice: selectGasPrice(state)!.standard,
    gas: calculateGasPriceWithOverhead(INVESTMENT_GAS_AMOUNT),
  };
}

function getEtherLockTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): Promise<ITxData> {
  const txData = contractsService.etherLock
    .transferTx(etoId, new BigNumber(state.investmentFlow.ethValueUlps), [""])
    .getData();
  return createInvestmentTxData(state, txData, contractsService.etherLock.address);
}

function getEuroLockTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): Promise<ITxData> {
  const txData = contractsService.euroLock
    .transferTx(etoId, new BigNumber(state.investmentFlow.euroValueUlps), [""])
    .getData();
  return createInvestmentTxData(state, txData, contractsService.euroLock.address);
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
    return createInvestmentTxData(state, txInput, contractsService.etherToken.address);
  } else {
    // fill up etherToken with ether from wallet
    const ethVal = new BigNumber(etherValue);
    const value = ethVal.sub(etherTokenBalance);
    const txCall = contractsService.etherToken.depositAndTransferTx(etoId, ethVal, [""]).getData();

    return createInvestmentTxData(
      state,
      txCall,
      contractsService.etherToken.address,
      value.toString(),
    );
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
      return yield getEtherTokenTransaction(state, contractsService, eto.etoId);
    case EInvestmentType.ICBMEth:
      return yield getEtherLockTransaction(state, contractsService, eto.etoId);
    case EInvestmentType.ICBMnEuro:
      return yield getEuroLockTransaction(state, contractsService, eto.etoId);
  }
}

export function* investmentFlowGenerator(_: TGlobalDependencies): any {
  yield take("TX_SENDER_ACCEPT_DRAFT");
  const generatedTxDetails = yield neuCall(generateInvestmentTransaction);
  yield put(actions.txSender.setSummaryData(generatedTxDetails));
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
}
