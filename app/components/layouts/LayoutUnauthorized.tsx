import * as React from "react";

import { Footer } from "../Footer";
import { Header } from "../Header";

import * as styles from "./LayoutShared.module.scss";

export const LayoutUnauthorized: React.SFC = ({ children }) => (
  <>
    <Header />

    <div className={`wrapper ${styles.layoutBg}`}>{children}</div>

    <Footer />
  </>
);
