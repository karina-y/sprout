import { Meteor } from 'meteor/meteor';
import colors from 'colors';
import './api';

Meteor.startup(() => {
  colors.enable();
  // console.log("************meteor server status:", Meteor.status())
  // process.env.MOBILE_DDP_URL = 'http://1.1.1.1:3000 1';
  // process.env.MOBILE_ROOT_URL = 'http://1.1.1.1:3000 1';
});
