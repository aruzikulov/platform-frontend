import { Form, Formik, FormikConsumer } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as Web3Utils from "web3-utils";

import { actions } from "../../../modules/actions";
import { selectIcbmMigrationWallet } from "../../../modules/icbmWalletBalanceModal/selectors";
import { ILockedWallet } from "../../../modules/wallet/reducer";
import { appConnect } from "../../../store";
import { Button, EButtonLayout } from "../../shared/buttons";
import { FormFieldColorful } from "../../shared/forms/formField/FormFieldColorful";
import { Panel } from "../../shared/Panel";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./CheckYourICBMWalletWidget.module.scss";

interface IDispatchProps {
  loadICBMWallet: (address: string) => void;
}

interface IStateProps {
  lockedWalletData?: ILockedWallet;
}

class FormContent extends React.Component {
  render(): React.ReactNode {
    return (
      <FormikConsumer>
        {({ values }) => (
          <>
            <FormFieldColorful
              name="address"
              placeholder="0xff2bee8169957caa2f5a34af7bf8e717fea7f"
            />
            <Button
              className={styles.button}
              layout={EButtonLayout.SECONDARY}
              iconPosition="icon-after"
              svgIcon={arrowRight}
              type="submit"
              disabled={!Web3Utils.isAddress(values.address)}
            >
              <FormattedMessage id="check-your-icbm-wallet-widget.submit" />
            </Button>
          </>
        )}
      </FormikConsumer>
    );
  }
}

const CheckYourICBMWalletWidgetComponent: React.SFC<IStateProps & IDispatchProps> = ({
  loadICBMWallet,
}) => {
  return (
    <Panel
      headerText={<FormattedMessage id="check-your-icbm-wallet-widget.header" />}
      className="h-100"
    >
      <p>
        <FormattedMessage id="check-your-icbm-wallet-widget.notice" />
      </p>
      <Formik initialValues={{ address: "" }} onSubmit={values => loadICBMWallet(values.address)}>
        <Form>
          <FormContent />
        </Form>
      </Formik>
    </Panel>
  );
};

export const CheckYourICBMWalletWidget = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    lockedWalletData: selectIcbmMigrationWallet(state.icbmWalletBalanceModal),
  }),
  dispatchToProps: dispatch => ({
    loadICBMWallet: (address: string) => {
      dispatch(actions.icbmWalletBalanceModal.getWalletData(address));
    },
  }),
})(CheckYourICBMWalletWidgetComponent);
