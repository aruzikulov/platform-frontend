import { connect, FieldArray, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";
import { Schema } from "yup";

import {
  EtoKeyIndividualsType,
  TEtoKeyIndividualType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectIssuerCompany } from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { TFormikConnect, TTranslatedString } from "../../../../types";
import { getField, isRequired } from "../../../../utils/yupUtils";
import { Button, ButtonIcon, EButtonLayout } from "../../../shared/buttons";
import { FormField, FormTextArea } from "../../../shared/forms";
import { FormLabel } from "../../../shared/forms/form-field/FormLabel";
import { FormSingleFileUpload } from "../../../shared/forms/form-field/FormSingleFileUpload";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormSection } from "../../../shared/forms/FormSection";
import { SOCIAL_PROFILES_PERSON, SocialProfilesEditor } from "../../../shared/SocialProfilesEditor";
import { EtoFormBase } from "../EtoFormBase";

import * as closeIcon from "../../../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../../../assets/img/inline_icons/round_plus.svg";
import * as styles from "./KeyIndividuals.module.scss";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps & FormikProps<TPartialCompanyEtoData>;

interface IIndividual {
  onRemoveClick: () => void;
  canRemove: boolean;
  index: number;
  groupFieldName: string;
}

interface IKeyIndividualsGroup {
  name: string;
  title: TTranslatedString;
  validationSchema: Schema<TEtoKeyIndividualType>;
}

const getBlankMember = () => ({
  name: "",
  role: "",
  description: "",
  image: "",
});

const Individual: React.SFC<IIndividual> = ({
  onRemoveClick,
  canRemove,
  index,
  groupFieldName,
}) => {
  const group = `${groupFieldName}.members.${index}`;

  return (
    <FormHighlightGroup>
      {canRemove && (
        <ButtonIcon svgIcon={closeIcon} onClick={onRemoveClick} className={styles.removeButton} />
      )}
      <FormField
        name={`${group}.name`}
        label={<FormattedMessage id="eto.form.key-individuals.name" />}
        placeholder="name"
      />
      <FormField
        name={`${group}.role`}
        label={<FormattedMessage id="eto.form.key-individuals.role" />}
        placeholder="role"
      />
      <FormTextArea
        name={`${group}.description`}
        label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
        placeholder=" "
        charactersLimit={1200}
      />
      <FormSingleFileUpload
        label={<FormattedMessage id="eto.form.key-individuals.image" />}
        name={`${group}.image`}
        acceptedFiles="image/*"
        fileFormatInformation="*150 x 150px png"
        data-test-id={`${group}.image`}
      />
      <FormField className="mt-4" name={`${group}.website`} placeholder="website" />
      <FormLabel className="mt-4 mb-2">
        <FormattedMessage id="eto.form.key-individuals.add-social-channels" />
      </FormLabel>
      <SocialProfilesEditor profiles={SOCIAL_PROFILES_PERSON} name={`${group}.socialChannels`} />
    </FormHighlightGroup>
  );
};

class KeyIndividualsGroupLayout extends React.Component<IKeyIndividualsGroup & TFormikConnect> {
  isEmpty(): boolean {
    const { name, formik } = this.props;
    const { values } = formik;

    const individuals = values[name];

    return !individuals || (individuals.members && individuals.members.length === 0);
  }

  isRequired(): boolean {
    return isRequired(this.props.validationSchema);
  }

  componentDidMount(): void {
    const { name, formik } = this.props;
    const { setFieldValue } = formik;

    if (this.isRequired() && this.isEmpty()) {
      setFieldValue(`${name}.members.0`, getBlankMember());
    }
  }

  render(): React.ReactNode {
    const { title, name, formik } = this.props;
    const { values } = formik;
    const individuals = this.isEmpty() ? [] : values[name].members;

    return (
      <FormSection title={title}>
        <FieldArray
          name={`${name}.members`}
          render={arrayHelpers => (
            <>
              {individuals.map((_: {}, index: number) => {
                const canRemove = !(index === 0 && this.isRequired());

                return (
                  <Individual
                    key={index}
                    onRemoveClick={() => arrayHelpers.remove(index)}
                    index={index}
                    canRemove={canRemove}
                    groupFieldName={name}
                  />
                );
              })}
              <Button
                data-test-id={`key-individuals-group-button-${name}`}
                iconPosition="icon-before"
                layout={EButtonLayout.SECONDARY}
                svgIcon={plusIcon}
                onClick={() => arrayHelpers.push(getBlankMember())}
              >
                <FormattedMessage id="eto.form.key-individuals.add" />
              </Button>
            </>
          )}
        />
      </FormSection>
    );
  }
}

const KeyIndividualsGroup = connect<IKeyIndividualsGroup, TEtoKeyIndividualType>(
  KeyIndividualsGroupLayout,
);

const EtoRegistrationKeyIndividualsComponent = (props: IProps) => {
  const validator = EtoKeyIndividualsType.toYup();

  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form.key-individuals.title" />}
      validator={validator}
    >
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.team.title" />}
        name="team"
        validationSchema={getField("team", validator)}
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.advisors.title" />}
        name="advisors"
        validationSchema={getField("advisors", validator)}
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.key-alliances.title" />}
        name="keyAlliances"
        validationSchema={getField("keyAlliances", validator)}
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.board-members.title" />}
        name="boardMembers"
        validationSchema={getField("boardMembers", validator)}
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.notable-investors.title" />}
        name="notableInvestors"
        validationSchema={getField("notableInvestors", validator)}
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.key-customers.title" />}
        name="keyCustomers"
        validationSchema={getField("keyCustomers", validator)}
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.partners.title" />}
        name="partners"
        validationSchema={getField("partners", validator)}
      />
      <Col>
        <Row className="justify-content-end">
          <Button
            layout={EButtonLayout.PRIMARY}
            className="mr-4"
            type="submit"
            isLoading={props.savingData}
            data-test-id="eto-registration-key-individuals-submit"
          >
            <FormattedMessage id="form.button.save" />
          </Button>
        </Row>
      </Col>
    </EtoFormBase>
  );
};

export const EtoRegistrationKeyIndividuals = compose<React.SFC>(
  setDisplayName("EtoRegistrationKeyIndividuals"),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerCompany(s) as TPartialCompanyEtoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialCompanyEtoData) => {
        dispatch(actions.etoFlow.saveDataStart({ companyData: data, etoData: {} }));
      },
    }),
  }),
  withFormik<IStateProps & IDispatchProps, TPartialCompanyEtoData>({
    validationSchema: EtoKeyIndividualsType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoRegistrationKeyIndividualsComponent);
