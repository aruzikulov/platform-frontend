import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { EtoTermsType, TPartialEtoSpecData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { etoFormIsReadonly } from "../../../../lib/api/eto/EtoApiUtils";
import { actions } from "../../../../modules/actions";
import { selectIssuerEto, selectIssuerEtoState } from "../../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../../modules/eto-flow/types";
import { appConnect } from "../../../../store";
import { TTranslatedString } from "../../../../types";
import { Button, EButtonLayout } from "../../../shared/buttons";
import {
  FormCheckbox,
  FormError,
  FormField,
  FormRadioButton,
  FormTextArea,
} from "../../../shared/forms";
import {
  FormFieldCheckbox,
  FormFieldCheckboxGroup,
} from "../../../shared/forms/form-field/FormFieldCheckboxGroup";
import { FormLabel } from "../../../shared/forms/form-field/FormLabel";
import { FormRange } from "../../../shared/forms/form-field/FormRange";
import { convert, parseStringToInteger } from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

import * as formStyles from "../../../shared/forms/form-field/FormStyles.module.scss";
import * as styles from "../Shared.module.scss";

interface IExternalProps {
  readonly: boolean;
}

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoSpecData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoSpecData) => void;
}

type IProps = IExternalProps & IStateProps & IDispatchProps & FormikProps<TPartialEtoSpecData>;

interface ICurrencies {
  [key: string]: string;
}

const CURRENCIES: ICurrencies = {
  eth: "ETH",
  eur_t: "nEUR",
};

const MIN_NON_RETAIL_TICKET = 100000;

const currencies = Object.keys(CURRENCIES);

const EtoRegistrationTermsComponent: React.SFC<IProps> = ({ readonly, savingData }) => {
  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form.eto-terms.title" />}
      validator={EtoTermsType.toYup()}
    >
      <Section>
        <div className="form-group">
          <FormLabel name="allowRetailInvestors">
            <FormattedMessage id="eto.form.section.eto-terms.allow-retail-label" />
          </FormLabel>
          <div>
            <FormRadioButton
              disabled={readonly}
              name="allowRetailInvestors"
              label={<FormattedMessage id="eto.form.section.eto-terms.is-hnwi-eto" />}
              value={false}
            />
          </div>
          <div>
            <FormRadioButton
              disabled={readonly}
              name="allowRetailInvestors"
              label={<FormattedMessage id="eto.form.section.eto-terms.is-retail-eto" />}
              value={true}
            />
          </div>
        </div>

        <div className="form-group">
          <FormCheckbox
            disabled={readonly}
            name="notUnderCrowdfundingRegulations"
            label={<FormattedMessage id="eto.form.section.eto-terms.is-not-crowdfunding" />}
          />
        </div>

        <FormLabel name="currencies">
          <FormattedMessage id="eto.form.section.eto-terms.fundraising-currency" />
        </FormLabel>

        <div className="form-group">
          <FormFieldCheckboxGroup name="currencies">
            {currencies.map(currency => (
              <FormFieldCheckbox
                key={currency}
                label={CURRENCIES[currency]}
                value={currency}
                disabled={readonly}
              />
            ))}
          </FormFieldCheckboxGroup>
        </div>

        <Row>
          <Col>
            <FormField
              label={<FormattedMessage id="eto.form.section.eto-terms.minimum-ticket-size" />}
              placeholder="1"
              prefix="€"
              name="minTicketEur"
              type="number"
              disabled={readonly}
            />
          </Col>
          <Col>
            <FormField
              label={<FormattedMessage id="eto.form.section.eto-terms.maximum-ticket-size" />}
              placeholder="Unlimited"
              prefix="€"
              name="maxTicketEur"
              type="number"
              disabled={readonly}
            />
          </Col>
        </Row>

        <div className="form-group">
          <FormLabel name="prospectusLanguage">
            <FormattedMessage id="eto.form.section.eto-terms.prospectus-language" />
          </FormLabel>
          <div>
            <FormRadioButton name="prospectusLanguage" label="DE" value="de" disabled={readonly} />
          </div>
          <div>
            <FormRadioButton name="prospectusLanguage" label="EN" value="en" disabled={readonly} />
          </div>
          <FormError name="prospectusLanguage" className={formStyles.errorLabelAlignLeft} />
        </div>

        <div className="form-group">
          <FormLabel name="whitelistDurationDays">
            <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration" />
          </FormLabel>
          <FormRange
            disabled={readonly}
            name="whitelistDurationDays"
            unitMin={
              <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-min" />
            }
            unitMax={
              <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-max" />
            }
          />
        </div>

        <div className="form-group">
          <FormLabel name="publicDurationDays">
            <FormattedMessage id="eto.form.section.eto-terms.public-offer-duration" />
          </FormLabel>
          <FormRange
            disabled={readonly}
            name="publicDurationDays"
            unit={<FormattedMessage id="eto.form.section.eto-terms.public-offer-duration.unit" />}
          />
        </div>

        <div className="form-group">
          <FormLabel name="signingDurationDays">
            <FormattedMessage id="eto.form.section.eto-terms.signing-duration" />
          </FormLabel>
          <FormRange
            disabled={readonly}
            name="signingDurationDays"
            unit={<FormattedMessage id="eto.form.section.eto-terms.signing-duration.unit" />}
          />
        </div>

        <div className="form-group">
          <FormLabel name="enableTransferOnSuccess">
            <FormattedMessage id="eto.form.section.eto-terms.token-tradable" />
          </FormLabel>
          <div>
            <FormRadioButton
              disabled={readonly}
              name="enableTransferOnSuccess"
              label={<FormattedMessage id="form.select.enabled" />}
              value={true}
            />
          </div>
          <div>
            <FormRadioButton
              disabled={readonly}
              name="enableTransferOnSuccess"
              label={<FormattedMessage id="form.select.disabled" />}
              value={false}
            />
          </div>
          <FormError name="enableTransferOnSuccess" className={formStyles.errorLabelAlignLeft} />
        </div>

        <FormTextArea
          disabled={readonly}
          className="mb-2 mt-2"
          label={<FormattedMessage id="eto.form.additional-terms" />}
          name="additionalTerms"
        />
      </Section>

      {!readonly && (
        <Section className={styles.buttonSection}>
          <Button
            layout={EButtonLayout.PRIMARY}
            type="submit"
            isLoading={savingData}
            data-test-id="eto-registration-eto-terms-submit"
          >
            <FormattedMessage id="form.button.save" />
          </Button>
        </Section>
      )}
    </EtoFormBase>
  );
};

