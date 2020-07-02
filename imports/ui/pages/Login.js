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

	  Meteor.loginWithPassword(this.state.email.toLowerCase(), this.state.password, function (err) {
		if (err) {
		  //do something if error occurred or
		  toast.error(err.message)
		} else {
		  toast.success(`Welcome back ${Meteor.user().profile.name}!`);
		  props.history.push('/catalogue');
		}
	  });
	} else {
	  toast.error("Please check your inputs and try again.")
	}
  }

  render() {

	return (
			<div className="Login_Signup flex-center">
			  <p className="acct-title title-ming">Login</p>

			  <form id="Login">
				<input type="email"
					   placeholder="E-mail"
					   onChange={(e) => this.setState({email: e.target.value})} />

				<input type="password"
					   placeholder="Password"
					   onChange={(e) => this.setState({password: e.target.value})} />
			  </form>

			  <div className="buttons-footer flex-center">
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
