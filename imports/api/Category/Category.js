//sample schema

import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
const Category = new Mongo.Collection('Category')

Category.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
})

Category.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Category.schema = new SimpleSchema({
		  category: {
			type: String,
			defaultValue: '',
			label: 'category'
		  },
		  displayName: {
			type: String,
			defaultValue: '',
			label: 'displayName'
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

Category.attachSchema(Category.schema)

export default Category
