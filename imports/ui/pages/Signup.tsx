import React, { Component } from "react";
import "./Login_Signup.scss";
import { Session } from "meteor/session";
import { toast } from "react-toastify";
import autobind from "autobind-decorator";
import { RouteComponentPropsCustom } from "@type";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

type ISignupProps = RouteComponentPropsCustom;

interface ISignupState {
  name?: string;
  email?: string;
  zip?: string;
  password?: string;
}
@autobind
class Signup extends Component<ISignupProps, ISignupState> {
  constructor(props: ISignupProps) {
    super(props);

    this.state = {
      name: undefined,
      email: undefined,
      zip: undefined,
      password: undefined,
    };
  }

  componentDidMount() {
    Session.set("pageTitle", "Sign Up");

    //TODO is there a smarter way to do this?
    if (this.props.history.action === "REPLACE") {
      toast.error("You need to be logged in to perform that action.");
    }
  }

  createUser() {
    const { name, email, password, zip } = this.state;

    if (name && email && password) {
      //TODO const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      //password constraints

      const data = {
        profile: {
          name: name,
          zip: zip,
        },
        email: email.toLowerCase(),
        password: password,
      };

      Meteor.call("account.insert", data, (err: Meteor.Error) => {
        if (err) {
          console.log("err");
          toast.error(err.message);
        } else {
          //login user
          // const props = this.props

          // Accounts.sendVerificationEmail(response)

          toast.success("Please check your email to verify your account.");

          Accounts.onEmailVerificationLink((token: string, _done: unknown) => {
            Accounts.verifyEmail(token, (err) => {
              if (err) {
                toast.error(err.message);
              } else {
                //TODO send welcome email
                // console.log("Calling Meteor.methods.emailSendWelcome", done);
                /*Meteor.call("Meteor.methods.emailSendWelcome", null, (error, result) => {
				  if (error) console.log("Error: ", error);
				});*/
                // done();
              }
            });
          });

          /*Meteor.loginWithPassword(this.state.email.toLowerCase(), this.state.password, function (err) {
			if (err) {
			  //do something if error occurred or
			  toast.error(err.message)
			} else {
			  toast.success(`Welcome ${data.profile.name}! Let's add your first plant.`)
			  props.history.push('/plant/add')
			}
		  })*/
        }
      });
    } else {
      toast.error("Please check your inputs and try again.");
    }
  }

  render() {
    return (
      <div className="Login_Signup flex-center flex-wrap">
        <h4 className="acct-title page-title-ming">Sign up</h4>

        <form id="Logout">
          <p className="modern-input">
            <label>name</label>
            <input
              type="text"
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </p>

          <p className="modern-input">
            <label>e-mail</label>
            <input
              type="email"
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </p>

          <p className="modern-input">
            <label>zip / postal code (optional)</label>
            <input
              type="text"
              onChange={(e) => this.setState({ zip: e.target.value })}
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
          <button onClick={this.createUser} className="flat">
            Sign Up
          </button>
        </div>
      </div>
    );
  }
}

export default Signup;
