import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";

class Authenticated extends React.Component {
  render() {
    const { authenticated, component, path, exact, ...rest } = this.props;

    return (
      <Route
        path={path}
        exact={exact}
        render={(props) =>
          authenticated ? (
            React.createElement(component, {
              ...props,
              ...rest,
              authenticated,
            })
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  }
}

Authenticated.defaultProps = {
  path: "",
  exact: false,
};

Authenticated.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool,
};

export default withTracker(() => {
  return {
    authenticated: Meteor.userId() ? true : false,
  };
})(Authenticated);
