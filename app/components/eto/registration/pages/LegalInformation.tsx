import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { FormattedMessage } from "react-intl-phraseapp";
import {
  EtoLegalInformationType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { TTranslatedString } from "../../../../types";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button } from "../../../shared/Buttons";
import { FormCategoryDistribution } from "../../../shared/forms/formField/FormCategoryDistribution";
import { FormFieldDate } from "../../../shared/forms/formField/FormFieldDate";
import { FormSelectField } from "../../../shared/forms/formField/FormSelectField";
import { FormField } from "../../../shared/forms/forms";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IRounds {
  [key: string]: TTranslatedString;
}

export const FUNDING_ROUNDS: IRounds = {
  NONE_KEY: <FormattedMessage id="form.select.please-select" />,
  pre_seed: "Pre Seed",
  seed: "Seed",
  a_round: "A Round",
  b_round: "B Round",
  c_round: "C Round",
  d_round: "D Round",
  e_round: "E Round",
  pre_ipo: "Pre Ipo",
  public: "Public",
};

const NUMBER_OF_EMPLOYEES = {
  NONE_KEY: <FormattedMessage id="form.select.please-select" />,
  "1-9": "1-9",
  "10-99": "10-99",
  "100-999": "100-999",
  ">1000": ">1000",
};

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (props: FormikProps<TPartialCompanyEtoData> & IProps) => {
  return (
    <EtoFormBase title="Legal Information" validator={EtoLegalInformationType.toYup()}>
      <Section>
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.legal-company-name" />}
          name="name"
          disabled
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.legal-form" />}
          name="legalForm"
          disabled
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.company-state-address" />}
          name="street"
          disabled
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.city-country" />}
          name="country"
          disabled
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.registration-number" />}
          name="registrationNumber"
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
          label={<FormattedMessage id="eto.form.legal-information.last-founding-round" />}
          values={FUNDING_ROUNDS}
          name="companyStage"
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.last-founding-amount" />}
          type="number"
          name="lastFundingSizeEur"
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.number-of-existing-shares" />}
          type="number"
          min="0"
          name="companyShares"
        />
        <FormCategoryDistribution
          name="shareholders"
          prefix="%"
          label={<FormattedMessage id="eto.form.legal-information.shareholder-structure" />}
          suggestions={["Full Name"]}
          blankField={{ fullName: "", shares: "" }}
        />
      </Section>
      <Col>
        <Row className="justify-content-end">
          <Button
            layout="primary"
            className="mr-4"
            onClick={() => {
              props.saveData(props.values);
            }}
            isLoading={props.savingData}
          >
            <FormattedMessage id="form.button.save" />
          </Button>
        </Row>
      </Col>
    </EtoFormBase>
  );
};

const EtoEnhancedForm = withFormik<IProps, TPartialCompanyEtoData>({
  validationSchema: EtoLegalInformationType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoRegistrationLegalInformationComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationLegalInformation = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: s.etoFlow.companyData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialCompanyEtoData) => {
        dispatch(actions.etoFlow.saveDataStart({ companyData: data, etoData: {} }));
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationLegalInformationComponent);
