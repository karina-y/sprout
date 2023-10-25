import Seedling from "../Seedling";

Meteor.publish("seedling", function seedlings() {
  if (Meteor.userId()) {
    const seedlings = Seedling.find({ userId: Meteor.userId() });

    if (seedlings) {
      return seedlings;
    } else {
      return [];
    }
  } else {
    return [];
  }
});
