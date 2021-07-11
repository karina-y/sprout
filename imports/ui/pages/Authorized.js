import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";

class Authorized extends React.Component {
  render() {
    const { authenticated, component, path, exact, ...rest } = this.props;

    return (
      <Route
        path={path}
        exact={exact}
        render={(props) =>
          authenticated && Meteor.isPro ? (
            React.createElement(component, {
              ...props,
              ...rest,
              authenticated,
            })
          ) : (
            <p style={{ padding: "40px" }}>
              You must upgrade to pro to use this feature.
            </p>
          )
        }
      />
    );
  }
}

Authorized.defaultProps = {
  path: "",
  exact: false,
};

Authorized.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool,
};

export default withTracker(() => {
  return {
    authenticated: Meteor.userId() ? true : false,
  };
})(Authorized);
