import rateLimit from '../../modules/rate-limit';
import logger from '/imports/utils/logger';
import SimpleSchema from 'simpl-schema';
import handleMethodException from '/imports/utils/handle-method-exception';

Meteor.methods({
  'preferences.insert': function preferencesInsert(data) {

	try {
	  data.createdAt = new Date();
	  data.updatedAt = new Date();

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
		  autoValue() {
			if (this.isInsert) return (new Date());
		  },
		  label: 'createdAt'
		},
		updatedAt: {
		  type: Date,
		  autoValue() {
			if (this.isInsert || this.isUpdate) return (new Date());
		  },
		  label: 'updatedAt'
		}
	  });

	  const validationContext = new SimpleSchema(validationSchema).newContext();
	  validationContext.validate(data);

	  if (!validationContext.isValid()){
		logger('danger', "Validation failed", validationContext.validationErrors());
		throw new Meteor.Error('500', "Invalid arguments passed");
	  } else {
		const response = Preferences.createUser(data);
		return response;
	  }
	} catch(e) {
	  logger('danger', e.message);
	  handleMethodException("Please check your inputs and try again.")
	}
  },
  'preferences.updatePassword': function preferencesUpdatePassword(password, newPassword) {

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
	  });

	  const validationContext = new SimpleSchema(validationSchema).newContext();
	  validationContext.validate(data);

	  if (!validationContext.isValid()){
		logger('danger', "Validation failed", validationContext.validationErrors());
		throw new Meteor.Error('500', "Invalid arguments passed");
	  } else {

		Preferences.changePassword(data.password, data.newPassword, (err) => {
		  if (err) {
		    logger('danger', "err in preferences.updatePassword - ", err.message)
			handleMethodException(err)
		  }
		})

	  }
	} catch(e) {
	  logger('danger', e.message);
	  handleMethodException("Please check your inputs and try again.")
	}
  },
  'preferences.updateProfile': function preferencesUpdateProfile(newProfile, isPro) {

	try {

	  //TODO only update data programmatically, some of these methods may be unnecessary
	  const validationSchema = new SimpleSchema({
		email: {
		  type: String,
		  label: 'email'
		},
		name: {
		  type: String,
		  label: 'name'
		},
		zip: {
		  type: String,
		  optional: true,
		  label: 'zip'
		},
	  });

	  const validationContext = new SimpleSchema(validationSchema).newContext();
	  validationContext.validate(newProfile);

	  if (!validationContext.isValid()){
		logger('danger', "Validation failed", validationContext.validationErrors());
		handleMethodException("Invalid arguments passed");
	  } else {
		const userId = Meteor.userId();

		//first remove old email
		Preferences.removeEmail(userId, Meteor.user().emails[0].address)

		//then add new one
		Preferences.addEmail(userId, newProfile.email, false)

		//then new username
		// Preferences.setUsername(userId, newProfile.name)
		Meteor.users.update({_id: userId}, {$set:{'profile.name': newProfile.name, 'profile.zip': newProfile.zip}})

		if (Meteor.isPro !== isPro) {
		  if (isPro) {
		    Roles.addUsersToRoles(userId, 'pro')
		  } else {
		    Roles.removeUsersFromRoles(userId, 'pro')
		  }
		}

	  //TODO once email is integrated, first ask them to confirm their new email, once confirmed delete the old one

		// return response;
	  }
	} catch(e) {
	  logger('danger', e.message);
	  handleMethodException("Please check your inputs and try again.")
	}
  }
});


rateLimit({
  methods: [
	'preferences.insert',
	'preferences.updatePassword'
  ],
  limit: 5,
  timeRange: 1000,
});
