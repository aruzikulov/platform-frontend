import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoInvestmentTermsType,
  TPartialEtoSpecData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { etoFormIsReadonly } from "../../../../lib/api/eto/EtoApiUtils";
import { getInvestmentAmount, getShareAndTokenPrice } from "../../../../lib/api/eto/EtoUtils";
import { actions } from "../../../../modules/actions";
import { selectIssuerEto, selectIssuerEtoState } from "../../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../../modules/eto-flow/types";
import { etoInvestmentTermsProgressOptions } from "../../../../modules/eto-flow/utils";
import { appConnect } from "../../../../store";
import { TTranslatedString } from "../../../../types";
import { formatMoney } from "../../../../utils/Money.utils";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormField } from "../../../shared/forms";
import { FormFieldRaw } from "../../../shared/forms/form-field/FormFieldRaw";
import { NumberTransformingField } from "../../../shared/forms/form-field/NumberTransformingField";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { EMoneyFormat, getFormattedMoney } from "../../../shared/Money";
import {
  convert,
  convertFractionToPercentage,
  convertPercentageToFraction,
  parseStringToFloat,
  parseStringToInteger,
} from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

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

const EtoInvestmentTermsComponent: React.SFC<IProps> = ({ stateValues, savingData, readonly }) => {
  const existingCompanyShares = stateValues.existingCompanyShares || 1;
  const newSharesToIssue = stateValues.newSharesToIssue || 1;
  const equityTokensPerShare = stateValues.equityTokensPerShare || 1;
  const minimumNewSharesToIssue = stateValues.minimumNewSharesToIssue || 0;

  const computedMaxNumberOfTokens = newSharesToIssue * equityTokensPerShare;
  const computedMinNumberOfTokens = minimumNewSharesToIssue * equityTokensPerShare;
  const computedMaxCapPercent = (newSharesToIssue / existingCompanyShares) * 100;
  const computedMinCapPercent = (minimumNewSharesToIssue / existingCompanyShares) * 100;

  const { minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount(stateValues);
  const { sharePrice, tokenPrice } = getShareAndTokenPrice(stateValues);

  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form.investment-terms.title" />}
      validator={EtoInvestmentTermsType.toYup()}
      progressOptions={etoInvestmentTermsProgressOptions}
    >
      <Section>
        <FormField
          label={
            <FormattedMessage id="eto.form.section.equity-token-information.tokens-per-share" />
          }
          placeholder="1000000"
          name="equityTokensPerShare"
          value={10000}
          disabled={true}
        />
        <FormField
          label={<FormattedMessage id="eto.form.section.investment-terms.share-nominal-value" />}
          placeholder="1"
          prefix="€"
          name="shareNominalValueEur"
          type="number"
          disabled={readonly}
        />
        <FormField
          label={
            <FormattedMessage id="eto.form.section.investment-terms.fully-diluted-pre-money-valuation" />
          }
          placeholder=" "
          prefix="€"
          name="preMoneyValuationEur"
          type="number"
          disabled={readonly}
        />
        <FormField
          label={<FormattedMessage id="eto.form.section.investment-terms.existing-shares" />}
          placeholder="Number of existing shares"
          name="existingCompanyShares"
          type="number"
          disabled={readonly}
        />
        <FormField
          label={<FormattedMessage id="eto.form.section.investment-terms.authorized-capital" />}
          placeholder="Number of shares"
          name="authorizedCapitalShares"
          type="number"
          disabled={readonly}
        />
        <FormField
          label={
            <FormattedMessage id="eto.form.section.investment-terms.minimum-new-shares-to-issue" />
          }
          placeholder="Number of shares"
          name="minimumNewSharesToIssue"
          type="number"
          disabled={readonly}
        />
        <FormField
          label={
            <FormattedMessage id="eto.form.section.investment-terms.maximum-new-shares-to-issue" />
          }
          placeholder="Number of shares"
          name="newSharesToIssue"
          type="number"
          disabled={readonly}
        />
        <NumberTransformingField
          label={<FormattedMessage id="eto.form.section.investment-terms.public-discount" />}
          placeholder=" "
          name="publicDiscountFraction"
          type="number"
          prefix="%"
          ratio={100}
          disabled={readonly}
        />
        <FormField
          label={
            <FormattedMessage id="eto.form.section.investment-terms.maximum-new-shares-to-issue-pre-eto" />
          }
          placeholder="Number of shares"
          name="newSharesToIssueInWhitelist"
          type="number"
          disabled={readonly}
        />
        <NumberTransformingField
          label={<FormattedMessage id="eto.form.section.investment-terms.whitelist-discount" />}
          placeholder=" "
          name="whitelistDiscountFraction"
          type="number"
          prefix="%"
          ratio={100}
          disabled={readonly}
        />
        <FormField
          label={
            <FormattedMessage id="eto.form.section.investment-terms.maximum-shares-to-be-issued-in-fixed-slots" />
          }
          placeholder="Number of shares"
          name="newSharesToIssueInFixedSlots"
          type="number"
          disabled={readonly}
        />
        <NumberTransformingField
          label={
            <FormattedMessage id="eto.form.section.investment-terms.maximum-discount-for-the-fixed-slot-investors" />
          }
          placeholder=" "
          name="fixedSlotsMaximumDiscountFraction"
          type="number"
          prefix="%"
          ratio={100}
          disabled={readonly}
        />

        <FormHighlightGroup>
          <FormFieldRaw
            label={<FormattedMessage id="eto.form.section.investment-terms.new-share-price" />}
            prefix="€"
            name="newSharePrice"
            value={formatMoney(`${sharePrice}`, 1, 8)}
            readOnly={true}
          />
          <FormFieldRaw
            label={<FormattedMessage id="eto.form.section.investment-terms.equity-token-price" />}
            name="equityTokenPrice"
            prefix="€"
            placeholder="read only"
            value={formatMoney(`${tokenPrice}`, 1, 8)}
            readOnly={true}
          />
          <Row>
            <Col sm={12} md={6} className="mb-4">
              <FormFieldRaw
                label={<FormattedMessage id="eto.form.section.investment-terms.minimum-amount" />}
                prefix="€"
                placeholder="read only"
                name="minNumberOfTokens"
                value={getFormattedMoney(minInvestmentAmount, "eur", EMoneyFormat.FLOAT)}
                readOnly={true}
              />
            </Col>
            <Col sm={12} md={6} className="mb-4">
              <FormFieldRaw
                label={<FormattedMessage id="eto.form.section.investment-terms.total-investment" />}
                prefix="€"
                placeholder="read only"
                name="totalInvestment"
                value={getFormattedMoney(maxInvestmentAmount, "eur", EMoneyFormat.FLOAT)}
                readOnly={true}
              />
            </Col>
            <Col sm={12} md={6}>
              <FormFieldRaw
                label={
                  <FormattedMessage id="eto.form.section.investment-terms.minimum-token-cap" />
                }
                placeholder="read only"
                name="minCapEur"
                value={computedMinNumberOfTokens}
                readOnly={true}
              />
            </Col>
            <Col sm={12} md={6}>
              <FormFieldRaw
                label={
                  <FormattedMessage id="eto.form.section.investment-terms.maximum-token-cap" />
                }
                placeholder="read only"
                name="maxCapEur"
                value={computedMaxNumberOfTokens}
                readOnly={true}
              />
            </Col>
            <Col sm={12} md={6}>
              <FormFieldRaw
                label={
                  <FormattedMessage id="eto.form.section.investment-terms.minimum-shares-generated" />
                }
                prefix="%"
                name="minSharesGenerated"
                value={computedMinCapPercent.toFixed(4)}
                readOnly={true}
              />
            </Col>
            <Col sm={12} md={6}>
              <FormFieldRaw
                label={
                  <FormattedMessage id="eto.form.section.investment-terms.maximum-shares-generated" />
                }
                prefix="%"
                name="maxSharesGenerated"
                value={computedMaxCapPercent.toFixed(4)}
                readOnly={true}
              />
            </Col>
          </Row>
        </FormHighlightGroup>
      </Section>

      {!readonly && (
        <Section className={styles.buttonSection}>
          <Button
            layout={EButtonLayout.PRIMARY}
            type="submit"
            isLoading={savingData}
            data-test-id="eto-registration-investment-terms-submit"
          >
            <FormattedMessage id="form.button.save" />
          </Button>
        </Section>
      )}
    </EtoFormBase>
  );
};

