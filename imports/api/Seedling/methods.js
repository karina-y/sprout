import Seedling from './Seedling'
import rateLimit from '../../modules/rate-limit'
import logger from '/imports/utils/logger'
import SimpleSchema from 'simpl-schema'
import handleMethodException from '/imports/utils/handle-method-exception'

Meteor.methods({
  'seedling.insert': function seedlingInsert (data) {

	try {
	  data.createdAt = new Date()
	  data.updatedAt = new Date()
	  data.userId = Meteor.userId()

	  const validationContext = new SimpleSchema(Seedling.schema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', validationContext.validationErrors())
		handleMethodException('Invalid arguments passed')
	  } else {
		const response = Seedling.insert(data)
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)
	  // throw new Meteor.Error('500', 'Please check your inputs and try again.')

	}
  },
  'seedling.update': function seedlingUpdate (type, data) {
	logger('info', 'type', type)
	logger('info', 'data', data)

	try {
	  // data.updatedAt = new Date();
	  const seedling = Seedling.findOne({_id: data._id})
	  delete data._id
	  data.updatedAt = new Date()
	  let validationSchema
	  let query

	  switch (type) {
		case 'waterTracker-edit':
		  validationSchema = Seedling.schema.pick('waterPreference', 'lightPreference', 'waterSchedule', 'waterScheduleAuto', 'updatedAt')

		  query = {
			$set: {
			  waterPreference: data.waterPreference,
			  lightPreference: data.lightPreference,
			  waterSchedule: data.waterSchedule,
			  waterScheduleAuto: data.waterScheduleAuto,
			  updatedAt: data.updatedAt
			}
		  }
		  break
		case 'fertilizerTracker-edit':
		  validationSchema = Seedling.schema.pick('fertilizerSchedule', 'updatedAt')

		  query = {$set: {fertilizerSchedule: data.fertilizerSchedule, updatedAt: data.updatedAt}}
		  break
		case 'pruningDeadheadingTracker-edit':
		  validationSchema = Seedling.schema.pick('pruningSchedule', 'deadheadingSchedule', 'updatedAt')

		  query = {$set: {pruningSchedule: data.pruningSchedule, deadheadingSchedule: data.deadheadingSchedule, updatedAt: data.updatedAt}}
		  break
		case 'etc-edit':
		  validationSchema = Seedling.schema.pick('commonName', 'latinName', 'location', 'dateBought', 'dateSeedlinged', 'locationBought', 'toxicity', 'category', 'companions', 'updatedAt')

		  query = {
			$set: {
			  commonName: data.commonName,
			  latinName: data.latinName,
			  toxicity: data.toxicity,
			  category: data.category,
			  location: data.location,
			  locationBought: data.locationBought,
			  dateBought: data.dateBought,
			  dateSeedlinged: data.dateSeedlinged,
			  companions: data.companions,
			  updatedAt: data.updatedAt
			}
		  }

		  break
		case 'pruningDeadheadingTracker':
		  //entry for both pruning and deadheading
		  validationSchema = Seedling.schema.pick('pruningTracker', 'deadheadingTracker', 'updatedAt');
		  query = {$set: {updatedAt: data.updatedAt}, $push: {pruningTracker: data.pruningTracker, deadheadingTracker: data.deadheadingTracker}}

		  data.pruningTracker = [data.pruningTracker]
		  data.deadheadingTracker = [data.deadheadingTracker]
		  break
		case 'soilCompositionTracker-edit':
		  //entry for both pruning and deadheading
		  validationSchema = seedling.category === 'in-ground' ? Seedling.schema.pick('soilAmendment', 'soilType', 'tilled', 'updatedAt') : Seedling.schema.pick('soilRecipe', 'updatedAt');
		  query = seedling.category === 'in-ground' ? {$set: {soilAmendment: data.soilAmendment, soilType: data.soilType, tilled: data.tilled, updatedAt: data.updatedAt}} : {$set: {soilRecipe: data.soilRecipe, updatedAt: data.updatedAt}}
		  break
		default:
		  validationSchema = Seedling.schema.pick(type, 'updatedAt')
		  query = {$set: {updatedAt: data.updatedAt}, $push: {[type]: data[type]}}
		  data[type] = [data[type]]
	  }

	  const validationContext = new SimpleSchema(validationSchema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', validationContext.validationErrors())
		handleMethodException(`'Validation failed', ${validationContext.validationErrors()}`)
		// throw new Meteor.Error('500')
	  } else {
		logger('success', 'passed', data)
		const response = Seedling.update({_id: seedling._id}, query)
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)
	  // throw new Meteor.Error('500', 'Please check your inputs and try again.')
	}
  },
  'seedling.delete': function seedlingDelete (data) {
	try {

	  if (typeof data !== 'string' || !data) {
		logger('danger', 'Invalid arguments passed')
		handleMethodException('Invalid arguments passed')
		// throw new Meteor.Error('500', 'Invalid arguments passed')
	  } else {
		const response = Seedling.remove({_id: data})
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)
	  // throw new Meteor.Error('500', 'Please check your inputs and try again.')

	}

  }
})

rateLimit({
  methods: [
	'seedling.insert',
	'seedling.update',
	'seedling.delete',
  ],
  limit: 5,
  timeRange: 1000,
})

