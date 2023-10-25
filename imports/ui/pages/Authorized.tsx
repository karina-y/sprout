import React, { ComponentClass } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { RouteComponentPropsCustom } from "@type";
import { Meteor } from "meteor/meteor";

interface IAuthorizedProps extends RouteComponentPropsCustom {
  authenticated: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentClass<any, any>; //TODO
  path: string;
}

class Authorized extends React.Component<IAuthorizedProps> {
  static defaultProps: Partial<IAuthorizedProps>;
  static propTypes: {
    authenticated: PropTypes.Validator<boolean>;
    component: PropTypes.Validator<object>;
    path: PropTypes.Requireable<string>;
  };

  render() {
    const { authenticated, component, path, ...rest } = this.props;

    console.log("authenticated", authenticated);
    console.log("Meteor.isPro", Meteor.isPro);

    return authenticated && Meteor.isPro ? (
      React.createElement(component, {
        ...rest,
        authenticated,
      })
    ) : (
      <p style={{ padding: "40px" }}>
        You must upgrade to pro to use this feature.
      </p>
    );
  }
}

Authorized.defaultProps = {
  path: "",
};

Authorized.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  path: PropTypes.string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  return {
    authenticated: !!Meteor.userId(),
  } as IAuthorizedProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(Authorized) as ComponentClass<IAuthorizedProps, any>;
