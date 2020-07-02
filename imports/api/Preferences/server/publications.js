import Preferences from '../Preferences';
import logger from '/imports/utils/logger';

Meteor.publish('preferences', function preferences() {
  if (Meteor.userId()) {
	const acctPref = Preferences.find({userId: Meteor.userId()});

	if (acctPref.fetch() && acctPref.fetch().length > 0) {
	  return acctPref;
	} else {
	  return [];
	}
  } else {
	return [];
  }
});
