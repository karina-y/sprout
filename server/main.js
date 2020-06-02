import { Meteor } from 'meteor/meteor';
import colors from 'colors';
import './api';

Meteor.startup(() => {
  colors.enable();
});
