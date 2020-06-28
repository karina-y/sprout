import Profile from '../Profile'
import logger from '/imports/utils/logger'

Meteor.publish('profile', function profiles () {
  if (Meteor.userId()) {
	const profiles = Profile.find({userId: Meteor.userId()}).fetch();

	if (profiles && profiles.length > 0) {

	  // const stuff = Meteor.call('profile.getByUserId')

	  // logger('info', stuff)

	  return profiles
	} else {
	  return []
	}
  } else {
	//TODO remove - for debugging
	/*const profiles = Profile.find({userId: 'r6H5iC6ySRKZZchns'})

	if (profiles.fetch() && profiles.fetch().length > 0) {
	  return profiles
	} else {
	  return []
	}*/

	return []
  }
})
