import React, { Component } from 'react'
import autobind from 'react-autobind'
import './Account.scss'
import { Session } from 'meteor/session'
import { toast } from 'react-toastify'
import { Accounts } from 'meteor/accounts-base'
import Preferences from '../../api/Preferences/Preferences'
import { Meteor } from 'meteor/meteor'

class Account extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  name: null,
	  email: null,
	  zip: null,
	  currentPassword: null,
	  editing: false,
	  changingPassword: false,
	  pro: false,
	  newPassword: null,
	  confirmNewPassword: null,
	  theme: null
	}

	autobind(this)
  }

  componentDidMount () {
	Session.set('pageTitle', 'Account')
	const preferences = Preferences.findOne({userId: Meteor.userId()})

	//TODO is there a smarter way to do this?
	if (this.props.history.action === 'REPLACE') {
	  toast.error('You need to be logged in to perform that action.')
	}

	this.setState({
	  pro: Meteor.isPro,
	  theme: preferences ? preferences.theme || 'light' : 'light'
	})
  }

  changePassword () {
	if (!this.state.newPassword || !this.state.confirmNewPassword || !this.state.currentPassword) {
	  toast.error('Please fill out all fields.')
	} else if (this.state.newPassword !== this.state.confirmNewPassword) {
	  toast.error('New passwords do not match, please re-enter your new password.')
	} else {

	  Accounts.changePassword(this.state.currentPassword, this.state.newPassword, (err) => {
		if (err) {
		  toast.error(err.message)
		} else {
		  toast.success('Password successfully changed.')
		  this.resetProfile()
		}
	  })

	}
  }

  saveProfile () {
	let newProfile = {};

	if (this.state.name) {
	  newProfile.name = this.state.name;
	}

	if (this.state.email) {
	  newProfile.email = this.state.email;
	}

	if (this.state.zip) {
	  newProfile.zip = this.state.zip;
	}

	const isPro = this.state.pro

	if (JSON.stringify(newProfile) === "{}" && isPro === Meteor.isPro) {
	  //no updates made
	  toast.error('Please enter your updated information.')
	} else {
	  Meteor.call('account.updateProfile', newProfile, this.state.theme, isPro, (err, response) => {
		if (err) {
		  toast.error(err.message)
		} else {
		  toast.success('Profile successfully updated.')
		  this.resetProfile()
		}
	  })
	}
  }

  resetProfile () {
	this.setState({
	  newPassword: null,
	  editing: false,
	  changingPassword: false,
	  pro: Meteor.isPro
	})
  }

  render () {
	const name = Meteor.user().profile.name
	const zip = Meteor.user().profile.zip || 'N/A'
	const email = Meteor.user().emails[0].address

	return (
			<div className="Account">
			  <h4 className="acct-title page-title-ming">Account</h4>

			  {!this.state.changingPassword &&
			  <React.Fragment>
				<p className={this.state.editing ? 'modern-input' : ''}>
				  <label>e-mail</label>
				  {this.state.editing ? <input type="email"
											   placeholder="E-mail"
											   defaultValue={email}
											   onChange={(e) => this.setState({email: e.target.value})}/> : email}
				</p>

				<p className={this.state.editing ? 'modern-input' : ''}>
				  <label>name</label>
				  {this.state.editing ? <input type="text"
											   placeholder="Name"
											   defaultValue={name}
											   onChange={(e) => this.setState({name: e.target.value})}/> : name}
				</p>

				<p className={this.state.editing ? 'modern-input' : ''}>
				  <label>zip / postal code</label>
				  {this.state.editing ? <input type="text"
											   placeholder="Zip / Postal Code"
											   defaultValue={zip}
											   onChange={(e) => this.setState({zip: e.target.value})}/> : zip}
				</p>

				<p className={this.state.editing ? 'modern-input' : ''}>
				  <label>theme</label>
				  {this.state.editing ? <select placeholder="Category"
												onChange={(e) => this.setState({theme: e.target.value})}
												value={this.state.theme}>
					<option value="light">Light Theme</option>
					<option value="dark">Dark Theme</option>
				  </select> : this.state.theme}
				</p>

				{/*TODO remove for prod, just for testing*/}
				{!this.state.editing &&
				<p>
				  <label>Verified?</label>
				  {this.state.verified ? 'Yes' : 'No'}
				</p>
				}


				{/*TODO remove for prod, just for testing*/}
				<p className="pro-checkbox">
				  <label>pro?</label>
				  {this.state.editing ? <input type="checkbox"
											   placeholder="pro"
											   className="small-checkbox"
											   checked={this.state.pro}
											   onChange={(e) => this.setState({pro: !this.state.pro})}/> : this.state.pro ? 'Yes' : 'No'}
				</p>
			  </React.Fragment>
			  }

			  {this.state.changingPassword &&
			  <form>
				<p className={this.state.changingPassword ? 'modern-input' : ''}>
				  <label>current password</label>
				  <input type="password"
						 placeholder="Password"
						 onChange={(e) => this.setState({currentPassword: e.target.value})}/>
				</p>

				<p className={this.state.changingPassword ? 'modern-input' : ''}>
				  <label>new password</label>
				  <input type="password"
						 placeholder="Password"
						 onChange={(e) => this.setState({newPassword: e.target.value})}/>
				</p>

				<p className={this.state.changingPassword ? 'modern-input' : ''}>
				  <label>confirm new password</label>
				  <input type="password"
						 placeholder="Password"
						 onChange={(e) => this.setState({confirmNewPassword: e.target.value})}/>
				</p>
			  </form>
			  }

			  <div className="buttons-footer">
				{!this.state.changingPassword &&
				<button onClick={() => this.state.editing ? this.saveProfile() : this.setState({ editing: true, changingPassword: false })}
						className="flat">
				  {this.state.editing ? 'Save Profile' : 'Edit Profile'}
				</button>
				}


				{!this.state.editing &&
				<button onClick={() => this.state.changingPassword ? this.changePassword() : this.setState({ editing: false, changingPassword: true })}
						className="flat">
				  {this.state.changingPassword ? 'Save Password' : 'New Password'}
				</button>
				}

				{(this.state.editing || this.state.changingPassword) &&
				<button onClick={this.resetProfile}
						className="btn-danger">
				  Cancel
				</button>
				}
			  </div>

			</div>
	)
  }
}

export default Account
