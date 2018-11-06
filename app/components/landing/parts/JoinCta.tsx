import * as cn from "classnames";
import * as queryString from "query-string";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { appRoutes } from "../../appRoutes";
import { ButtonLink } from "../../shared/buttons";

import * as styles from "./JoinCta.module.scss";

interface IState {
  loading: boolean;
  error?: boolean;
  success?: boolean;
}

type TSubscribeStatus = "success" | "invalid_timestamp" | "invalid_hmac" | "error";

export class JoinCta extends React.Component<CommonHtmlProps, IState> {
  state: IState = {
    loading: false,
  };
  emailInput: any = React.createRef();

  setEmailInputRef = (element: any) => {
    this.emailInput = element;
  };

  onSubmit = async (e: any) => {
    e.preventDefault();
    const email: string = this.emailInput.value;

    this.setState({ loading: true, error: false, success: false });

    const response = await fetch("api/newsletter/subscription", {
      method: "POST",
      body: JSON.stringify({
        email,
        name: "",
        list: "newsletter",
        return_url: "https://platform.neufund.org",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    this.emailInput.value = "";
    if (response.status !== 200) {
      return this.setState({
        loading: false,
        error: true,
      });
    }

    return this.setState({
      loading: false,
      success: true,
    });
  };

  render(): React.ReactNode {
    const htmlProps = this.props;
    const { loading, error, success } = this.state;
    const subscribe: TSubscribeStatus | undefined = (
      queryString.parse(window.location.search) || {}
    ).subscribe;

    const subscribeSuccessful = subscribe === "success";
    const subscribeFailed = subscribe && subscribe !== "success";

    return (
      <div id="newsletter">
        <div className={cn(styles.joinCta, htmlProps.className)} style={htmlProps.style}>
          <ButtonLink theme="brand" to={appRoutes.register} className={styles.registerNow}>
            Register NOW
          </ButtonLink>

          <span className="m-2">or</span>

          <form className={cn("form-inline", styles.email)} onSubmit={this.onSubmit}>
            <input
              type="text"
              className={styles.emailInput}
              placeholder="Email me updates"
              ref={this.setEmailInputRef}
            />

            <button type="submit" className={styles.emailBtn} disabled={loading}>
              Subscribe
            </button>
          </form>
        </div>
        <div className="text-center">
          {success && <p className="my-3">Check your email for the confirmation link!</p>}
          {error && <p className="my-3">Ups, something went wrong!</p>}
          {subscribeSuccessful && (
            <p className="my-3">You were successfully added to our newsletter!</p>
          )}
          {subscribeFailed && (
            <p className="my-3">There was an error while subscribing to the newsletter!</p>
          )}
        </div>
      </div>
    );
  }
}
