//sample schema

import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Plant = new Mongo.Collection('Plant')

Plant.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
})

Plant.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Plant.schema = new SimpleSchema({
		  userId: {
			type: String,
			defaultValue: 'admin',
			label: 'userId'
		  },
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
		  //TODO isoneof (list categories)
		  category: {
			type: String,
			optional: !Meteor.isPro,
			label: 'category'
		  },
		  datePlanted: {
			type: Date,
			optional: true,
			label: 'datePlanted'
		  },
		  dateBought: {
			type: Date,
			optional: true,
			label: 'dateBought'
		  },
		  location: {
			type: String,
			defaultValue: '',
			label: 'location'
		  },
		  locationBought: {
			type: String,
			optional: true,
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
		  diary: {
			type: Array,
			optional: true,
			label: 'diary'
		  },
		  'diary.$': {
			type: Object,
			label: 'diary.$'
		  },
		  'diary.$.date': {
			type: Date,
			label: 'diary.$.date'
		  },
		  'diary.$.entry': {
			type: String,
			defaultValue: '',
			label: 'diary.$.entry'
		  },
		  image: {
			type: String,
			defaultValue: '',
			label: 'image'
		  },
		  compost: {
			type: String,
			optional: true,
			label: 'compost'
		  },
		  nutrient: {
			type: String,
			optional: true,
			label: 'nutrient'
		  },
		  fertilizer: {
			type: String,
			optional: true,
			label: 'fertilizer'
		  },
		  fertilizerSchedule: {
			type: Number,
			optional: true,
			label: 'fertilizerSchedule'
		  },
		  waterSchedule: {
			type: Number,
			optional: true,
			label: 'waterSchedule'
		  },
		  waterScheduleAuto: {
			type: Boolean,
			defaultValue: false,
			label: 'waterScheduleAuto'
		  },
		  pruningSchedule: {
			type: Number,
			optional: true,
			label: 'pruningSchedule'
		  },
		  deadheadingSchedule: {
			type: Number,
			optional: true,
			label: 'deadheadingSchedule'
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
		  toxicity: {
			type: String,
			optional: true,
			label: 'toxicity'
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
		  pruningTracker: {
			type: Array,
			optional: true,
			label: 'pruningTracker'
		  },
		  'pruningTracker.$': {
			type: Object,
			label: 'pruningTracker.$'
		  },
		  'pruningTracker.$.date': {
			type: Date,
			label: 'pruningTracker.$.date'
		  },
		  deadheadingTracker: {
			type: Array,
			optional: true,
			label: 'deadheadingTracker'
		  },
		  'deadheadingTracker.$': {
			type: Object,
			label: 'deadheadingTracker.$'
		  },
		  'deadheadingTracker.$.date': {
			type: Date,
			label: 'deadheadingTracker.$.date'
		  },
		  tilled: {
			type: Boolean,
			optional: true,
			label: 'tilled'	//soil that's in the ground
		  },
		  soilType: {
			type: String,
			optional: true,
			label: 'soilType'	//soil that's in the ground
		  },
		  soilAmendment: {
			type: String,
			optional: true,
			label: 'soilAmmendment'	//soil used in pots or in ground
		  },
		  soilRecipe: {
			type: String,
			optional: true,
			label: 'soilAmmendment'	//soil used in pots or in ground
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
		})

Plant.attachSchema(Plant.schema)

export default Plant
