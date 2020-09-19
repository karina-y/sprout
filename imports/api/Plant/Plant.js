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
		  image: {
			type: String,
			defaultValue: '',
			label: 'image'
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
