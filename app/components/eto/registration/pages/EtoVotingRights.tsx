import { withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoVotingRightsType,
  TEtoVotingRightsType,
  TPartialEtoSpecData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectIssuerEto } from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { BOOL_TRUE_KEY, FormSelectField } from "../../../shared/forms";
import { FormLabel } from "../../../shared/forms/form-field/FormLabel";
import { FormToggle } from "../../../shared/forms/form-field/FormToggle";
import { applyDefaults } from "../../utils";
import { EtoFormBase } from "../EtoFormBase";

// TODO: this keys will be replaced dynamically by addresses from an API endpoint, once there are more than one
const TOKEN_HOLDERS_RIGHTS = {
  [BOOL_TRUE_KEY]: "Neumini UG",
};

const LIQUIDATION_PREFERENCE_VALUES = [0, 1, 1.5, 2];

const defaults = {
  liquidationPreferenceMultiplier: 0,
  generalVotingRule: "positive",
};

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

type IProps = IExternalProps & IStateProps & IDispatchProps;

const EtoVotingRightsComponent: React.SFC<IProps> = ({ readonly, savingData }) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-voting-rights.title" />}
    validator={EtoVotingRightsType.toYup()}
  >
    <FormSelectField
      values={TOKEN_HOLDERS_RIGHTS}
      label={<FormattedMessage id="eto.form.section.token-holders-rights.nominee" />}
      name="nominee"
      disabled={readonly}
    />

    <FormSelectField
      customOptions={LIQUIDATION_PREFERENCE_VALUES.map(n => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
      label={<FormattedMessage id="eto.form.section.token-holders-rights.liquidation-preference" />}
      name="liquidationPreferenceMultiplier"
      disabled={readonly}
    />

    <div className="form-group">
      <FormLabel name="generalVotingRule">
        <FormattedMessage id="eto.form.section.token-holders-rights.voting-rights-enabled" />
      </FormLabel>
      <FormToggle
        name="generalVotingRule"
        trueValue="positive"
        falseValue="no_voting_rights"
        disabledLabel={<FormattedMessage id="form.select.no" />}
        enabledLabel={<FormattedMessage id="form.select.yes" />}
        disabled={readonly}
      />
    </div>

    {!readonly && (
      <Col>
        <Row className="justify-content-center">
          <Button
            layout={EButtonLayout.PRIMARY}
            type="submit"
            isLoading={savingData}
            data-test-id="eto-registration-voting-rights-submit"
          >
            <FormattedMessage id="form.button.save" />
          </Button>
        </Row>
      </Col>
    )}
  </EtoFormBase>
);

export const EtoVotingRights = compose<React.SFC<IExternalProps>>(
  setDisplayName("EtoVotingRights"),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerEto(s) as TPartialEtoSpecData,
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
  withFormik<IProps, TPartialEtoSpecData>({
    validationSchema: EtoVotingRightsType.toYup(),
    mapPropsToValues: props => applyDefaults(props.stateValues, defaults),
    handleSubmit: (values, props) => {
      return props.props.saveData(dataToCanonicalForm(values));
    },
  }),
)(EtoVotingRightsComponent);

const dataToCanonicalForm = (values: Partial<TEtoVotingRightsType>) => {
  values.liquidationPreferenceMultiplier = parseFloat(`${values.liquidationPreferenceMultiplier}`);
  return values;
};
