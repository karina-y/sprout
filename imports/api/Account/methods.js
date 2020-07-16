import { Accounts } from 'meteor/accounts-base'
import rateLimit from '../../modules/rate-limit'
import logger from '/imports/utils/logger'
import SimpleSchema from 'simpl-schema'
import handleMethodException from '/imports/utils/handle-method-exception'
import Preferences from '../Preferences/Preferences'
import { Meteor } from 'meteor/meteor'

Meteor.methods({
  'account.insert': function accountInsert (data) {

	try {
	  data.createdAt = new Date()
	  data.updatedAt = new Date()

	  const validationSchema = new SimpleSchema({
		email: {
		  type: String,
		  label: 'email'
		},
		password: {
		  type: String,
		  label: 'password'
		},
		profile: {
		  type: Object,
		  label: 'profile'
		},
		'profile.name': {
		  type: String,
		  label: 'profile.name'
		},
		'profile.zip': {
		  type: String,
		  optional: true,
		  label: 'profile.zip'
		},
		createdAt: {
		  type: Date,
		  autoValue () {
			if (this.isInsert) return (new Date())
		  },
		  label: 'createdAt'
		},
		updatedAt: {
		  type: Date,
		  autoValue () {
			if (this.isInsert || this.isUpdate) return (new Date())
		  },
		  label: 'updatedAt'
		}
	  })

	  const validationContext = new SimpleSchema(validationSchema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', validationContext.validationErrors())
		handleMethodException(`Validation failed, ${validationContext.validationErrors()}`)
		// throw new Meteor.Error('500', 'Invalid arguments passed')
	  } else {
		//create our user
		const response = Accounts.createUser(data)
		Accounts.sendVerificationEmail(response)

		// logger('info', 'acct res', response)

		//create their preferences profile
		Preferences.insert({userId: response, createdAt: data.createdAt, updatedAt: data.updatedAt})

		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)
	  // handleMethodException('Please check your inputs and try again.')
	}
  },
  'account.updatePassword': function accountUpdatePassword (password, newPassword) {

	try {
	  const data = {
		password: password,
		newPassword: newPassword
	  }

	  const validationSchema = new SimpleSchema({
		password: {
		  type: String,
		  label: 'password'
		},
		newPassword: {
		  type: String,
		  label: 'newPassword'
		}
	  })

	  const validationContext = new SimpleSchema(validationSchema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', validationContext.validationErrors())
		handleMethodException(`Validation failed, ${validationContext.validationErrors()}`)
		// throw new Meteor.Error('500', 'Invalid arguments passed')
	  } else {

		Accounts.changePassword(data.password, data.newPassword, (err) => {
		  if (err) {
			logger('danger', 'err in account.updatePassword - ', err.message)
			handleMethodException(err)
		  }
		})

	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)
	  // handleMethodException('Please check your inputs and try again.')
	}
  },
  'account.updateProfile': function accountUpdateProfile (newProfile, theme, isPro) {

    if (!newProfile && JSON.stringify(newProfile) === "{}" && theme == null && isPro == null) {
	  logger('danger', 'No Data entered.')
	  handleMethodException('Please check your inputs and try again.')
	} else {

      if (!newProfile && JSON.stringify(newProfile) === "{}") {
        //just theme and/or pro change
		//TODO clean this up
		if (Meteor.isPro !== isPro) {
		  if (isPro) {
			Roles.addUsersToRoles(userId, 'pro')
		  } else {
			Roles.removeUsersFromRoles(userId, 'pro')
		  }
		}

		//TODO this shouldn't run unless we have a real change
		if (theme) {
		  const pref = {
			theme: theme
		  }

		  Meteor.call('preferences.update', pref)
		}
	  } else {
		try {
		  logger('success', 'data', newProfile)

		  const validationSchema = new SimpleSchema({
			email: {
			  type: String,
			  optional: true,
			  label: 'email'
			},
			name: {
			  type: String,
			  optional: true,
			  label: 'name'
			},
			zip: {
			  type: String,
			  optional: true,
			  label: 'zip'
			},
		  })

		  const validationContext = new SimpleSchema(validationSchema).newContext()
		  validationContext.validate(newProfile)

		  if (!validationContext.isValid()) {
			logger('danger', 'Validation failed', validationContext.validationErrors())
			handleMethodException('Invalid arguments passed')
		  } else {
			const userId = Meteor.userId()
			const oldEmail = Meteor.user().emails[0].address
			const oldName = Meteor.user().profile.name
			const oldZip = Meteor.user().profile.zip

			if (newProfile.email && newProfile.email !== oldEmail) {
			  //first remove old email
			  Accounts.removeEmail(userId, oldEmail)

			  //then add new one
			  Accounts.addEmail(userId, newProfile.email, false)
			}

			if ((newProfile.zip && newProfile.zip !== oldZip) || (newProfile.name && newProfile.name !== oldName)) {
			  let query = {};

			  if (newProfile.name) {
				query['profile.name'] = newProfile.name;
			  }

			  if (newProfile.zip) {
				query['profile.zip'] = newProfile.zip;
			  }

			  Meteor.users.update({_id: userId}, {$set: query})
			}

			if (Meteor.isPro !== isPro) {
			  if (isPro) {
				Roles.addUsersToRoles(userId, 'pro')
			  } else {
				Roles.removeUsersFromRoles(userId, 'pro')
			  }
			}

			if (theme) {
			  const pref = {
				theme: theme
			  }

			  Meteor.call('preferences.update', pref)
			}

			// return response;
		  }
		} catch (e) {
		  logger('danger', e.message)
		  handleMethodException('Please check your inputs and try again.')
		}
	  }

	}

  },
})

rateLimit({
  methods: [
	'account.insert',
	'account.updatePassword'
  ],
  limit: 5,
  timeRange: 1000,
})
