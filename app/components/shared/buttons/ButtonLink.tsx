import { LocationDescriptor } from "history";
import { omit } from "lodash/fp";
import * as React from "react";
import { RouterProps, withRouter } from "react-router";
import { compose, mapProps, setDisplayName, withHandlers } from "recompose";

import { Omit } from "../../../types";
import { Button, IButtonProps, IGeneralButton } from "./Button";

type TButtonLinkToProps = {
  to: LocationDescriptor;
  target?: string;
};

type TButtonLinkComponentProps = {
  component?: React.ComponentType<IButtonProps>;
};

type TButtonHandlersProps = {
  navigate: () => void;
};

type TButtonWithoutOnClick = Omit<IButtonProps, IGeneralButton>;

type TProps = TButtonLinkComponentProps & TButtonHandlersProps & TButtonWithoutOnClick;

const LinkButtonComponent: React.SFC<TProps> = ({
  navigate,
  children,
  component: Component = Button,
  ...rest
}) => (
  <Component {...rest} onClick={navigate}>
    {children}
  </Component>
);

export const ButtonLink = compose<
  TProps,
  TButtonLinkToProps & TButtonLinkComponentProps & TButtonWithoutOnClick
>(
  setDisplayName("ButtonLink"),
  withRouter,
  withHandlers<RouterProps & TButtonLinkToProps, TButtonHandlersProps>({
    navigate: ({ history, to, target }) => () => {
      if (target && to) {
        return window.open(typeof to === "string" ? to : "", target);
      }
      return history.push(to as any);
    },
  }),
  mapProps<RouterProps & TButtonLinkToProps, TProps>(
    // Remove unneeded props as they are passed through to underlying component
    omit(["history", "to", "staticContext", "location", "match"]),
  ),
)(LinkButtonComponent);
