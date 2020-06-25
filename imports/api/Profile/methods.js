import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Profile from './Profile';
import rateLimit from '../../modules/rate-limit';
import logger from '/imports/utils/logger';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
  'profile.insert': function profileInsert(data) {

	try {
	  data.createdAt = new Date();
	  data.updatedAt = new Date();
	  data.userId = Meteor.userId()

	  const validationContext = new SimpleSchema(Profile.schema).newContext();
	  validationContext.validate(data);

	  if (!validationContext.isValid()){
		logger('danger', "Validation failed", validationContext.validationErrors());
		throw new Meteor.Error('500', "Invalid arguments passed");
	  } else {
		const response = Profile.insert(data);
		return response;
	  }
	} catch(e) {
	  logger('danger', e.message);
	  throw new Meteor.Error('500', "Please check your inputs and try again.");

	}
  },
  'profile.update': function profileUpdate(type, data) {
	logger('info', "type", type);
	logger('info', "data", data);

	try {
	  // data.updatedAt = new Date();
	  const profile = Profile.findOne({_id: data._id});
	  delete data._id;
	  data.updatedAt = new Date();
	  let validationSchema;
	  let query;

	  switch(type) {
		case "water":
		  validationSchema = new SimpleSchema({
			waterTracker: {
			  type: Object
			},
			'waterTracker.date': {
			  type: Date
			},
			updatedAt: {
			  type: Date
			}
		  });

		  query = {$set: {updatedAt: data.updatedAt}, $push: {waterTracker: data.waterTracker}}
		  break;
		case "water-edit":
		  validationSchema = new SimpleSchema({
			waterPreference: {
			  type: String
			},
			lightPreference: {
			  type: String
			},
			waterSchedule: {
			  type: Number
			},
			updatedAt: {
			  type: Date
			}
		  });

		  query = {$set: {waterPreference: data.waterPreference, lightPreference: data.lightPreference, waterSchedule: data.waterSchedule, updatedAt: data.updatedAt}}
		  break;
		case "fertilizer":
		  validationSchema = new SimpleSchema({
			fertilizerTracker: {
			  type: Object
			},
			'fertilizerTracker.date': {
			  type: Date
			},
			'fertilizerTracker.fertilizer': {
			  type: String
			},
			updatedAt: {
			  type: Date
			}
		  });

		  query = {$set: {updatedAt: data.updatedAt}, $push: {fertilizerTracker: data.fertilizerTracker}}
		  break;
		case "fertilizer-edit":
		  validationSchema = new SimpleSchema({
			fertilizerSchedule: {
			  type: Number
			},
			updatedAt: {
			  type: Date
			}
		  });

		  query = {$set: {fertilizerSchedule: data.fertilizerSchedule, updatedAt: data.updatedAt}}
		  break;
		case "soil composition":
		  validationSchema = new SimpleSchema({
			soilCompositionTracker: {
			  type: Object
			},
			'soilCompositionTracker.date': {
			  type: Date,
			  defaultValue: new Date(),
			  optional: true
			},
			'soilCompositionTracker.ph': {
			  type: Number
			},
			'soilCompositionTracker.moisture': {
			  type: Number
			},
			updatedAt: {
			  type: Date,
			  defaultValue: new Date(),
			  optional: true
			}
		  });

		  query = {$set: {updatedAt: data.updatedAt}, $push: {soilCompositionTracker: data.soilCompositionTracker}}
		  break;
		case "pest":
		  validationSchema = new SimpleSchema({
			pestTracker: {
			  type: Object,
			  optional: true,
			  label: 'pestTracker'
			},
			'pestTracker.date': {
			  type: Date,
			  label: 'pestTracker.date'
			},
			'pestTracker.pest': {
			  type: String,
			  optional: true,
			  label: 'pestTracker.pest'
			},
			'pestTracker.treatment': {
			  type: String,
			  optional: true,
			  label: 'pestTracker.treatment'
			},
			updatedAt: {
			  type: Date,
			  defaultValue: new Date(),
			  optional: true
			}
		  });

		  query = {$set: {updatedAt: data.updatedAt}, $push: {pestTracker: data.pestTracker}}
		  break;
		case "diary":
		  validationSchema = new SimpleSchema({
			diary: {
			  type: Object
			},
			'diary.entry': {
			  type: String
			},
			'diary.date': {
			  type: Date,
			  defaultValue: new Date(),
			  optional: true
			},
			updatedAt: {
			  type: Date
			}
		  })

		  query = {$set: {updatedAt: data.updatedAt}, $push: {diary: data.diary}};
		  break;
		case "etc-edit":
		  validationSchema = new SimpleSchema({
			location: {
			  type: String,
			  label: 'location'
			},
			dateBought: {
			  type: Date,
			  label: 'dateBought'
			},
			locationBought: {
			  type: String,
			  label: 'locationBought'
			},
			companions: {
			  type: Array,
			  label: 'companions'
			},
			'companions.$': {
			  type: String,
			  label: 'companions.$'
			},
			updatedAt: {
			  type: Date
			}
		  })

		  query = {$set: {location: data.location, dateBought: data.dateBought, locationBought: data.locationBought, companions: data.companions, updatedAt: data.updatedAt}};
		  break;
	  }

	  const validationContext = new SimpleSchema(validationSchema).newContext();
	  validationContext.validate(data);

	  if (!validationContext.isValid()){
		logger('danger', "Validation failed", validationContext.validationErrors());
		throw new Meteor.Error('500');
	  } else {
		logger('success', "passed", data)
		const response = Profile.update({_id: profile._id}, query);
		return response;
	  }
	} catch(e) {
	  logger('danger', e.message);
	  throw new Meteor.Error('500', "Please check your inputs and try again.");
	}
  },
  'profile.delete': function profileDelete(data) {
	try {

	  if (typeof data !== "string"){
		logger('danger', "Validation failed");
		throw new Meteor.Error('500', "Invalid arguments passed");
	  } else {
		const response = Profile.remove({_id: data});
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
	'profile.insert',
	'profile.update',
	'profile.delete'
  ],
  limit: 5,
  timeRange: 1000,
});
