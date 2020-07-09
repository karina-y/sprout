import Profile from './Profile'
import rateLimit from '../../modules/rate-limit'
import logger from '/imports/utils/logger'
import SimpleSchema from 'simpl-schema'

Meteor.methods({
  'profile.insert': function profileInsert (data) {

	try {
	  data.createdAt = new Date()
	  data.updatedAt = new Date()
	  data.userId = Meteor.userId()

	  const validationContext = new SimpleSchema(Profile.schema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', validationContext.validationErrors())
		throw new Meteor.Error('500', 'Invalid arguments passed')
	  } else {
		const response = Profile.insert(data)
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  throw new Meteor.Error('500', 'Please check your inputs and try again.')

	}
  },
  'profile.update': function profileUpdate (type, data) {
	logger('info', 'type', type)
	logger('info', 'data', data)

	try {
	  // data.updatedAt = new Date();
	  const profile = Profile.findOne({_id: data._id})
	  delete data._id
	  data.updatedAt = new Date()
	  let validationSchema
	  let query

	  switch (type) {
		case 'waterTracker-edit':
		  validationSchema = Profile.schema.pick('waterPreference', 'lightPreference', 'waterSchedule', 'updatedAt')

		  query = {
			$set: {
			  waterPreference: data.waterPreference,
			  lightPreference: data.lightPreference,
			  waterSchedule: data.waterSchedule,
			  updatedAt: data.updatedAt
			}
		  }
		  break
		case 'fertilizerTracker-edit':
		  validationSchema = Profile.schema.pick('fertilizerSchedule', 'updatedAt')

		  query = {$set: {fertilizerSchedule: data.fertilizerSchedule, updatedAt: data.updatedAt}}
		  break
		case 'pruningDeadheadingTracker-edit':
		  validationSchema = Profile.schema.pick('pruningSchedule', 'deadheadingSchedule', 'updatedAt')

		  query = {$set: {pruningSchedule: data.pruningSchedule, deadheadingSchedule: data.deadheadingSchedule, updatedAt: data.updatedAt}}
		  break
		case 'etc-edit':
		  validationSchema = Profile.schema.pick('commonName', 'latinName', 'location', 'dateBought', 'datePlanted', 'locationBought', 'toxicity', 'category', 'companions', 'updatedAt')

		  query = {
			$set: {
			  commonName: data.commonName,
			  latinName: data.latinName,
			  toxicity: data.toxicity,
			  category: data.category,
			  location: data.location,
			  locationBought: data.locationBought,
			  dateBought: data.dateBought,
			  datePlanted: data.datePlanted,
			  companions: data.companions,
			  updatedAt: data.updatedAt
			}
		  }

		  break
		case 'pruningDeadheadingTracker':
		  //entry for both pruning and deadheading
		  validationSchema = Profile.schema.pick('pruningTracker', 'deadheadingTracker', 'updatedAt');
		  query = {$set: {updatedAt: data.updatedAt}, $push: {pruningTracker: data.pruningTracker, deadheadingTracker: data.deadheadingTracker}}

		  data.pruningTracker = [data.pruningTracker]
		  data.deadheadingTracker = [data.deadheadingTracker]
		  break
		case 'soilCompositionTracker-edit':
		  //entry for both pruning and deadheading
		  validationSchema = profile.category === 'in-ground' ? Profile.schema.pick('soilAmendment', 'soilType', 'tilled', 'updatedAt') : Profile.schema.pick('soilRecipe', 'updatedAt');
		  query = profile.category === 'in-ground' ? {$set: {soilAmendment: data.soilAmendment, soilType: data.soilType, tilled: data.tilled, updatedAt: data.updatedAt}} : {$set: {soilRecipe: data.soilRecipe, updatedAt: data.updatedAt}}
		  break
		default:
		  validationSchema = Profile.schema.pick(type, 'updatedAt')
		  query = {$set: {updatedAt: data.updatedAt}, $push: {[type]: data[type]}}
		  data[type] = [data[type]]
	  }

	  const validationContext = new SimpleSchema(validationSchema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', validationContext.validationErrors())
		throw new Meteor.Error('500')
	  } else {
		logger('success', 'passed', data)
		const response = Profile.update({_id: profile._id}, query)
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  throw new Meteor.Error('500', 'Please check your inputs and try again.')
	}
  },
  'profile.delete': function profileDelete (data) {
	try {

	  if (typeof data !== 'string') {
		logger('danger', 'Validation failed')
		throw new Meteor.Error('500', 'Invalid arguments passed')
	  } else {
		const response = Profile.remove({_id: data})
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  throw new Meteor.Error('500', 'Please check your inputs and try again.')

	}

  }
})

rateLimit({
  methods: [
	'profile.insert',
	'profile.update',
	'profile.delete',
  ],
  limit: 5,
  timeRange: 1000,
})

