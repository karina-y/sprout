import Category from "./Category";
import rateLimit from "../../modules/rate-limit";
import logger from "/imports/utils/helpers/logger";
import SimpleSchema from "simpl-schema";
import handleMethodException from "../../utils/helpers/handle-method-exception";

Meteor.methods({
  "category.insert": function categoryInsert(data) {
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.userId = Meteor.userId();

      const validationContext = new SimpleSchema(Category.schema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        logger("danger", "Validation failed", JSON.stringify(validationContext.validationErrors()));
        handleMethodException(
          `Validation failed, ${JSON.stringify(validationContext.validationErrors())}`
        );
        // throw new Meteor.Error('500', 'Invalid arguments passed')
      } else {
        const response = Category.insert(data);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "category.update": function categoryUpdate(type, data) {
    logger("info", "type", type);
    logger("info", "data", data);

    try {
      // data.updatedAt = new Date();
      // const profile = Category.findOne({ _id: data._id });
      delete data._id;
      data.updatedAt = new Date();
      let validationSchema;
      let query;

      switch (type) {
        case "waterTracker-edit":
          validationSchema = Category.schema.pick(
            "waterPreference",
            "lightPreference",
            "waterSchedule",
            "updatedAt"
          );

          query = {
            $set: {
              waterPreference: data.waterPreference,
              lightPreference: data.lightPreference,
              waterSchedule: data.waterSchedule,
              updatedAt: data.updatedAt,
            },
          };
          break;
        case "fertilizerTracker-edit":
          validationSchema = Category.schema.pick("fertilizerSchedule", "updatedAt");

          query = {
            $set: {
              fertilizerSchedule: data.fertilizerSchedule,
              updatedAt: data.updatedAt,
            },
          };
          break;
        case "etc-edit":
          validationSchema = Category.schema.pick(
            "location",
            "dateBought",
            "locationBought",
            "companions",
            "updatedAt"
          );

          query = {
            $set: {
              location: data.location,
              dateBought: data.dateBought,
              locationBought: data.locationBought,
              companions: data.companions,
              updatedAt: data.updatedAt,
            },
          };
          break;
        default:
          validationSchema = Category.schema.pick(type, "updatedAt");
          query = {
            $set: { updatedAt: data.updatedAt },
            $push: { [type]: data[type] },
          };
          data[type] = [data[type]];
      }

      const validationContext = new SimpleSchema(validationSchema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        logger("danger", "Validation failed", JSON.stringify(validationContext.validationErrors()));
        handleMethodException(
          `Validation failed, ${JSON.stringify(validationContext.validationErrors())}`
        );
        // throw new Meteor.Error('500')
      } else {
        logger("success", "passed", data);
        const response = Category.update({ _id: plant._id }, query);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "category.delete": function categoryDelete(data) {
    try {
      if (typeof data !== "string") {
        logger("danger", "Validation failed");
        throw new Meteor.Error("500", "Invalid arguments passed");
      } else {
        const response = Category.remove({ _id: data });
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
});

rateLimit({
  methods: ["category.insert", "category.update", "category.delete"],
  limit: 5,
  timeRange: 1000,
});
