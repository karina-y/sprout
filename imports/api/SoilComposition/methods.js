import SoilComposition from './SoilComposition'
import rateLimit from '../../modules/rate-limit'
import logger from '/imports/utils/helpers/logger'
import SimpleSchema from 'simpl-schema'
import handleMethodException from '/imports/utils/helpers/handle-method-exception'

Meteor.methods({
  'soilComposition.insert': function soilCompositionInsert (plantId, data) {

	try {
	  data.createdAt = new Date()
	  data.updatedAt = new Date()
	  data.plantId = plantId

	  const validationContext = new SimpleSchema(SoilComposition.schema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', JSON.stringify(validationContext.validationErrors()))
		handleMethodException('Invalid arguments passed')
	  } else {
		const response = SoilComposition.insert(data)
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)

	}
  },
  'soilComposition.update': function soilCompositionUpdate (type, data) {
	logger('info', 'type', type)
	logger('info', 'data', data)

	try {
	  // data.updatedAt = new Date();
	  const plant = SoilComposition.findOne({_id: data._id})
	  delete data._id
	  data.updatedAt = new Date()
	  let validationSchema
	  let query

	  switch (type) {
		case 'soilCompositionTracker-edit':
		  //entry for both pruning and deadheading
		  validationSchema = plant.category === 'in-ground' ? SoilComposition.schema.pick('soilAmendment', 'soilType', 'tilled', 'updatedAt') : SoilComposition.schema.pick('soilRecipe', 'updatedAt');
		  query = plant.category === 'in-ground' ? {$set: {soilAmendment: data.soilAmendment, soilType: data.soilType, tilled: data.tilled, updatedAt: data.updatedAt}} : {$set: {soilRecipe: data.soilRecipe, updatedAt: data.updatedAt}}
		  break
		default:
		  validationSchema = SoilComposition.schema.pick(type, 'updatedAt')
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
		const response = SoilComposition.update({_id: plant._id}, query)
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)
	}
  },
  'soilComposition.delete': function soilCompositionDelete (data) {
	try {

	  if (typeof data !== 'string' || !data) {
		logger('danger', 'Invalid arguments passed')
		handleMethodException('Invalid arguments passed')
		// throw new Meteor.Error('500', 'Invalid arguments passed')
	  } else {
		const response = SoilComposition.remove({_id: data})
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)

	}

  }
})

rateLimit({
  methods: [
	'soilComposition.insert',
	'soilComposition.update',
	'soilComposition.delete',
  ],
  limit: 5,
  timeRange: 1000,
})

