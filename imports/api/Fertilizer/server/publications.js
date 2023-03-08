import { Meteor } from "meteor/meteor";
import Fertilizer from "../Fertilizer";
import Plant from "../../Plant/Plant";

Meteor.publish("fertilizer", function plants() {
  if (Meteor.userId()) {
    const plants = Plant.find({ userId: Meteor.userId() }, { fields: { _id: 1 } }).fetch();
    const plantIds = plants.map(function (item) {
      return item["_id"];
    });

    const fertilizers = Fertilizer.find({ plantId: { $in: plantIds } });

    if (fertilizers) {
      return fertilizers;
    } else {
      return [];
    }
  } else {
    return [];
  }
});
