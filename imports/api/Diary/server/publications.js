import Diary from "../Diary";
import Plant from "../../Plant/Plant";

Meteor.publish("diary", function plants() {
  if (Meteor.userId()) {
    const plants = Plant.find({ userId: Meteor.userId() }, { fields: { _id: 1 } }).fetch();
    const plantIds = plants.map(function (item) {
      return item["_id"];
    });

    const diaries = Diary.find({ plantId: { $in: plantIds } });

    if (diaries) {
      return diaries;
    } else {
      return [];
    }
  } else {
    return [];
  }
});
