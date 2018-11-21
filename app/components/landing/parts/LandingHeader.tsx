import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { ResponsiveImage } from "../../shared/ResponsiveImage";
import { JoinCta } from "./JoinCta";

import * as styles from "./LandingHeader.module.scss";

import * as blockstateImage from "../../../assets/img/landing/blockstate.png";
import * as blockstateImage2x from "../../../assets/img/landing/blockstate@2x.png";
import * as blockstateImage3x from "../../../assets/img/landing/blockstate@3x.png";
import * as brilleImage from "../../../assets/img/landing/brille.png";
import * as brilleImage2x from "../../../assets/img/landing/brille@2x.png";
import * as btImage from "../../../assets/img/landing/BT.png";
import * as btImage2x from "../../../assets/img/landing/BT@2x.png";
import * as btImage3x from "../../../assets/img/landing/BT@3x.png";
import * as emfluxImage from "../../../assets/img/landing/emflux.png";
import * as emfluxImage2x from "../../../assets/img/landing/emflux@2x.png";
import * as emfluxImage3x from "../../../assets/img/landing/emflux@3x.png";
import * as foundersbankImage from "../../../assets/img/landing/foundersbank.png";
import * as foundersbankImage2x from "../../../assets/img/landing/foundersbank@2x.png";
import * as foundersbankImage3x from "../../../assets/img/landing/foundersbank@3x.png";
import * as myswooopImage from "../../../assets/img/landing/myswooop.png";
import * as myswooopImage2x from "../../../assets/img/landing/myswooop@2x.png";
import * as myswooopImage3x from "../../../assets/img/landing/myswooop@3x.png";
import * as neufundImage from "../../../assets/img/landing/neufund.png";
import * as neufundImage2x from "../../../assets/img/landing/neufund@2x.png";
import * as neufundImage3x from "../../../assets/img/landing/neufund@3x.png";
import * as unitiImage from "../../../assets/img/landing/uniti.png";
import * as unitiImage2x from "../../../assets/img/landing/uniti@2x.png";
import * as unitiImage3x from "../../../assets/img/landing/uniti@3x.png";

export const LandingHeader: React.SFC = () => (
  <section className={styles.hero}>
    <Container>
      <Row>
        <Col lg={6}>
          <div className={styles.heroCta}>
            <h1 className={styles.heroHeader}>
              <FormattedMessage id="landing.hero.header" />
            </h1>
            <p className={styles.heroDescription}>
              Neufund makes it possible to invest in real world equity on the Ethereum Blockchain.
              Our platform enables primary offerings of investment assets through legally binding
              smart contracts -{" "}
              <a href="https://neufund.org/fundraise-with-equity-token" target="_blank">
                Equity Token Offerings
              </a>
              .
            </p>
            <p className={styles.heroDescription}>The future of fundraising is launching now.</p>

            <JoinCta data-test-id="landing-header-join-cta" />
          </div>
        </Col>
        <Col lg={6} className="d-none d-lg-block">
          <CompanyImages />
        </Col>
      </Row>
    </Container>
  </section>
);

const CompanyImages: React.SFC = () => (
  <div className={styles.images}>
    <a href="#eto-card-3" className={styles.companyImage}>
      <ResponsiveImage
        srcSet={{ "1x": myswooopImage, "2x": myswooopImage2x, "3x": myswooopImage3x }}
        alt="MySwoop"
      />
    </a>
    {process.env.NF_FOUNDERS_BANK_VISIBLE ? (
      <a href="#eto-card-7" className={styles.companyImage}>
        <ResponsiveImage
          srcSet={{ "1x": foundersbankImage, "2x": foundersbankImage2x, "3x": foundersbankImage3x }}
          alt="Founders bank"
        />
      </a>
    ) : (
      <a href="#eto-card-5" className={styles.companyImage}>
        <ResponsiveImage
          srcSet={{ "1x": emfluxImage, "2x": emfluxImage2x, "3x": emfluxImage3x }}
          alt="Emflux"
        />
      </a>
    )}
    <a href="#eto-card-6" className={styles.companyImage}>
      <ResponsiveImage
        srcSet={{ "1x": blockstateImage, "2x": blockstateImage2x, "3x": blockstateImage3x }}
        alt="Blockstate"
      />
    </a>
    <a href="#eto-card-1" className={styles.companyImage}>
      <ResponsiveImage srcSet={{ "1x": brilleImage, "2x": brilleImage2x }} alt="Brille24" />
    </a>
    <a href="#eto-card-4" className={styles.companyImage}>
      <ResponsiveImage srcSet={{ "1x": btImage, "2x": btImage2x, "3x": btImage3x }} alt="BT" />
    </a>
    <a href="#eto-card-0" className={styles.companyImage}>
      <ResponsiveImage
        srcSet={{ "1x": neufundImage, "2x": neufundImage2x, "3x": neufundImage3x }}
        alt="Uniti"
      />
    </a>
    <a href="#eto-card-2" className={styles.companyImage}>
      <ResponsiveImage
        srcSet={{ "1x": unitiImage, "2x": unitiImage2x, "3x": unitiImage3x }}
        alt="Uniti"
      />
    </a>
    <a href="#eto-card-4" className={styles.companyImage}>
      <ResponsiveImage
        srcSet={{ "1x": emfluxImage, "2x": emfluxImage2x, "3x": emfluxImage3x }}
        alt="Emflux"
      />
    </a>
  </div>
);
