import Category from "../Category";

Meteor.publish("category", function categories() {
  if (Meteor.userId()) {
    const categories = Category.find({});

    if (categories.fetch()?.length > 0) {
      return categories;
    } else {
      return [];
    }
  } else {
    return [];
  }
});
