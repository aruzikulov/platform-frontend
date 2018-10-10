import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETOStateOnChain } from "../../modules/public-etos/types";
import { Button, EButtonLayout } from "../shared/buttons";

type TExternalProps = {
  state: ETOStateOnChain;
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
    case ETOStateOnChain.Signing:
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
