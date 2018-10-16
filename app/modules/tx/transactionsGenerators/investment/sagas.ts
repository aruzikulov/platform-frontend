import { BigNumber } from "bignumber.js";
import { put, select } from "redux-saga/effects";
import { compareBigNumbers } from "./../../../../utils/BigNumberUtils";
import { EInvestmentType } from "./../../../investmentFlow/reducer";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ContractsService } from "../../../../lib/web3/ContractsService";
import { ITxData } from "../../../../lib/web3/Web3Manager";
import { IAppState } from "../../../../store";
import { actions } from "../../../actions";
import { selectReadyToInvest } from "../../../investmentFlow/selectors";
import { selectEtoById } from "../../../public-etos/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";

const INVESTMENT_GAS_AMOUNT = "600000";

function createTxData(
  state: IAppState,
  txInput: string,
  contractAddress: string,
): Partial<ITxData> | undefined {
  return {
    to: contractAddress,
    from: selectEthereumAddressWithChecksum(state),
    data: txInput,
    value: "0",
  };
}

function getEtherLockTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): ITxData | undefined {
  const txInput = contractsService.etherLock
    .transferTx(etoId, new BigNumber(state.investmentFlow.ethValueUlps), [""])
    .getData();
  return createTxData(state, txInput, contractsService.etherLock.address);
}

function getEuroLockTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): ITxData | undefined {
  const txInput = contractsService.euroLock
    .transferTx(etoId, new BigNumber(state.investmentFlow.euroValueUlps), [""])
    .getData();
  return createTxData(state, txInput, contractsService.euroLock.address);
}

function getEtherTokenTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): ITxData | undefined {
  const etherTokenBalance = state.wallet.data!.etherTokenBalance;
  const etherValue = state.investmentFlow.ethValueUlps;
  let txDetails: ITxInitData | undefined;

  // transaction can be fully covered by etherTokens
  if (compareBigNumbers(etherTokenBalance, etherValue) >= 0) {
    // need to call 3 args version of transfer method. See the abi in the contract.
    // so we call the rawWeb3Contract directly
    const txInput = contractsService.etherToken.rawWeb3Contract.transfer[
      "address,uint256,bytes"
    ].getData(etoId, etherValue, "");
    txDetails = createTxData(state, txInput, contractsService.etherToken.address);

    // fill up etherToken with ether from wallet
  } else {
    const ethVal = new BigNumber(etherValue);
    const difference = ethVal.sub(etherTokenBalance);
    const txCall = contractsService.etherToken.depositAndTransferTx(etoId, ethVal, [""]);
    txDetails = {
      to: contractsService.etherToken.address,
      from: selectEthereumAddressWithChecksum(state),
      data: txCall.getData(),
      value: difference.toString(),
    };
  }

  return txDetails;
}

export function* generateInvestmentTransaction({ contractsService }: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const i = state.investmentFlow;
  const eto = selectEtoById(state.publicEtos, i.etoId);

  if (!eto || !selectReadyToInvest(i)) {
    throw new Error("Investment data is not valid to create an Transaction");
  }

  let txDetails: ITxData | undefined;

  switch (i.investmentType) {
    case EInvestmentType.InvestmentWallet:
      txDetails = getEtherTokenTransaction(state, contractsService, eto.etoId);
      break;
    case EInvestmentType.ICBMEth:
      txDetails = getEtherLockTransaction(state, contractsService, eto.etoId);
      break;
    case EInvestmentType.ICBMnEuro:
      txDetails = getEuroLockTransaction(state, contractsService, eto.etoId);
      break;
  }

  if (txDetails) {
    yield put(actions.txSender.txSenderAcceptDraft(txDetails));
  }
}
