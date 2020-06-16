import React, { Component } from 'react';
import autobind from 'react-autobind';
import "./Account.scss";
import { Session } from "meteor/session";
import { toast } from 'react-toastify';

class Account extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  email: null,
	  password: null
	};

	autobind(this);
  }

  componentDidMount() {
	Session.set('pageTitle', "Account");

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
		  toast.success(`Welcome back ${data.name}!`);
		  props.history.push('/catalogue');
		}
	  });
	} else {
	  toast.error("Please check your inputs and try again.")
	}
  }

  createUser() {
	if (this.state.name && this.state.email && this.state.password) {
	  const data = {
		profile: {
		  name: this.state.name
		},
		email: this.state.email.toLowerCase(),
		password: this.state.password
	  };

	  Meteor.call('account.insert', data, (err, response) => {
		if (err) {
		  toast.error(err.message);
		} else {
		  //login user
		  const props = this.props;

		  Meteor.loginWithPassword(this.state.email.toLowerCase(), this.state.password, function(err) {
			if(err) {
			  //do something if error occurred or
			  toast.error(err.message)
			} else{
			  toast.success(`Welcome ${data.profile.name}! Let's add your first plant.`);
			  props.history.push('/catalogue/add');
			}
		  });
		}
	  })

	} else {
	  toast.error("Please check your inputs and try again.")
	}
  }

  render() {

	return (
			<div className="Account flex-center">
			  <p className="acct-title title-ming">Login or Sign up</p>

			  <form id="account">
				<input type="text"
					   placeholder="Name"
					   onChange={(e) => this.setState({name: e.target.value})} />

				<input type="email"
					   placeholder="E-mail"
					   onChange={(e) => this.setState({email: e.target.value})} />

				<input type="password"
					   placeholder="Password"
					   onChange={(e) => this.setState({password: e.target.value})} />
			  </form>

			  <div className="buttons-footer flex-between">
				<button onClick={this.createUser}
						className="flat">
				  Sign Up
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


export default Account;
