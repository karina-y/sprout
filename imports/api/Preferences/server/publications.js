import Preferences from "../Preferences";

Meteor.publish("preferences", function preferences() {
  if (Meteor.userId()) {
    const acctPref = Preferences.find({ userId: Meteor.userId() });

    if (acctPref.fetch()?.length > 0) {
      return acctPref;
    } else {
      return [];
    }
  } else {
    return [];
  }
});
