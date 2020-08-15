import Plant from './Plant'
import rateLimit from '../../modules/rate-limit'
import logger from '/imports/utils/helpers/logger'
import SimpleSchema from 'simpl-schema'
import handleMethodException from '/imports/utils/helpers/handle-method-exception'
import Seedling from '../Seedling/Seedling'

Meteor.methods({
  'plant.insert': function plantInsert (data) {

	try {
	  data.createdAt = new Date()
	  data.updatedAt = new Date()
	  data.userId = Meteor.userId()

	  const validationContext = new SimpleSchema(Plant.schema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', JSON.stringify(validationContext.validationErrors()))
		handleMethodException('Invalid arguments passed')
	  } else {
		const response = Plant.insert(data)
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)
	  // throw new Meteor.Error('500', 'Please check your inputs and try again.')

	}
  },
  'plant.update': function plantUpdate (type, data) {
	logger('info', 'type', type)
	logger('info', 'data', data)

	try {
	  // data.updatedAt = new Date();
	  const plant = Plant.findOne({_id: data._id})
	  delete data._id
	  data.updatedAt = new Date()
	  let validationSchema
	  let query

	  switch (type) {
		case 'waterTracker-edit':
		  validationSchema = Plant.schema.pick('waterPreference', 'lightPreference', 'waterSchedule', 'waterScheduleAuto', 'updatedAt')

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
		  validationSchema = Seedling.schema.pick('fertilizerSchedule', 'compost', 'fertilizer', 'nutrient', 'updatedAt')

		  query = {
			$set: {
			  fertilizerSchedule: data.fertilizerSchedule,
			  compost: data.compost,
			  fertilizer: data.fertilizer,
			  nutrient: data.nutrient,
			  updatedAt: data.updatedAt
			}
		  }
		  break
		case 'pruningDeadheadingTracker-edit':
		  // validationSchema = Plant.schema.pick('pruningSchedule', 'deadheadingSchedule', 'updatedAt')
		  // query = {$set: {pruningSchedule: data.pruningSchedule, deadheadingSchedule: data.deadheadingSchedule, updatedAt: data.updatedAt}}

		  validationSchema = Plant.schema.pick('pruningPreference', 'deadheadingPreference', 'updatedAt')

		  query = {$set: {pruningPreference: data.pruningPreference, deadheadingPreference: data.deadheadingPreference, updatedAt: data.updatedAt}}
		  break
		case 'etc-edit':
		  validationSchema = Plant.schema.pick('commonName', 'latinName', 'location', 'dateBought', 'datePlanted', 'locationBought', 'toxicity', 'category', 'companions', 'updatedAt')

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
		  validationSchema = Plant.schema.pick('pruningTracker', 'deadheadingTracker', 'updatedAt');
		  query = {$set: {updatedAt: data.updatedAt}, $push: {pruningTracker: data.pruningTracker, deadheadingTracker: data.deadheadingTracker}}

		  data.pruningTracker = [data.pruningTracker]
		  data.deadheadingTracker = [data.deadheadingTracker]
		  break
		case 'soilCompositionTracker-edit':
		  //entry for both pruning and deadheading
		  validationSchema = plant.category === 'in-ground' ? Plant.schema.pick('soilAmendment', 'soilType', 'tilled', 'updatedAt') : Plant.schema.pick('soilRecipe', 'updatedAt');
		  query = plant.category === 'in-ground' ? {$set: {soilAmendment: data.soilAmendment, soilType: data.soilType, tilled: data.tilled, updatedAt: data.updatedAt}} : {$set: {soilRecipe: data.soilRecipe, updatedAt: data.updatedAt}}
		  break
		default:
		  validationSchema = Plant.schema.pick(type, 'updatedAt')
		  query = {$set: {updatedAt: data.updatedAt}, $push: {[type]: data[type]}}
		  data[type] = [data[type]]
	  }

	  const validationContext = new SimpleSchema(validationSchema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', JSON.stringify(validationContext.validationErrors()))
		handleMethodException(`'Validation failed', ${JSON.stringify(validationContext.validationErrors())}`)
		// throw new Meteor.Error('500')
	  } else {
		logger('success', 'passed', data)
		const response = Plant.update({_id: plant._id}, query)
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)
	  // throw new Meteor.Error('500', 'Please check your inputs and try again.')
	}
  },
  'plant.delete': function plantDelete (data) {
	try {

	  if (typeof data !== 'string' || !data) {
		logger('danger', 'Invalid arguments passed')
		handleMethodException('Invalid arguments passed')
		// throw new Meteor.Error('500', 'Invalid arguments passed')
	  } else {
		const response = Plant.remove({_id: data})
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
	'plant.insert',
	'plant.update',
	'plant.delete',
  ],
  limit: 5,
  timeRange: 1000,
})

