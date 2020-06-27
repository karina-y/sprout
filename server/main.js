import { Meteor } from 'meteor/meteor';
import colors from 'colors';
import './api';

Meteor.startup(() => {
  colors.enable();

  // process.env.MOBILE_DDP_URL = 'http://1.1.1.1:3000 1';
  // process.env.MOBILE_ROOT_URL = 'http://1.1.1.1:3000 1';
});
