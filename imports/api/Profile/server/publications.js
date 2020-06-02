import { Meteor } from 'meteor/meteor';
import Profile from '../Profile';
import logger from '/imports/utils/logger';

Meteor.publish('profile', function profiles() {
    const profiles = Profile.find();

    if (profiles.fetch() && profiles.fetch().length > 0) {
        return profiles;
    } else {
        return [];
    }
});
