//sample schema

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
// import ProfileEnums from '../../utils/enums';

// const profileEnums = ProfileEnums.ITEM_ENUM;
const Profile = new Mongo.Collection('Profile');

Profile.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Profile.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});


Profile.schema = new SimpleSchema({
		  commonName: {
			type: String,
			defaultValue: '',
			label: 'commonName'
		  },
		  latinName: {
			type: String,
			defaultValue: '',
			label: 'latinName'
		  },
		  location: {
			type: String,
			defaultValue: '',
			label: 'location'
		  },
		  dateBought: {
			type: Date,
			label: 'dateBought'
		  },
		  locationBought: {
			type: String,
			defaultValue: '',
			label: 'locationBought'
		  },
		  companions: {
			type: Array,
			optional: true,
			label: 'companions'
		  },
		  'companions.$': {
			type: String,
			label: 'companions.$'
		  },
		  notes: {
			type: String,
			optional: true,
			label: 'notes'
		  },
		  image: {
			type: String,
			defaultValue: '',
			label: 'image'
		  },
		  fertilizerSchedule: {
			type: Number,
			defaultValue: '',
			label: 'fertilizerSchedule'
		  },
		  waterSchedule: {
			type: Number,
			defaultValue: '',
			label: 'waterSchedule'
		  },
		  waterPreference: {
			type: String,
			defaultValue: '',
			label: 'waterPreference'
		  },
		  lightPreference: {
			type: String,
			defaultValue: '',
			label: 'lightPreference'
		  },
		  fertilizerTracker: {
			type: Array,
			optional: true,
			label: 'fertilizerTracker'
		  },
		  'fertilizerTracker.$': {
			type: Object,
			label: 'fertilizerTracker.$'
		  },
		  'fertilizerTracker.$.date': {
			type: Date,
			label: 'fertilizerTracker.$.date'
		  },
		  'fertilizerTracker.$.fertilizer': {
			type: String,
			defaultValue: '',
			label: 'fertilizerTracker.$.fertilizer'
		  },
		  waterTracker: {
			type: Array,
			optional: true,
			label: 'waterTracker'
		  },
		  'waterTracker.$': {
			type: Object,
			label: 'waterTracker.$'
		  },
		  'waterTracker.$.date': {
			type: Date,
			label: 'waterTracker.$.date'
		  },
		  pestTracker: {
			type: Array,
			optional: true,
			label: 'pestTracker'
		  },
		  'pestTracker.$': {
			type: Object,
			label: 'pestTracker.$'
		  },
		  'pestTracker.$.date': {
			type: Date,
			label: 'pestTracker.$.date'
		  },
		  'pestTracker.$.pest': {
			type: String,
			optional: true,
			label: 'pestTracker.$.pest'
		  },
		  'pestTracker.$.treatment': {
			type: String,
			optional: true,
			label: 'pestTracker.$.treatment'
		  },
		  soilCompositionTracker: {
			type: Array,
			optional: true,
			label: 'soilCompositionTracker'
		  },
		  'soilCompositionTracker.$': {
			type: Object,
			label: 'soilCompositionTracker.$'
		  },
		  'soilCompositionTracker.$.date': {
			type: Date,
			defaultValue: new Date(),
			optional: true,
			label: 'soilCompositionTracker.$.date'
		  },
		  'soilCompositionTracker.$.ph': {
			type: Number,
			optional: true,
			label: 'soilCompositionTracker.$.ph'
		  },
		  'soilCompositionTracker.$.moisture': {
			type: Number,
			optional: true,
			label: 'soilCompositionTracker.$.moisture'
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
		},
		{
		  clean: {
			filter: true,
			autoConvert: true,
			removeEmptyStrings: true,
			trimStrings: true,
			getAutoValues: true,
			removeNullsFromArrays: true,
		  }
		});

Profile.attachSchema(Profile.schema);

export default Profile;
