import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EETOStateOnChain } from "../../modules/public-etos/types";
import { Button, EButtonLayout } from "../shared/buttons";

type TExternalProps = {
  state: EETOStateOnChain;
  etoId: string;
};

const PortfolioAssetAction: React.SFC<TExternalProps> = ({ state }) => {
  switch (state) {
    // TODO: Connect Claim and Payout with refactored transaction functionality
    // case ETOStateOnChain.Claim:
    // case ETOStateOnChain.Payout:
    //   return (
    //     <Button onClick={claim} layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
    //       <FormattedMessage id="portfolio.section.reserved-assets.claim-tokens" />
    //     </Button>
    //   );
    // case ETOStateOnChain.Refund:
    //   return (
    //     <Button layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
    //       <FormattedMessage id="portfolio.section.reserved-assets.refund" />
    //     </Button>
    //   );
    case EETOStateOnChain.Signing:
      return (
        <Button layout={EButtonLayout.SECONDARY} disabled>
          <FormattedMessage id="portfolio.section.reserved-assets.wait-for-update" />
        </Button>
      );

    default:
      return null;
  }
};

export { PortfolioAssetAction };
