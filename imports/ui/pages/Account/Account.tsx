import React, { Component } from "react";
import "./Account.scss";
import { Session } from "meteor/session";
import { toast } from "react-toastify";
import { Accounts } from "meteor/accounts-base";
import { Preferences } from "@api";
import { Meteor } from "meteor/meteor";
import autobind from "autobind-decorator";
import { RouteComponentPropsCustom } from "@type";

type IAccountProps = RouteComponentPropsCustom;

interface IAccountState {
  name?: string;
  email?: string;
  zip?: string;
  currentPassword?: string;
  editing: boolean;
  changingPassword: boolean;
  newPassword?: string;
  confirmNewPassword?: string;
  currentTheme?: string;
  newTheme?: string;
  verified?: boolean;
  pro?: boolean;
}

type NewProfile = {
  name: string;
  email: string;
  zip: string;
};

@autobind
class Account extends Component<IAccountProps, IAccountState> {
  constructor(props: IAccountProps) {
    super(props);

    this.state = {
      name: undefined,
      email: undefined,
      zip: undefined,
      currentPassword: undefined,
      editing: false,
      changingPassword: false,
      newPassword: undefined,
      confirmNewPassword: undefined,
      currentTheme: undefined,
      newTheme: undefined,
    };
  }

  componentDidMount() {
    Session.set("pageTitle", "Account");
    const preferences = Preferences.findOne({ userId: Meteor.userId() });

    console.log("this.props.history?.action", this.props.history?.action);

    //TODO is there a smarter way to do this?
    if (this.props.history?.action === "REPLACE") {
      //TODO enumify this
      toast.error("You need to be logged in to perform that action.");
    }

    this.setState({
      currentTheme: preferences ? preferences.theme || "light" : "light", //TODO enumify these
    });
  }

  changePassword() {
    if (
      !this.state.newPassword ||
      !this.state.confirmNewPassword ||
      !this.state.currentPassword
    ) {
      toast.error("Please fill out all fields.");
    } else if (this.state.newPassword !== this.state.confirmNewPassword) {
      toast.error(
        "New passwords do not match, please re-enter your new password.",
      );
    } else {
      Accounts.changePassword(
        this.state.currentPassword,
        this.state.newPassword,
        (err) => {
          if (err) {
            toast.error(err.message);
          } else {
            toast.success("Password successfully changed.");
            this.resetProfile();
          }
        },
      );
    }
  }

  saveProfile() {
    const newProfile = {} as NewProfile;

    if (this.state.name) {
      newProfile.name = this.state.name;
    }

    if (this.state.email) {
      newProfile.email = this.state.email;
    }

    if (this.state.zip) {
      newProfile.zip = this.state.zip;
    }

    const isPro = Meteor.isPro;

    if (
      JSON.stringify(newProfile) === "{}" &&
      isPro === Meteor.isPro &&
      this.state.newTheme === this.state.currentTheme
    ) {
      //no updates made
      toast.error("Please enter your updated information.");
    } else {
      Meteor.call(
        "account.updateProfile",
        newProfile,
        this.state.newTheme,
        isPro,
        (err: Meteor.Error) => {
          if (err) {
            toast.error(err.message);
          } else {
            toast.success("Profile successfully updated.");
            this.resetProfile();
          }
        },
      );
    }
  }

  resetProfile() {
    this.setState({
      newPassword: undefined,
      editing: false,
      changingPassword: false,
    });
  }

  render() {
    const name = Meteor.user()?.profile?.name;
    const zip = Meteor.user()?.profile?.zip || "N/A";
    const email = Meteor.user()?.emails?.[0]?.address;
    const pro = Meteor.isPro;
    const { changingPassword, editing, currentTheme, verified } = this.state;

    return (
      <div className="Account">
        <h4 className="acct-title page-title-ming">Account</h4>

        {!changingPassword && (
          <React.Fragment>
            <p className={editing ? "modern-input" : ""}>
              <label>e-mail</label>
              {editing ? (
                <input
                  type="email"
                  placeholder="E-mail"
                  defaultValue={email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
              ) : (
                email
              )}
            </p>

            <p className={editing ? "modern-input" : ""}>
              <label>name</label>
              {editing ? (
                <input
                  type="text"
                  placeholder="Name"
                  defaultValue={name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                />
              ) : (
                name
              )}
            </p>

            <p className={editing ? "modern-input" : ""}>
              <label>zip / postal code</label>
              {editing ? (
                <input
                  type="text"
                  placeholder="Zip / Postal Code"
                  defaultValue={zip}
                  onChange={(e) => this.setState({ zip: e.target.value })}
                />
              ) : (
                zip
              )}
            </p>

            <p className={editing ? "modern-input" : ""}>
              <label>theme</label>
              {editing ? (
                <select
                  placeholder="Category"
                  onChange={(e) => this.setState({ newTheme: e.target.value })}
                  defaultValue={currentTheme}
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                </select>
              ) : (
                currentTheme
              )}
            </p>

            {/*TODO remove for prod, just for testing*/}
            {!editing && (
              <p>
                <label>Verified?</label>
                {verified ? "Yes" : "No"}
              </p>
            )}

            {/*TODO remove for prod, just for testing*/}
            <p className="pro-checkbox">
              <label>pro?</label>
              {editing ? (
                <input
                  type="checkbox"
                  placeholder="pro"
                  className="small-checkbox"
                  checked={pro}
                  onChange={() => this.setState({ pro: !pro })}
                />
              ) : pro ? (
                "Yes"
              ) : (
                "No"
              )}
            </p>
          </React.Fragment>
        )}

        {changingPassword && (
          <form>
            <p className={changingPassword ? "modern-input" : ""}>
              <label>current password</label>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  this.setState({ currentPassword: e.target.value })
                }
              />
            </p>

            <p className={changingPassword ? "modern-input" : ""}>
              <label>new password</label>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => this.setState({ newPassword: e.target.value })}
              />
            </p>

            <p className={changingPassword ? "modern-input" : ""}>
              <label>confirm new password</label>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  this.setState({ confirmNewPassword: e.target.value })
                }
              />
            </p>
          </form>
        )}

        <div className="buttons-footer">
          {!changingPassword && (
            <button
              onClick={() =>
                editing
                  ? this.saveProfile()
                  : this.setState({ editing: true, changingPassword: false })
              }
              className="flat"
            >
              {editing ? "Save Profile" : "Edit Profile"}
            </button>
          )}

          {!editing && (
            <button
              onClick={() =>
                changingPassword
                  ? this.changePassword()
                  : this.setState({ editing: false, changingPassword: true })
              }
              className="flat"
            >
              {changingPassword ? "Save Password" : "New Password"}
            </button>
          )}

          {(editing || changingPassword) && (
            <button onClick={this.resetProfile} className="btn-danger">
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Account;