const EtoRegistrationTerms = compose<React.SFC<IExternalProps>>(
  setDisplayName(EEtoFormTypes.EtoTerms),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerEto(s) as TPartialEtoSpecData,
      readonly: etoFormIsReadonly(EEtoFormTypes.EtoTerms, selectIssuerEtoState(s)),
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialEtoSpecData) => {
        const convertedData = convert(data, fromFormState);
        dispatch(
          actions.etoFlow.saveDataStart({
            companyData: {},
            etoData: convertedData,
          }),
        );
      },
    }),
  }),
  withFormik<IStateProps & IDispatchProps, TPartialEtoSpecData>({
    validationSchema: EtoTermsType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
    validate: values => {
      const errors: { [key in keyof (typeof values)]: TTranslatedString } = {};

      if (values.allowRetailInvestors && values.enableTransferOnSuccess) {
        errors.enableTransferOnSuccess = (
          <FormattedMessage id="eto.form.eto-terms.errors.transfer-not-allowed-for-retail-eto" />
        );
      }

      if (!values.allowRetailInvestors && (values.minTicketEur || 0) < MIN_NON_RETAIL_TICKET) {
        errors.minTicketEur = (
          <FormattedMessage
            id="eto.form.eto-terms.errors.to-low-min-ticket-for-non-retail-eto"
            values={{ minTicket: MIN_NON_RETAIL_TICKET }}
          />
        );
      }

      return errors;
    },
  }),
)(EtoRegistrationTermsComponent);

const fromFormState = {
  publicDurationDays: parseStringToInteger(),
  signingDurationDays: parseStringToInteger(),
  whitelistDurationDays: parseStringToInteger(),
};

export { EtoRegistrationTerms, EtoRegistrationTermsComponent };
