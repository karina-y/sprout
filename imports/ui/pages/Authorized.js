// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const Authorized = ({ component: Component, ...props }) => {

  // Add your own authentication on the below line.
  const isLoggedIn = Meteor.userId();

  return (
		  <Route
				  {...props}
				  render={props =>
						  isLoggedIn ? (
								  <Component {...props} />
						  ) : (
								  <Redirect to={{ pathname: '/account', state: { from: props.location } }} />
						  )
				  }
		  />
  )
}

export default Authorized
