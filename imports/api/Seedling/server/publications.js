import Seedling from '../Seedling'
import logger from '/imports/utils/helpers/logger'

Meteor.publish('seedling', function seedlings () {
  if (Meteor.userId()) {
	const seedlings = Seedling.find({userId: Meteor.userId()});

	if (seedlings) {
	  return seedlings
	} else {
	  return []
	}
  } else {
	return []
  }
})
