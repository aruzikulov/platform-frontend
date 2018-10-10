import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { EtoMediaType, TPartialCompanyEtoData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectIssuerCompany } from "../../../../modules/eto-flow/selectors";
import { etoMediaProgressOptions } from "../../../../modules/eto-flow/utils";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormCheckbox, FormField } from "../../../shared/forms";
import { MediaLinksEditor } from "../../../shared/MediaLinksEditor";
import { SOCIAL_PROFILES_ICONS, SocialProfilesEditor } from "../../../shared/SocialProfilesEditor";
import { Tooltip } from "../../../shared/Tooltip";
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

const EtoRegistrationMediaComponent = ({ savingData }: IProps) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-media.title" />}
    validator={EtoMediaType.toYup()}
    progressOptions={etoMediaProgressOptions}
  >
    <Section>
      <div className="offset-1 mb-2 font-weight-bold">
        <FormattedMessage id="eto.form.eto-media.youtube-video" />
      </div>

      <Row>
        <Col className="offset-1" xs={10}>
          <FormField name="companyVideo.url" placeholder="url" />
        </Col>
      </Row>

      <div className="offset-1 mb-2 font-weight-bold">
        <FormattedMessage id="eto.form.eto-media.slideshare" />
        <Tooltip
          className="ml-2 d-inline-block"
          content={<FormattedMessage id="eto.form.eto-media.slide-share.tooltip" />}
        />
      </div>

      <Row>
        <Col className="offset-1" xs={10}>
          <FormField name="companySlideshare.url" placeholder="url" />
        </Col>
      </Row>

      <div className="offset-1 mb-2 font-weight-bold">
        <FormattedMessage id="eto.form.eto-media.social-channels" />
      </div>
      <Row>
        <Col className="offset-1 mt-3">
          <FormCheckbox
            name="disableTwitterFeed"
            label={<FormattedMessage id="eto.form.eto-media.enable-twitter-feed" />}
          />
        </Col>
      </Row>
      <Row>
        <Col className="offset-1" xs={10}>
          <SocialProfilesEditor
            profiles={SOCIAL_PROFILES_ICONS}
            name="socialChannels"
            className="mt-4"
          />
        </Col>
      </Row>

      <div className="offset-1 mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.media-links" />
      </div>
      <p className="offset-1 mb-3">
        <FormattedMessage id="eto.form.eto-media.media-links-description" />
      </p>
      <MediaLinksEditor
        name="companyNews"
        placeholder="Media Link"
        blankField={{ publication: "", url: "", title: "" }}
      />
      <div className="offset-1 mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.campaigning-links" />
      </div>
      <p className="offset-1 mb-3">
        <FormattedMessage id="eto.form.eto-media.campaigning-links-description" />
      </p>
      <MediaLinksEditor
        name="marketingLinks"
        placeholder="Document Link"
        blankField={{ url: "", title: "" }}
      />
    </Section>
    <Col>
      <Row className="justify-content-end">
        <Button
          layout={EButtonLayout.PRIMARY}
          className="mr-4"
          type="submit"
          isLoading={savingData}
          data-test-id="eto-registration-media-submit"
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </Row>
    </Col>
  </EtoFormBase>
);

export const EtoRegistrationMedia = compose<React.SFC>(
  setDisplayName("EtoRegistrationMedia"),
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
  withFormik<IProps, TPartialCompanyEtoData>({
    validationSchema: EtoMediaType.toYup(),
    mapPropsToValues: props => {
      const values = props.stateValues;
      // set initial values to prevent server errors on saving without filled out video
      values.companyVideo = {
        url: (values.companyVideo && values.companyVideo.url) || "",
        title: (values.companyVideo && values.companyVideo.title) || "",
      };
      values.companySlideshare = {
        url: (values.companySlideshare && values.companySlideshare.url) || "",
        title: (values.companySlideshare && values.companySlideshare.title) || "",
      };
      return values;
    },
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoRegistrationMediaComponent);
