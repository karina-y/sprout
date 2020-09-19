import Plant from './Plant'
import rateLimit from '../../modules/rate-limit'
import logger from '/imports/utils/helpers/logger'
import SimpleSchema from 'simpl-schema'
import handleMethodException from '/imports/utils/helpers/handle-method-exception'

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

