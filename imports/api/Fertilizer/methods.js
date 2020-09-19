import Fertilizer from './Fertilizer'
import rateLimit from '../../modules/rate-limit'
import logger from '/imports/utils/helpers/logger'
import SimpleSchema from 'simpl-schema'
import handleMethodException from '/imports/utils/helpers/handle-method-exception'

Meteor.methods({
  'fertilizer.insert': function fertilizerInsert (plantId, data) {

	try {
	  data.createdAt = new Date()
	  data.updatedAt = new Date()
	  data.plantId = plantId

	  const validationContext = new SimpleSchema(Fertilizer.schema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', JSON.stringify(validationContext.validationErrors()))
		handleMethodException('Invalid arguments passed')
	  } else {
		const response = Fertilizer.insert(data)
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)

	}
  },
  'fertilizer.update': function fertilizerUpdate (type, data) {
	logger('info', 'type', type)
	logger('info', 'data', data)

	try {
	  // data.updatedAt = new Date();
	  const plant = Fertilizer.findOne({_id: data._id})
	  delete data._id
	  data.updatedAt = new Date()

	  const validationSchema = Fertilizer.schema;

	  const query = {
		$set: {
		  fertilizerSchedule: data.fertilizerSchedule,
		  compost: data.compost,
		  fertilizer: data.fertilizer,
		  nutrient: data.nutrient,
		  updatedAt: data.updatedAt
		}
	  }

	  const validationContext = new SimpleSchema(validationSchema).newContext()
	  validationContext.validate(data)

	  if (!validationContext.isValid()) {
		logger('danger', 'Validation failed', JSON.stringify(validationContext.validationErrors()))
		handleMethodException(`'Validation failed', ${JSON.stringify(validationContext.validationErrors())}`)
		// throw new Meteor.Error('500')
	  } else {
		logger('success', 'passed', data)
		const response = Fertilizer.update({_id: plant._id}, query)
		return response
	  }
	} catch (e) {
	  logger('danger', e.message)
	  handleMethodException(e.message)
	}
  },
  'fertilizer.delete': function fertilizerDelete (data) {
	try {

	  if (typeof data !== 'string' || !data) {
		logger('danger', 'Invalid arguments passed')
		handleMethodException('Invalid arguments passed')
		// throw new Meteor.Error('500', 'Invalid arguments passed')
	  } else {
		const response = Fertilizer.remove({_id: data})
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
	'fertilizer.insert',
	'fertilizer.update',
	'fertilizer.delete',
  ],
  limit: 5,
  timeRange: 1000,
})

