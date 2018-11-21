import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { selectEtoOnChainStateById } from "../../../../modules/public-etos/selectors";
import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/types";
import { selectEtherPriceEur } from "../../../../modules/shared/tokenPrice/selectors";
import { appConnect } from "../../../../store";
import { divideBigNumbers } from "../../../../utils/BigNumberUtils";
import { EMoneyFormat, Money } from "../../../shared/Money";
import { InvestmentProgress } from "./InvestmentWidget/InvestmentProgress";
import { Message } from "./Message";

import * as styles from "./EtoMaxCapExceeded.module.scss";

export interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
}

interface IStateProps {
  etherPriceEur: string;
  isPreEto: boolean;
}

const EtoMaxCapExceededComponent: React.SFC<IExternalProps & IStateProps> = ({
  eto,
  etherPriceEur,
  isPreEto,
}) => {
  return (
    <div className={styles.maxCapExceeded}>
      <div className={cn(styles.header, styles.center)}>
        <div>
          <Message
            title={
              isPreEto ? (
                <FormattedMessage id="shared-component.eto-overview.pre-eto.success" />
              ) : (
                <FormattedMessage id="shared-component.eto-overview.success" />
              )
            }
          />
        </div>
      </div>
      <div className={styles.header}>
        <div>
          <Money
            value={divideBigNumbers(eto.contract!.totalInvestment.totalEquivEurUlps, etherPriceEur)}
            currency="eth"
          />
        </div>
        <div>
          <FormattedMessage
            id="shared-component.eto-overview.investors"
            values={{ totalInvestors: eto.contract!.totalInvestment.totalInvestors.toNumber() }}
          />
        </div>
      </div>
      <div className={styles.header}>
        <div>
          <Money
            value={eto.contract!.totalInvestment.totalTokensInt.toNumber()}
            currency="eur_token"
            format={EMoneyFormat.FLOAT}
          />
        </div>
        <div className={cn(styles.capReached, "text-uppercase")}>
          {isPreEto ? (
            <FormattedMessage id="shared-component.eto-overview.pre-eto.max-cap-reached" />
          ) : (
            <FormattedMessage id="shared-component.eto-overview.max-cap-reached" />
          )}
        </div>
      </div>
      <InvestmentProgress eto={eto} />
    </div>
  );
};

const EtoMaxCapExceededWidget = compose<IExternalProps & IStateProps, IExternalProps>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: (state, props) => ({
      etherPriceEur: selectEtherPriceEur(state),
      isPreEto: selectEtoOnChainStateById(state, props.eto.etoId) === EETOStateOnChain.Whitelist,
    }),
  }),
)(EtoMaxCapExceededComponent);

export { EtoMaxCapExceededWidget, EtoMaxCapExceededComponent };
