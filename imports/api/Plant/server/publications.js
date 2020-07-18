import Plant from '../Plant'
import logger from '/imports/utils/logger'

Meteor.publish('plant', function plants () {
  if (Meteor.userId()) {
	const plants = Plant.find({userId: Meteor.userId()});

	if (plants) {
	  return plants
	} else {
	  return []
	}
  } else {
	return []
  }
})
