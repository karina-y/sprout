import PruningDeadheading from "./PruningDeadheading";
import rateLimit from "../../modules/rate-limit";
import SimpleSchema from "simpl-schema";
import handleMethodException from "/imports/utils/helpers/handle-method-exception";
import { UpdateTypes } from "@constant";
import { Meteor } from "meteor/meteor";
import { loggerV2 } from "../../utils/helpers";

const logSource = "PruningDeadheading Methods > ";

Meteor.methods({
  "pruningDeadheading.insert": function pruningDeadheadingInsert(
    plantId,
    data,
  ) {
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.plantId = plantId;

      const validationContext = new SimpleSchema(
        PruningDeadheading.schema,
      ).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        loggerV2.danger(
          logSource,
          "Validation failed",
          JSON.stringify(validationContext.validationErrors()),
        );

        handleMethodException("Invalid arguments passed");
      } else {
        const response = PruningDeadheading.insert(data);
        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException(e.message);
    }
  },
  "pruningDeadheading.update": function pruningDeadheadingUpdate(type, data) {
    loggerV2.info(logSource, "type", type);
    loggerV2.info(logSource, "data", data);

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
          "updatedAt",
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
          "updatedAt",
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
        loggerV2.danger(
          logSource,
          "Validation failed",
          JSON.stringify(validationContext.validationErrors()),
        );

        handleMethodException(
          `'Validation failed', ${JSON.stringify(
            validationContext.validationErrors(),
          )}`,
        );
      } else {
        loggerV2.success(logSource, "passed", data);

        const response = PruningDeadheading.update({ _id: id }, query);
        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException(e.message);
    }
  },
  "pruningDeadheading.delete": function pruningDeadheadingDelete(data) {
    try {
      if (typeof data !== "string" || !data) {
        loggerV2.danger(logSource, "Invalid arguments passed");

        handleMethodException("Invalid arguments passed");
        // throw new Meteor.Error('500', 'Invalid arguments passed')
      } else {
        const response = PruningDeadheading.remove({ _id: data });
        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

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
