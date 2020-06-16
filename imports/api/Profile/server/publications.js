import { Meteor } from 'meteor/meteor';
import Profile from '../Profile';
import logger from '/imports/utils/logger';

Meteor.publish('profile', function profiles() {
  if (Meteor.userId()) {
	const profiles = Profile.find({userId: Meteor.userId()});

	if (profiles.fetch() && profiles.fetch().length > 0) {
	  return profiles;
	} else {
	  return [];
	}
  } else {
	return [];
  }
});
