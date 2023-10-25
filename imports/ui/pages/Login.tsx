import React, { Component } from "react";
import "./Login_Signup.scss";
import { Session } from "meteor/session";
import { toast } from "react-toastify";
import autobind from "autobind-decorator";
import { RouteComponentPropsCustom } from "@type";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Navigate } from "react-router-dom";

type ILoginProps = RouteComponentPropsCustom;

interface ILoginState {
  email?: string;
  password?: string;
  redirect: boolean;
}

@autobind
class Login extends Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);

    this.state = {
      email: undefined,
      password: undefined,
      redirect: false,
    };
  }

  componentDidMount() {
    Session.set("pageTitle", "Login");

    if (Meteor.userId()) {
      this.setState({ redirect: true });
    }

    //TODO is there a smarter way to do this?
    /*if (this.props.history.action === 'REPLACE') {
	  toast.error('You need to be logged in to perform that action.')
	}*/
  }

  login() {
    if (this.state.email && this.state.password) {
      const setState = this.setState;

      // Meteor.call('account.validateLogin')

      Meteor.loginWithPassword(
        this.state.email.toLowerCase(),
        this.state.password,
        function (err) {
          if (err) {
            //do something if error occurred or
            toast.error(err.message);
          } else {
            toast.success(`Welcome back ${Meteor?.user()?.profile?.name}!`);
            setState({ redirect: true });
          }
        },
      );
    } else {
      toast.error("Please check your inputs and try again.");
    }
  }

  forgotPassword() {
    if (!this.state.email) {
      toast.error("Please enter your email.");
    } else {
      Accounts.forgotPassword({ email: this.state.email }, (err) => {
        if (err) {
          toast.error(err.message);
        } else {
          toast.success("Please check your email for a password reset link.");
        }
      });
    }
  }

  render() {
    return (
      <div className="Login_Signup flex-center flex-wrap">
        <h4 className="acct-title page-title-ming">Login</h4>
        <form id="Login">
          <p className="modern-input">
            <label>e-mail</label>
            <input
              type="email"
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </p>

          <p className="modern-input">
            <label>password</label>
            <input
              type="password"
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </p>
        </form>
        <div className="buttons-footer text-center">
          <button onClick={this.login} className="flat">
            Login
          </button>

          <br />
          <br />

          <button onClick={this.forgotPassword} className="naked">
            Forgot Your Password?
          </button>
        </div>

        {this.state.redirect && <Navigate to="/" replace={true} />}
      </div>
    );
  }
}

export default Login;
