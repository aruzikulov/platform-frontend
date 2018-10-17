import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { appRoutes } from "../../../appRoutes";
import { ConfettiEthereum } from "../../../landing/parts/ConfettiEthereum";
import { ButtonArrowRight } from "../../../shared/buttons";
import { EtherscanTxLink } from "../../../shared/EtherscanLink";

import * as styles from "./Success.module.scss";

interface IDispatchProps {
  goToPortfolio: () => void;
  txHash: string;
}

const InvestmentSuccessComponent: React.SFC<IDispatchProps> = ({ goToPortfolio, txHash }) => (
  <div className="text-center" data-test-id="investment-flow.success.title">
    <ConfettiEthereum className="mb-3" />
    <h3 className={styles.title}>
      <FormattedMessage id="investment-flow.success.title" />
    </h3>
    <p>
      <FormattedMessage
        id="investment-flow.success.congratulation-text"
        values={{ etherscan: <EtherscanTxLink txHash={txHash} /> }}
      />
    </p>
    <ButtonArrowRight onClick={goToPortfolio}>
      <FormattedMessage id="investment-flow.success.view-portfolio" />
    </ButtonArrowRight>
  </div>
);

const InvestmentSuccess = appConnect({
  dispatchToProps: dispatch => ({
    goToPortfolio: () => {
      dispatch(actions.routing.goTo(appRoutes.portfolio));
      dispatch(actions.txSender.txSenderHideModal());
    },
  }),
})(InvestmentSuccessComponent);

export { InvestmentSuccess, InvestmentSuccessComponent };
