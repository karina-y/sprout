import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import rateLimit from '../../modules/rate-limit';
import logger from '/imports/utils/logger';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
  'account.insert': function accountInsert(data) {

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
		const response = Accounts.createUser(data);
		return response;
	  }
	} catch(e) {
	  logger('danger', e.message);
	  throw new Meteor.Error('500', "Please check your inputs and try again.");
	}
  }
});


rateLimit({
  methods: [
	'account.insert'
  ],
  limit: 5,
  timeRange: 1000,
});
