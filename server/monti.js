
if (Meteor.isProduction) {
  Monti.connect(Meteor.settings.private.monti.appId, Meteor.settings.private.monti.appSecret);
}
