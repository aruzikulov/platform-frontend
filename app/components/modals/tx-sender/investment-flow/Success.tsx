import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { appRoutes } from "../../../appRoutes";
import { ConfettiEthereum } from "../../../landing/parts/ConfettiEthereum";
import { ButtonArrowRight } from "../../../shared/buttons";
import { EtherscanTxLink } from "../../../shared/EtherscanLink";
import { Message } from "../shared/Message";

interface IDispatchProps {
  goToPortfolio: () => void;
  txHash: string;
}

const InvestmentSuccessComponent: React.SFC<IDispatchProps> = ({ goToPortfolio, txHash }) => (
  <Message
    data-test-id="investment-flow.success.title"
    image={<ConfettiEthereum className="mb-3" />}
    title={<FormattedMessage id="investment-flow.success.title" />}
    text={
      <FormattedMessage
        id="investment-flow.success.congratulation-text"
        values={{ etherscan: <EtherscanTxLink txHash={txHash} /> }}
      />
    }
  >
    <ButtonArrowRight onClick={goToPortfolio}>
      <FormattedMessage id="investment-flow.success.view-portfolio" />
    </ButtonArrowRight>
  </Message>
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