const EtoInvestmentTerms = compose<React.SFC<IExternalProps>>(
  setDisplayName(EEtoFormTypes.EtoInvestmentTerms),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerEto(s) as TPartialEtoSpecData,
      readonly: etoFormIsReadonly(EEtoFormTypes.EtoInvestmentTerms, selectIssuerEtoState(s)),
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
    validationSchema: EtoInvestmentTermsType.toYup(),
    mapPropsToValues: props => convert(props.stateValues, toFormState),
    handleSubmit: (values, props) => props.props.saveData(values),
    validate: values => {
      const errors: { [key in keyof (typeof values)]: TTranslatedString } = {};

      if ((values.publicDiscountFraction || 0) > (values.whitelistDiscountFraction || 0)) {
        errors.whitelistDiscountFraction = (
          <FormattedMessage id="eto.form.investment-terms.errors.whitelist-discount-must-at-least-as-big-as-public-discount" />
        );
      }

      if ((values.fixedSlotsMaximumDiscountFraction || 0) < (values.publicDiscountFraction || 0)) {
        errors.fixedSlotsMaximumDiscountFraction = (
          <FormattedMessage id="eto.form.investment-terms.errors.fixed-slots-must-be-at-least-as-big-as-public-discount" />
        );
      }

      return errors;
    },
  }),
)(EtoInvestmentTermsComponent);

const toFormState = {
  whitelistDiscountFraction: convertFractionToPercentage(),
  publicDiscountFraction: convertFractionToPercentage(),
  fixedSlotsMaximumDiscountFraction: convertFractionToPercentage(),
};

const fromFormState = {
  whitelistDiscountFraction: convertPercentageToFraction(),
  publicDiscountFraction: convertPercentageToFraction(),
  fixedSlotsMaximumDiscountFraction: convertPercentageToFraction(),
  equityTokensPerShare: parseStringToInteger(),
  existingCompanyShares: parseStringToInteger(),
  newSharesToIssueInFixedSlots: parseStringToInteger(),
  newSharesToIssueInWhitelist: parseStringToInteger(),
  shareNominalValueEur: parseStringToFloat(),
};

export { EtoInvestmentTerms, EtoInvestmentTermsComponent };
