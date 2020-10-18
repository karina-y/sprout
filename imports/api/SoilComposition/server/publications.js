import SoilComposition from "../SoilComposition";
import Plant from "../../Plant/Plant";

Meteor.publish("soilComposition", function plants() {
  if (Meteor.userId()) {
    const plants = Plant.find({ userId: Meteor.userId() }, { fields: { _id: 1 } }).fetch();
    const plantIds = plants.map(function (item) {
      return item["_id"];
    });

    const soilComposition = SoilComposition.find({
      plantId: { $in: plantIds },
    });

    if (soilComposition) {
      return soilComposition;
    } else {
      return [];
    }
  } else {
    return [];
  }
});
