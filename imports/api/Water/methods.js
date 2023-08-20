import Water from "./Water";
import rateLimit from "../../modules/rate-limit";
import logger from "/imports/utils/helpers/logger";
import SimpleSchema from "simpl-schema";
import handleMethodException from "/imports/utils/helpers/handle-method-exception";
import { UpdateTypes } from "@constant";

Meteor.methods({
  "water.insert": function waterInsert(plantId, data) {
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.plantId = plantId;

      const validationContext = new SimpleSchema(Water.schema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        logger(
          "danger",
          "Validation failed",
          JSON.stringify(validationContext.validationErrors())
        );
        handleMethodException("Invalid arguments passed");
      } else {
        const response = Water.insert(data);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "water.update": function waterUpdate(type, data) {
    logger("info", "type", type);
    logger("info", "data", data);

    try {
      const id = data._id;
      delete data._id;
      data.updatedAt = new Date();
      let validationSchema;
      let query;

      if (type === UpdateTypes.water.waterEditModal) {
        validationSchema = Water.schema.pick("waterTracker", "updatedAt");

        query = {
          $set: { updatedAt: data.updatedAt },
          $push: { waterTracker: data.waterTracker },
        };

        //needs to be an array to pass the schema check
        data.waterTracker = [data.waterTracker];
      } else {
        validationSchema = Water.schema.pick(
          "waterPreference",
          "waterSchedule",
          "waterScheduleAuto",
          "updatedAt"
        );

        query = {
          $set: {
            waterPreference: data.waterPreference,
            lightPreference: data.lightPreference,
            waterSchedule: data.waterSchedule,
            waterScheduleAuto: data.waterScheduleAuto,
            updatedAt: data.updatedAt,
          },
        };
      }

      const validationContext = new SimpleSchema(validationSchema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        logger(
          "danger",
          "Validation failed",
          JSON.stringify(validationContext.validationErrors())
        );
        handleMethodException(
          `'Validation failed', ${JSON.stringify(
            validationContext.validationErrors()
          )}`
        );
      } else {
        logger("success", "passed", data);
        const response = Water.update({ _id: id }, query);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "water.delete": function waterDelete(data) {
    try {
      if (typeof data !== "string" || !data) {
        logger("danger", "Invalid arguments passed");
        handleMethodException("Invalid arguments passed");
        // throw new Meteor.Error('500', 'Invalid arguments passed')
      } else {
        const response = Water.remove({ _id: data });
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
});

rateLimit({
  methods: ["water.insert", "water.update", "water.delete"],
  limit: 5,
  timeRange: 1000,
});
