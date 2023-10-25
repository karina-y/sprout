import React, { Component, ComponentClass } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { RouteComponentPropsCustom } from "@type";
import { Login } from "@page/index.ts";

//TODO is this import correct?

interface IAuthenticatedProps extends RouteComponentPropsCustom {
  authenticated: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentClass<any, any>; //TODO
  path: string;
}

//TODO some use React.Component and some use Component.. why?
class Authenticated extends Component<IAuthenticatedProps> {
  static defaultProps: Partial<IAuthenticatedProps>;

  static propTypes: {
    authenticated: PropTypes.Validator<boolean>;
    component: PropTypes.Validator<object>;
    path: PropTypes.Requireable<string>;
  };

  render() {
    const { authenticated, component, ...rest } = this.props;

    return authenticated ? (
      React.createElement(component, {
        ...rest,
        authenticated,
      })
    ) : (
      <Login {...this.props} />
    );
  }
}

Authenticated.defaultProps = {
  path: "",
  authenticated: false,
};

Authenticated.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  path: PropTypes.string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  return {
    authenticated: !!Meteor.userId(),
  } as IAuthenticatedProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(Authenticated) as ComponentClass<IAuthenticatedProps, any>;
