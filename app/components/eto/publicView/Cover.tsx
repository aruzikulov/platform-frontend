import * as React from "react";

import { TTranslatedString } from "../../../types";
import { IResponsiveImage, ResponsiveImage } from "../../shared/ResponsiveImage";
import { Tag } from "../../shared/Tag";

import * as styles from "./Cover.module.scss";

interface IProps {
  companyBanner: IResponsiveImage;
  companyName: TTranslatedString;
  companyOneliner: TTranslatedString;
  companyLogo: IResponsiveImage;
  tags: TTranslatedString[];
}

export const Cover: React.SFC<IProps> = ({
  companyBanner,
  companyName,
  companyOneliner,
  companyLogo,
  tags,
}) => {
  const initialTags = tags || [];
  return (
    <div className={styles.cover}>
      <ResponsiveImage
        width={1250}
        height={400}
        srcSet={companyBanner.srcSet}
        alt={companyBanner.alt}
      />

      <div className={styles.companyDetails}>
        <div className={styles.identity}>
          <div className={styles.logo}>
            <ResponsiveImage srcSet={companyLogo.srcSet} alt={companyLogo.alt} theme="light" />
          </div>
          <div className={styles.details}>
            <h2 className={styles.name}>{companyName}</h2>
            <h3 className={styles.shortDescription}>{companyOneliner}</h3>
          </div>
        </div>
        <div className={styles.tags}>
          {initialTags.map((tag, index) => (
            <Tag text={tag} className="ml-3" layout="bold" theme="dark" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
