import Pest from "./Pest";
import rateLimit from "../../modules/rate-limit";
import SimpleSchema from "simpl-schema";
import handleMethodException from "/imports/utils/helpers/handle-method-exception";
import { Meteor } from "meteor/meteor";
import { loggerV2 } from "../../utils/helpers";

const logSource = "Pest Methods > ";

Meteor.methods({
  "pest.insert": function pestInsert(plantId, data) {
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.plantId = plantId;

      const validationContext = new SimpleSchema(Pest.schema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        loggerV2.danger(
          logSource,
          "Validation failed",
          JSON.stringify(validationContext.validationErrors()),
        );

        handleMethodException("Invalid arguments passed");
      } else {
        const response = Pest.insert(data);
        loggerV2.success(logSource, "passed", data);

        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException(e.message);
    }
  },
  "pest.update": function pestUpdate(type, data) {
    loggerV2.info(logSource, "type", type);
    loggerV2.info(logSource, "data", data);

    try {
      const id = data._id;
      delete data._id;
      data.updatedAt = new Date();

      const validationSchema = Pest.schema.pick("pestTracker", "updatedAt");

      const query = {
        $set: { updatedAt: data.updatedAt },
        $push: { pestTracker: data.pestTracker },
      };

      data.pestTracker = [data.pestTracker];

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

        const response = Pest.update({ _id: id }, query);
        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException(e.message);
    }
  },
  "pest.delete": function pestDelete(data) {
    try {
      if (typeof data !== "string" || !data) {
        loggerV2.danger(logSource, "Invalid arguments passed");

        handleMethodException("Invalid arguments passed");
        // throw new Meteor.Error('500', 'Invalid arguments passed')
      } else {
        const response = Pest.remove({ _id: data });
        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException(e.message);
    }
  },
});

rateLimit({
  methods: ["pest.insert", "pest.update", "pest.delete"],
  limit: 5,
  timeRange: 1000,
});
