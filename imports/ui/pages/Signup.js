import React, { Component } from 'react'
import autobind from 'react-autobind'
import './Login_Signup.scss'
import { Session } from 'meteor/session'
import { toast } from 'react-toastify'

class Signup extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  name: null,
	  email: null,
	  zip: null,
	  password: null,
	}

	autobind(this)
  }

  componentDidMount () {
	Session.set('pageTitle', 'Logout')

	//TODO is there a smarter way to do this?
	if (this.props.history.action === 'REPLACE') {
	  toast.error('You need to be logged in to perform that action.')
	}
  }

  createUser () {
	if (this.state.name && this.state.email && this.state.password) {
	  const data = {
		profile: {
		  name: this.state.name,
		  zip: this.state.zip
		},
		email: this.state.email.toLowerCase(),
		password: this.state.password
	  }

	  Meteor.call('account.insert', data, (err, response) => {
		if (err) {
		  toast.error(err.message)
		} else {
		  //login user
		  const props = this.props

		  Meteor.loginWithPassword(this.state.email.toLowerCase(), this.state.password, function (err) {
			if (err) {
			  //do something if error occurred or
			  toast.error(err.message)
			} else {
			  toast.success(`Welcome ${data.profile.name}! Let's add your first plant.`)
			  props.history.push('/catalogue/add')
			}
		  })
		}
	  })

	} else {
	  toast.error('Please check your inputs and try again.')
	}
  }

  render () {

	return (
			<div className="Login_Signup flex-center">
			  <p className="acct-title title-ming">Sign up</p>

			  <form id="Logout">
				<input type="text"
					   placeholder="Name"
					   onChange={(e) => this.setState({name: e.target.value})}/>

				<input type="email"
					   placeholder="E-mail"
					   onChange={(e) => this.setState({email: e.target.value})}/>


				<input type="text"
					   placeholder="Zip / Postal Code (optional)"
					   onChange={(e) => this.setState({zip: e.target.value})}/>

				<input type="password"
					   placeholder="Password"
					   onChange={(e) => this.setState({password: e.target.value})}/>
			  </form>

			  <div className="buttons-footer flex-center">
				<button onClick={this.createUser}
						className="flat">
				  Sign Up
				</button>
			  </div>
			</div>
	)
  }
}

export default Signup
