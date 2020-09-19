//sample schema

import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Fertilizer = new Mongo.Collection('Fertilizer')

Fertilizer.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
})

Fertilizer.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Fertilizer.schema = new SimpleSchema({
		  plantId: {
			type: String,
			defaultValue: 'admin',
			label: 'userId'
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

Fertilizer.attachSchema(Fertilizer.schema)

export default Fertilizer
