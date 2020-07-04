import React, { Component } from 'react';
import autobind from 'react-autobind';
import "./Login_Signup.scss";
import { Session } from "meteor/session";
import { toast } from 'react-toastify';

class Login extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  email: null,
	  password: null
	};

	autobind(this);
  }

  componentDidMount() {
	Session.set('pageTitle', "Login");

	//TODO is there a smarter way to do this?
	if (this.props.history.action === "REPLACE") {
	  toast.error("You need to be logged in to perform that action.");
	}
  }

  login() {
	if (this.state.email && this.state.password) {
	  const props = this.props;

	  // Meteor.call('account.validateLogin')

	  Meteor.loginWithPassword(this.state.email.toLowerCase(), this.state.password, function (err) {
		if (err) {
		  //do something if error occurred or
		  toast.error(err.message)
		} else {
		  toast.success(`Welcome back ${Meteor.user().profile.name}!`);
		  props.history.push('/');
		}
	  });
	} else {
	  toast.error("Please check your inputs and try again.")
	}
  }

  forgotPassword() {
    if (!this.state.email) {
      toast.error('Please enter your email.')
	} else {
	  Accounts.forgotPassword({email: this.state.email}, (err) => {
	    if (err) {
	      toast.error(err.message)
		} else {
	      toast.success('Please check your email for a password reset link.')
		}
	  })
	}
  }

  render() {

	return (
			<div className="Login_Signup flex-center">
			  <h4 className="acct-title title-ming">Login</h4>

			  <form id="Login">
				<input type="email"
					   placeholder="E-mail"
					   onChange={(e) => this.setState({email: e.target.value})} />

				<input type="password"
					   placeholder="Password"
					   onChange={(e) => this.setState({password: e.target.value})} />
			  </form>

			  <div className="buttons-footer flex-between">
				<button onClick={this.forgotPassword}
						className="flat">
				  Forgot Password
				</button>

				<button onClick={this.login}
						className="flat">
				  Login
				</button>
			  </div>
			</div>
	);
  }
}


export default Login;
