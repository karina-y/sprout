//sample schema

import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Seedling = new Mongo.Collection('Seedling')

Seedling.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
})

Seedling.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Seedling.schema = new SimpleSchema({
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
		  seedBrand: {
			type: String,
			defaultValue: '',
			label: 'seedBrand'
		  },
		  locationBought: {
			type: String,
			defaultValue: '',
			label: 'locationBought'
		  },
		  dateBought: {
			type: Date,
			defaultValue: '',
			label: 'dateBought'
		  },
		  dateExpires: {
			type: Date,
			defaultValue: '',
			label: 'dateExpires'
		  },
		  method: {
			type: String,
			defaultValue: '',
			label: 'method'
		  },
		  //TODO isoneof "indoor" "outdoor"
		  startedIndoorOutdoor: {
			type: String,
			defaultValue: '',
			label: 'startedIndoorOutdoor'
		  },

		  startDate: {
			type: Date,
			optional: true,
			label: 'startDate'
		  },
		  sproutDate: {
			type: Date,
			optional: true,
			label: 'sproutDate'
		  },
		  trueLeavesDate: {
			type: Date,
			optional: true,
			label: 'trueLeavesDate'
		  },
		  daysToGerminate: {
			type: Number,
			optional: true,
			label: 'daysToGerminate'
		  },
		  transplantDate: {
			type: Date,
			optional: true,
			label: 'transplantDate'
		  },
		  daysToHarvest: {
			type: Number,
			optional: true,
			label: 'daysToHarvest'
		  },
		  estHarvestDate: {
			type: Date,
			optional: true,
			label: 'estHarvestDate'
		  },
		  actualHarvestDate: {
			type: Date,
			optional: true,
			label: 'actualHarvestDate'
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
		  fungusTracker: {
			type: Array,
			optional: true,
			label: 'fungusTracker'
		  },
		  'fungusTracker.$': {
			type: Object,
			label: 'fungusTracker.$'
		  },
		  'fungusTracker.$.date': {
			type: Date,
			label: 'fungusTracker.$.date'
		  },
		  'fungusTracker.$.pest': {
			type: String,
			optional: true,
			label: 'fungusTracker.$.pest'
		  },
		  'fungusTracker.$.treatment': {
			type: String,
			optional: true,
			label: 'fungusTracker.$.treatment'
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

Seedling.attachSchema(Seedling.schema)

export default Seedling
