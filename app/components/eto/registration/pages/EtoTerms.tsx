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
import { EtoFormBase } from "../EtoFormBase";

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

const currencies = Object.keys(CURRENCIES);

const EtoRegistrationTermsComponent: React.SFC<IProps> = ({ readonly, savingData }) => {
  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form.eto-terms.title" />}
      validator={EtoTermsType.toYup()}
    >
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
            min="1"
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
            min="1"
            disabled={readonly}
          />
        </Col>
      </Row>

      <div className="form-group">
        <FormCheckbox
          disabled={readonly}
          name="notUnderCrowdfundingRegulations"
          label={<FormattedMessage id="eto.form.section.eto-terms.is-crowdfunding" />}
        />
      </div>

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
      </div>

      <div className="form-group">
        <FormLabel name="whitelistDurationDays">
          <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration" />
        </FormLabel>
        <FormRange
          disabled={readonly}
          name="whitelistDurationDays"
          min={1}
          unitMin={<FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-min" />}
          max={14}
          unitMax={<FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-max" />}
        />
      </div>

      <div className="form-group">
        <FormLabel name="publicDurationDays">
          <FormattedMessage id="eto.form.section.eto-terms.public-offer-duration" />
        </FormLabel>
        <FormRange
          disabled={readonly}
          name="publicDurationDays"
          min={0}
          unit={<FormattedMessage id="eto.form.section.eto-terms.public-offer-duration.unit" />}
          max={60}
        />
      </div>

      <div className="form-group">
        <FormLabel name="signingDurationDays">
          <FormattedMessage id="eto.form.section.eto-terms.signing-duration" />
        </FormLabel>
        <FormRange
          disabled={readonly}
          name="signingDurationDays"
          min={14}
          unit={<FormattedMessage id="eto.form.section.eto-terms.signing-duration.unit" />}
          max={60}
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
        <FormError name="enableTransferOnSuccess" />
      </div>

      <FormTextArea
        disabled={readonly}
        className="mb-2 mt-2"
        label={<FormattedMessage id="eto.form.additional-terms" />}
        name="additionalTerms"
      />

      {!readonly && (
        <Col>
          <Row className="justify-content-center">
            <Button
              layout={EButtonLayout.PRIMARY}
              type="submit"
              isLoading={savingData}
              data-test-id="eto-registration-eto-terms-submit"
            >
              <FormattedMessage id="form.button.save" />
            </Button>
          </Row>
        </Col>
      )}
    </EtoFormBase>
  );
};

export const EtoRegistrationTerms = compose<React.SFC<IExternalProps>>(
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
        dispatch(
          actions.etoFlow.saveDataStart({
            companyData: {},
            etoData: {
              ...data,
            },
          }),
        );
      },
    }),
  }),
  withFormik<IStateProps & IDispatchProps, TPartialEtoSpecData>({
    validationSchema: EtoTermsType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoRegistrationTermsComponent);
