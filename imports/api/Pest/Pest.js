//sample schema

import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Pest = new Mongo.Collection('Pest')

Pest.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
})

Pest.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Pest.schema = new SimpleSchema({
		  plantId: {
			type: String,
			defaultValue: 'admin',
			label: 'userId'
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

Pest.attachSchema(Pest.schema)

export default Pest
