import PruningDeadheading from "./PruningDeadheading";
import rateLimit from "../../modules/rate-limit";
import logger from "/imports/utils/helpers/logger";
import SimpleSchema from "simpl-schema";
import handleMethodException from "/imports/utils/helpers/handle-method-exception";
import { UpdateTypes } from "@constant";

Meteor.methods({
  "pruningDeadheading.insert": function pruningDeadheadingInsert(
    plantId,
    data
  ) {
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.plantId = plantId;

      const validationContext = new SimpleSchema(
        PruningDeadheading.schema
      ).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        logger(
          "danger",
          "Validation failed",
          JSON.stringify(validationContext.validationErrors())
        );
        handleMethodException("Invalid arguments passed");
      } else {
        const response = PruningDeadheading.insert(data);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "pruningDeadheading.update": function pruningDeadheadingUpdate(type, data) {
    logger("info", "type", type);
    logger("info", "data", data);

    try {
      const id = data._id;
      delete data._id;
      data.updatedAt = new Date();
      let validationSchema;
      let query;

      if (type === UpdateTypes.pruningDeadheading.pruningDeadheadingEditModal) {
        //entry for both pruning and deadheading
        validationSchema = PruningDeadheading.schema.pick(
          "pruningTracker",
          "deadheadingTracker",
          "updatedAt"
        );

        query = {
          $set: { updatedAt: data.updatedAt },
          $push: {
            pruningTracker: data.pruningTracker,
            deadheadingTracker: data.deadheadingTracker,
          },
        };

        data.pruningTracker = [data.pruningTracker];
        data.deadheadingTracker = [data.deadheadingTracker];
      } else {
        validationSchema = PruningDeadheading.schema.pick(
          "pruningPreference",
          "deadheadingPreference",
          "updatedAt"
        );

        query = {
          $set: {
            pruningPreference: data.pruningPreference,
            deadheadingPreference: data.deadheadingPreference,
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
        const response = PruningDeadheading.update({ _id: id }, query);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "pruningDeadheading.delete": function pruningDeadheadingDelete(data) {
    try {
      if (typeof data !== "string" || !data) {
        logger("danger", "Invalid arguments passed");
        handleMethodException("Invalid arguments passed");
        // throw new Meteor.Error('500', 'Invalid arguments passed')
      } else {
        const response = PruningDeadheading.remove({ _id: data });
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
});

rateLimit({
  methods: [
    "pruningDeadheading.insert",
    "pruningDeadheading.update",
    "pruningDeadheading.delete",
  ],
  limit: 5,
  timeRange: 1000,
});
