import Fertilizer from "./Fertilizer";
import rateLimit from "../../modules/rate-limit";
import SimpleSchema from "simpl-schema";
import handleMethodException from "/imports/utils/helpers/handle-method-exception";
import { TrackerType } from "../../utils/enums";
import { Meteor } from "meteor/meteor";
import { loggerV2 } from "../../utils/helpers";

const logSource = "Fertilizer Methods > ";

Meteor.methods({
  "fertilizer.insert": function fertilizerInsert(plantId, data) {
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.plantId = plantId;

      const validationContext = new SimpleSchema(
        Fertilizer.schema,
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
        const response = Fertilizer.insert(data);
        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException(e.message);
    }
  },
  "fertilizer.update": function fertilizerUpdate(type, data) {
    loggerV2.info(logSource, "type", type);
    loggerV2.info(logSource, "data", data);

    try {
      const id = data._id;
      delete data._id;
      data.updatedAt = new Date();
      let validationSchema;
      let query;

      if (type === TrackerType.FERTILIZER_TRACKER) {
        validationSchema = Fertilizer.schema.pick(
          "fertilizerTracker",
          "updatedAt",
        );

        query = {
          $set: { updatedAt: data.updatedAt },
          $push: { fertilizerTracker: data.fertilizerTracker },
        };

        //needs to be an array to pass the schema check
        data.fertilizerTracker = [data.fertilizerTracker];
      } else {
        validationSchema = Fertilizer.schema.pick(
          "fertilizerSchedule",
          "compost",
          "preferredFertilizer",
          "nutrient",
          "updatedAt",
        );

        query = {
          $set: {
            fertilizerSchedule: data.fertilizerSchedule,
            compost: data.compost,
            preferredFertilizer: data.preferredFertilizer,
            nutrient: data.nutrient,
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

        const response = Fertilizer.update({ _id: id }, query);
        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException(e.message);
    }
  },
  "fertilizer.delete": function fertilizerDelete(data) {
    try {
      if (typeof data !== "string" || !data) {
        loggerV2.danger(logSource, "Invalid arguments passed");

        handleMethodException("Invalid arguments passed");
        // throw new Meteor.Error('500', 'Invalid arguments passed')
      } else {
        const response = Fertilizer.remove({ _id: data });
        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException(e.message);
    }
  },
});

rateLimit({
  methods: ["fertilizer.insert", "fertilizer.update", "fertilizer.delete"],
  limit: 5,
  timeRange: 1000,
});
