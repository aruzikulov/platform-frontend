import { BigNumber } from "bignumber.js";
import { put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ContractsService } from "../../../../lib/web3/ContractsService";
import { ITxData } from "../../../../lib/web3/types";
import { IAppState } from "../../../../store";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { selectEtoById } from "../../../public-etos/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { calculateGasLimitWithOverhead } from "../../utils";
import { compareBigNumbers } from "./../../../../utils/BigNumberUtils";
import { actions } from "./../../../actions";
import { EInvestmentType } from "./../../../investment-flow/reducer";
import { selectEtherTokenBalance } from "./../../../wallet/selectors";

export const INVESTMENT_GAS_AMOUNT = "600000";

const createInvestmentTxData = (
  state: IAppState,
  txData: string,
  contractAddress: string,
  value = "0",
) => ({
  to: contractAddress,
  from: selectEthereumAddressWithChecksum(state),
  data: txData,
  value: value,
  gasPrice: selectStandardGasPriceWithOverHead(state),
  gas: calculateGasLimitWithOverhead(INVESTMENT_GAS_AMOUNT),
});

const getEtherLockTransaction = (
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
) => {
  const txData = contractsService.etherLock
    .transferTx(etoId, new BigNumber(state.investmentFlow.ethValueUlps), [""])
    .getData();
  return createInvestmentTxData(state, txData, contractsService.etherLock.address);
};

const getEuroLockTransaction = (
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
) => {
  const txData = contractsService.euroLock
    .transferTx(etoId, new BigNumber(state.investmentFlow.euroValueUlps), [""])
    .getData();
  return createInvestmentTxData(state, txData, contractsService.euroLock.address);
};

function getEtherTokenTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): ITxData {
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
  const eto = selectEtoById(state.publicEtos, investmentState.etoId)!;

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
  yield put(actions.txSender.txSenderContinueToSummary());
}
