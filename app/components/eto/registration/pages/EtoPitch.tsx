import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { EtoPitchType, TPartialCompanyEtoData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectIssuerCompany } from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { ArrayOfKeyValueFields, FormTextArea } from "../../../shared/forms";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { ICompoundField, sanitizeKeyValueCompoundField } from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps & FormikProps<TPartialCompanyEtoData>;

const distributionSuggestions = ["Development", "Other"];

const EtoRegistrationPitchComponent = (props: IProps) => {
  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form-progress-widget.product-vision" />}
      validator={EtoPitchType.toYup()}
    >
      <Section>
        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.inspiration" />}
          placeholder="Describe"
          name="inspiration"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.company-mission" />}
          placeholder="Describe"
          name="companyMission"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.product-vision" />}
          placeholder="Describe"
          name="productVision"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.problem-solved" />}
          placeholder="Describe"
          name="problemSolved"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.customer-group" />}
          placeholder="Describe"
          name="customerGroup"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.target-market-and-industry" />}
          placeholder="Describe"
          name="targetMarketAndIndustry"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.key-competitors" />}
          placeholder="Describe"
          name="keyCompetitors"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.selling-proposition" />}
          placeholder="Describe"
          name="sellingProposition"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.key-benefits-for-investors" />}
          placeholder="Describe"
          name="keyBenefitsForInvestors"
        />
        <FormHighlightGroup
          title={<FormattedMessage id="eto.form.product-vision.use-of-capital" />}
        >
          <FormTextArea name="useOfCapital" placeholder="Detail" disabled={false} />
          <ArrayOfKeyValueFields
            name="useOfCapitalList"
            suggestions={distributionSuggestions}
            prefix="%"
            transformRatio={100}
            fieldNames={["description", "percent"]}
          />
        </FormHighlightGroup>

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.market-traction" />}
          placeholder="Describe"
          name="marketTraction"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.roadmap" />}
          placeholder="Describe"
          name="roadmap"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.business-model" />}
          placeholder="Describe"
          name="businessModel"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.marketing-approach" />}
          placeholder="Describe"
          name="marketingApproach"
        />
      </Section>
      <Col>
        <Row className="justify-content-end">
          <Button
            layout={EButtonLayout.PRIMARY}
            className="mr-4"
            type="submit"
            isLoading={props.savingData}
            data-test-id="eto-registration-product-vision-submit"
          >
            Save
          </Button>
        </Row>
      </Col>
    </EtoFormBase>
  );
};

export const EtoRegistrationPitch = compose<React.SFC>(
  setDisplayName("EtoRegistrationPitch"),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerCompany(s) as TPartialCompanyEtoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialCompanyEtoData) => {
        const sanitizedData = {
          ...data,
          useOfCapitalList: sanitizeKeyValueCompoundField(
            data.useOfCapitalList as ICompoundField[],
          ),
        };
        dispatch(
          actions.etoFlow.saveDataStart({
            companyData: sanitizedData,
            etoData: {},
          }),
        );
      },
    }),
  }),
  withFormik<IStateProps & IDispatchProps, TPartialCompanyEtoData>({
    validationSchema: EtoPitchType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoRegistrationPitchComponent);
