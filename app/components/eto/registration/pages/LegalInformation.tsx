import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoLegalInformationType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectIssuerCompany } from "../../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../../modules/eto-flow/types";
import { appConnect } from "../../../../store";
import { TTranslatedString } from "../../../../types";
import { Button, EButtonLayout } from "../../../shared/buttons";
import {
  ArrayOfKeyValueFields,
  FormField,
  FormFieldDate,
  FormSelectField,
} from "../../../shared/forms";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import {
  convert,
  convertInArray,
  parseStringToFloat,
  parseStringToInteger,
  removeEmptyKeyValueFields,
} from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";
import * as styles from "../Shared.module.scss";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  company: TPartialCompanyEtoData;
}

interface IExternalProps {
  readonly: boolean;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

interface IRounds {
  [key: string]: TTranslatedString;
}

export const FUNDING_ROUNDS: IRounds = {
  NONE_KEY: <FormattedMessage id="form.select.please-select" />,
  pre_seed: "Pre-Seed",
  seed: "Seed",
  a_round: "Series A",
  b_round: "Series B",
  c_round: "Series C",
  d_round: "Series D",
  e_round: "Series E",
  pre_ipo: "Pre-IPO",
  public: "PUBLIC",
};

const NUMBER_OF_EMPLOYEES = {
  NONE_KEY: <FormattedMessage id="form.select.please-select" />,
  "1-9": "1-9",
  "10-99": "10-99",
  "100-999": "100-999",
  ">1000": ">1000",
};

type IProps = IExternalProps & IStateProps & IDispatchProps & FormikProps<TPartialCompanyEtoData>;

//Some fields in LegalInformation are always readonly because this data ist set during KYC process
const EtoRegistrationLegalInformationComponent = ({ savingData }: IProps) => {
  return (
    <EtoFormBase title="Legal Information" validator={EtoLegalInformationType.toYup()}>
      <Section>
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.legal-company-name" />}
          name="name"
          disabled={true}
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.legal-form" />}
          name="legalForm"
          disabled={true}
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.company-state-address" />}
          name="street"
          disabled={true}
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.city-country" />}
          name="country"
          disabled={true}
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.registration-number" />}
          name="registrationNumber"
          disabled={true}
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.vat-number" />}
          name="vatNumber"
        />
        <FormFieldDate
          label={<FormattedMessage id="eto.form.legal-information.company-founding-date" />}
          name="foundingDate"
        />
        <FormSelectField
          label={<FormattedMessage id="eto.form.legal-information.number-of-employees" />}
          values={NUMBER_OF_EMPLOYEES}
          name="numberOfEmployees"
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.number-of-founders" />}
          type="number"
          name="numberOfFounders"
        />
        <FormSelectField
          label={<FormattedMessage id="eto.form.legal-information.last-funding-round" />}
          values={FUNDING_ROUNDS}
          name="companyStage"
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.last-funding-amount" />}
          type="number"
          name="lastFundingSizeEur"
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.number-of-existing-shares" />}
          type="number"
          name="companyShares"
        />
        <FormHighlightGroup
          title={<FormattedMessage id="eto.form.legal-information.shareholder-structure" />}
        >
          <ArrayOfKeyValueFields
            name="shareholders"
            valuePlaceholder={"Amount"}
            suggestions={["Full Name"]}
            fieldNames={["fullName", "shares"]}
          />
        </FormHighlightGroup>
      </Section>
      <Section className={styles.buttonSection}>
        <Button
          type="submit"
          layout={EButtonLayout.PRIMARY}
          isLoading={savingData}
          data-test-id="eto-registration-legal-information-submit"
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </Section>
    </EtoFormBase>
  );
};

const EtoRegistrationLegalInformation = compose<React.SFC<IExternalProps>>(
  setDisplayName(EEtoFormTypes.LegalInformation),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      loadingData: state.etoFlow.loading,
      savingData: state.etoFlow.saving,
      company: selectIssuerCompany(state) as TPartialCompanyEtoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialCompanyEtoData) => {
        const convertedData = convert(data, fromFormState);
        dispatch(actions.etoFlow.saveDataStart({ companyData: convertedData, etoData: {} }));
      },
    }),
  }),
  withFormik<IStateProps & IDispatchProps, TPartialCompanyEtoData>({
    validationSchema: EtoLegalInformationType.toYup(),
    mapPropsToValues: props => props.company,
    handleSubmit: (values, { props }) => props.saveData(values),
  }),
)(EtoRegistrationLegalInformationComponent);

const fromFormState = {
  shareholders: [removeEmptyKeyValueFields(), convertInArray({ shares: parseStringToInteger() })],
  companyShares: parseStringToInteger(),
  lastFundingSizeEur: parseStringToFloat(),
  numberOfFounders: parseStringToInteger(),
};

export { EtoRegistrationLegalInformation, EtoRegistrationLegalInformationComponent };
