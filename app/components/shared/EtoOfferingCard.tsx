import * as cn from "classnames";
import * as React from "react";
import { withSizes } from "react-sizes";

import * as QuestionMark from "!url-loader!../../assets/img/inline_icons/questionmark_huge.svg";
import * as AppStoreIcon from "../../assets/img/eto_offers/appstore.png";
import * as SiemensLogo from "../../assets/img/eto_offers/Siemens-logo.svg";
import { Proportion } from "./Proportion";
import { IResponsiveImage, ResponsiveImage } from "./ResponsiveImage";
import { ITag, Tag } from "./Tag";

import * as styles from "./EtoOfferingCard.module.scss";

export interface IEtoOfferingProps {
  roundName?: string;
  tags: ITag[];
  name?: string;
  description: string;
  quote?: {
    text: string;
    credits: string;
  };
  to?: string;
  logo?: string;
  topImage: IResponsiveImage;
  quoteImage?: IResponsiveImage;
  badge?: IResponsiveImage;
  quoteBackground?: string;
  quoteColor?: string;
  className?: string;
  teaser?: boolean;
  bannerWithGif?: boolean;
}

export interface ISizeProps {
  isMobile: boolean;
}

interface IPropsRoundLabel {
  text: string | React.ReactNode;
}

const RoundLabel: React.SFC<IPropsRoundLabel> = ({ text }) => {
  return (
    <div className={styles.roundLabel}>
      <svg viewBox="0 0 170 100">
        <path
          className={styles.curvyBackground}
          d="M0,102 L0,0 L170.694,0 C166.486,25.398 156.794,41.95 141.616,49.655 C128.623,56.253 93.071,57.423 48.428,72.351 C35.003,76.84 18.86,86.723 0,102 Z"
        />
      </svg>
      <span>{text}</span>
    </div>
  );
};

interface IState {
  isClicked: boolean;
}

export class EtoOfferingCardComponent extends React.Component<
  IEtoOfferingProps & ISizeProps,
  IState
> {
  state = {
    isClicked: false,
  };

  private onClick = () => {
    const { isMobile, teaser } = this.props;

    if (!isMobile || teaser) return;

    this.setState(s => ({ isClicked: !s.isClicked }));
  };

  render(): React.ReactNode {
    const props = this.props;
    const { isClicked } = this.state;

    const Wrapper: React.SFC = ({ children }) => {
      if (props.to && !props.isMobile) {
        return (
          <a
            href={props.to}
            target="_blank"
            className={cn(
              styles.card,
              props.className,
              props.teaser && styles.teaser,
              props.isMobile && styles.mobile,
            )}
          >
            {children}
          </a>
        );
      }

      return (
        <div
          className={cn(
            styles.card,
            props.className,
            props.teaser && styles.teaser,
            props.isMobile && !props.teaser && styles.mobile,
            isClicked && styles.flipped,
          )}
          onClick={this.onClick}
        >
          {children}
        </div>
      );
    };

    return (
      <Wrapper>
        <Proportion width={100} height={50}>
          <div className={styles.top}>
            {props.badge && (
              <div className={styles.badge}>
                <ResponsiveImage
                  src={props.badge.src}
                  srcSet={props.badge.srcSet}
                  alt={props.badge.alt}
                  width={props.badge.width}
                  height={props.badge.height}
                />
              </div>
            )}
            {props.topImage && (
              <ResponsiveImage
                className={styles.image}
                src={props.topImage.src}
                srcSet={props.topImage.srcSet}
                alt={props.topImage.alt}
                width={props.topImage.width}
                height={props.topImage.height}
              />
            )}
            {props.roundName ? <RoundLabel text={props.roundName} /> : <div />}
            {props.logo && (
              <img className={styles.logo} src={props.logo} alt={`${props.name} logo`} />
            )}
            {props.teaser && (
              <div className={styles.teaserMessage}>
                <img src={QuestionMark} />
              </div>
            )}
            <div className={styles.tags}>
              {props.tags.map((tag, index) => (
                <Tag className="ml-2" {...tag} key={index} />
              ))}
            </div>
          </div>
        </Proportion>
        <div className={styles.bottom}>
          <Proportion width={10} height={3.5} className={styles.descriptionProportion}>
            <div className={styles.descriptionWrapper}>
              <h3 className={styles.name}>{props.name || "Announcing soon"}</h3>
              <p className={cn(styles.description)}>{props.description}</p>
            </div>
          </Proportion>
          {props.bannerWithGif ? (
            <blockquote className={cn(styles.quote, styles.animatedGifWithDescription)}>
              {props.isMobile && (
                <a className={styles.navigationArrow} href={props.to} target="_blank">
                  <i className="fa fa-arrow-right" />
                </a>
              )}
              {props.quoteImage && (
                <div className={styles.imageWrapper}>
                  <ResponsiveImage
                    className={styles.animation}
                    src={props.quoteImage.src}
                    srcSet={props.quoteImage.srcSet}
                    alt={props.quoteImage.alt}
                    width={props.quoteImage.width}
                    height={props.quoteImage.height}
                  />
                  <div className={styles.banner}>{this.renderBannerComponent(props.name!)}</div>
                </div>
              )}
            </blockquote>
          ) : (
            <blockquote
              className={cn(styles.quote, props.teaser && styles.teaser)}
              style={{ background: props.quoteBackground, color: props.quoteColor }}
            >
              {props.isMobile && (
                <a className={styles.navigationArrow} href={props.to} target="_blank">
                  <i className="fa fa-arrow-right" />
                </a>
              )}
              {props.quoteImage && (
                <ResponsiveImage
                  className={styles.image}
                  src={props.quoteImage.src}
                  srcSet={props.quoteImage.srcSet}
                  alt={props.quoteImage.alt}
                  height={props.quoteImage.height}
                  width={props.quoteImage.width}
                />
              )}
              {!props.teaser && (
                <>
                  {props.quote &&
                    props.quote.text && (
                      <div className={styles.quoteWrapper}>
                        <p>
                          {'"'}
                          {props.quote.text}
                          {'"'}
                        </p>
                        <p>{props.quote.credits}</p>
                      </div>
                    )}
                </>
              )}
            </blockquote>
          )}
        </div>
      </Wrapper>
    );
  }

  private renderBannerComponent(name: string): React.ReactNode {
    switch (name) {
      case "BRILLE24":
        return <BrilleBanner />;
      case "UNITI":
        return <UnitiBanner />;
      default:
        throw new Error("Unrecognized company name");
    }
  }
}

const mapSizesToProps = ({ width }: any) => ({
  isMobile: width < 992,
});

export const EtoOfferingCard: React.SFC<IEtoOfferingProps> = withSizes(mapSizesToProps)(
  EtoOfferingCardComponent,
);

const BrilleBanner = () => (
  <>
    <img src={AppStoreIcon} className={styles.appStore} />
  </>
);

const UnitiBanner = () => (
  <>
    <h3>Technological partner:</h3>
    <img src={SiemensLogo} className={styles.siemensLogo} />
  </>
);
