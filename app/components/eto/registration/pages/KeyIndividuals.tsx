import { connect, FieldArray, FormikProps, withFormik } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoKeyIndividualsType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { TTranslatedString } from "../../../../types";
import { Button, ButtonIcon } from "../../../shared/buttons";
import { FormField, FormTextArea } from "../../../shared/forms";
import { FormLabel } from "../../../shared/forms/formField/FormLabel";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
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
  onAddClick: () => void;
  isLast: boolean;
  isFirst: boolean;
  index: number;
  groupFieldName: string;
}

interface IKeyIndividualsGroup {
  name: string;
  title: TTranslatedString;
}

const getBlankMember = () => ({
  name: "",
  role: "",
  description: "",
  image: "",
});

const Individual: React.SFC<IIndividual> = ({
  onAddClick,
  onRemoveClick,
  isLast,
  isFirst,
  index,
  groupFieldName,
}) => (
  <>
    <FormHighlightGroup>
      {!isFirst && (
        <ButtonIcon svgIcon={closeIcon} onClick={onRemoveClick} className={styles.removeButton} />
      )}
      <FormField
        name={`${groupFieldName}.members.${index}.name`}
        label={<FormattedMessage id="eto.form.key-individuals.name" />}
        placeholder="name"
      />
      <FormField
        name={`${groupFieldName}.members.${index}.role`}
        label={<FormattedMessage id="eto.form.key-individuals.role" />}
        placeholder="role"
      />
      <FormTextArea
        name={`${groupFieldName}.members.${index}.description`}
        label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
        placeholder=" "
        charactersLimit={1200}
      />
      <FormSingleFileUpload
        label={<FormattedMessage id="eto.form.key-individuals.image" />}
        name={`${groupFieldName}.members.${index}.image`}
        acceptedFiles="image/*"
        fileFormatInformation="*150 x 150px png"
      />
      <FormField
        className="mt-4"
        name={`${groupFieldName}.members.${index}.website`}
        placeholder="website"
      />
      <FormLabel className="mt-4 mb-2">
        <FormattedMessage id="eto.form.key-individuals.add-social-channels" />
      </FormLabel>
      <SocialProfilesEditor
        profiles={SOCIAL_PROFILES_PERSON}
        name={`${groupFieldName}.members.${index}.socialChannels`}
      />
    </FormHighlightGroup>
    {isLast && (
      <Button iconPosition="icon-before" layout="secondary" svgIcon={plusIcon} onClick={onAddClick}>
        <FormattedMessage id="eto.form.key-individuals.add" />
      </Button>
    )}
  </>
);

class KeyIndividualsGroupComponent extends React.Component<
  IKeyIndividualsGroup & FormikProps<any>
> {
  componentWillMount(): void {
    const { name, formik } = this.props;
    const { setFieldValue, values } = formik;

    if (!values[name]) {
      setFieldValue(`${name}.members.0`, getBlankMember());
    }
  }

  render(): React.ReactNode {
    const { title, name, formik } = this.props;
    const { values } = formik;
    const individuals =
      values[name] && values[name].members ? values[name].members : [getBlankMember()];

    return (
      <FormSection title={title}>
        <FieldArray
          name={`${name}.members`}
          render={arrayHelpers =>
            individuals.map((_: {}, index: number) => {
              return (
                <Individual
                  key={index}
                  onRemoveClick={() => arrayHelpers.remove(index)}
                  onAddClick={() => arrayHelpers.push(getBlankMember())}
                  index={index}
                  isFirst={!index}
                  isLast={index === individuals.length - 1}
                  groupFieldName={name}
                />
              );
            })
          }
        />
      </FormSection>
    );
  }
}

const KeyIndividualsGroup = connect(KeyIndividualsGroupComponent);

const EtoRegistrationKeyIndividualsComponent = (props: IProps) => {
  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form.key-individuals.title" />}
      validator={EtoKeyIndividualsType.toYup()}
    >
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.team.title" />}
        name="founders"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.advisors.title" />}
        name="advisors"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.key-alliances.title" />}
        name="keyAlliances"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.board-members.title" />}
        name="boardMembers"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.notable-investors.title" />}
        name="notableInvestors"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.key-customers.title" />}
        name="keyCustomers"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.partners.title" />}
        name="partners"
      />
      <Col>
        <Row className="justify-content-end">
          <Button
            layout="primary"
            className="mr-4"
            type="submit"
            onClick={() => {
              props.saveData(props.values);
            }}
            isLoading={props.savingData}
          >
            Save
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
      stateValues: s.etoFlow.companyData,
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
