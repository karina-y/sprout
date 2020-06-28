import Profile from './Profile'
import rateLimit from '../../modules/rate-limit'
import logger from '/imports/utils/logger'
import SimpleSchema from 'simpl-schema'
import { Promise } from 'meteor/promise'

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
		case 'etc-edit':
		  validationSchema = Profile.schema.pick('location', 'dateBought', 'locationBought', 'companions', 'updatedAt')

		  query = {
			$set: {
			  location: data.location,
			  dateBought: data.dateBought,
			  locationBought: data.locationBought,
			  companions: data.companions,
			  updatedAt: data.updatedAt
			}
		  }
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

  },
  'profile.getByUserId': function profileGetByUserId () {
	try {

	  if (Meteor.userId()) {

		/*const pipeline = [
		  {
			$match: {
			  userId: Meteor.userId()
			}
		  },
		  {$unwind: '$soilCompositionTracker'},
		  {$unwind: '$fertilizerTracker'},
		  {$sort: {'soilCompositionTracker.date': -1, 'fertilizerTracker.date': -1}},
		  {
			$group: {
			  _id: '$_id',
			  soilCompositionTracker: {$push: '$soilCompositionTracker'},
			  fertilizerTracker: {$push: '$fertilizerTracker'}
		  }
	  }
		]*/

		const pipeline = [
		  {
			$match: {
			  userId: Meteor.userId()
			}
		  },
		  {
			$sort: {
			  'waterTracker.date': -1
			}
		  },
		  {
			$sort: {
			  'fertilizerTracker.date': -1
			}
		  },
		  {
			$sort: {
			  'soilCompositionTracker.date': -1,
			}
		  },
		  {
			$sort: {
			  'pestTracker.date': -1
			}
		  },
		  {
			$sort: {
			  'diary.date': -1
			}
		  }
		]

		const data = Promise.await(Profile.rawCollection().aggregate(pipeline).toArray())

		if (data && data.length > 0) {
		  return data
		} else {
		  return []
		}

	  } else {
		return []
	  }
	} catch (e) {
	  logger('danger', e.message)
	  throw new Meteor.Error('500', 'Please check your inputs and try again.')

	}

  },
  'profile.getByProfileId': function profileGetByProfileId (profileId) {
	try {

	  if (Meteor.userId()) {

		const pipeline = [
		  {
			$match: {
			  userId: Meteor.userId()
			}
		  },
		  {$unwind: '$soilCompositionTracker'},
		  {$unwind: '$fertilizerTracker'},
		  {$sort: {'soilCompositionTracker.date': -1, 'fertilizerTracker.date': -1}},
		  {
			$group: {
			  _id: '$_id',
			  soilCompositionTracker: {$push: '$soilCompositionTracker'},
			  fertilizerTracker: {$push: '$fertilizerTracker'}
			}
		  }
		]

		const data = Promise.await(Profile.rawCollection().aggregate(pipeline).toArray())

		// logger('warning', data)

		if (data && data.length > 0) {
		  return data[0]
		} else {
		  return []
		}

	  } else {
		return []
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
	'profile.getByUserId',
	'profile.getByProfileId',
  ],
  limit: 5,
  timeRange: 1000,
})

