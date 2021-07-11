import Pest from "./Pest";
import rateLimit from "../../modules/rate-limit";
import logger from "/imports/utils/helpers/logger";
import SimpleSchema from "simpl-schema";
import handleMethodException from "/imports/utils/helpers/handle-method-exception";

Meteor.methods({
  "pest.insert": function pestInsert(plantId, data) {
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.plantId = plantId;

      const validationContext = new SimpleSchema(Pest.schema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        logger("danger", "Validation failed", JSON.stringify(validationContext.validationErrors()));
        handleMethodException("Invalid arguments passed");
      } else {
        const response = Pest.insert(data);
        logger("success", "passed", data);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "pest.update": function pestUpdate(type, data) {
    logger("info", "type", type);
    logger("info", "data", data);

    try {
      const id = data._id;
      delete data._id;
      data.updatedAt = new Date()

      const validationSchema = Pest.schema.pick(
              "pestTracker",
              "updatedAt"
      );

      const query = { $set: { updatedAt: data.updatedAt }, $push: { pestTracker: data.pestTracker } };

      data.pestTracker = [data.pestTracker];

      const validationContext = new SimpleSchema(validationSchema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        logger("danger", "Validation failed", JSON.stringify(validationContext.validationErrors()));
        handleMethodException(`'Validation failed', ${JSON.stringify(validationContext.validationErrors())}`);
      } else {
        logger("success", "passed", data);
        const response = Pest.update({ _id: id }, query);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "pest.delete": function pestDelete(data) {
    try {
      if (typeof data !== "string" || !data) {
        logger("danger", "Invalid arguments passed");
        handleMethodException("Invalid arguments passed");
        // throw new Meteor.Error('500', 'Invalid arguments passed')
      } else {
        const response = Pest.remove({ _id: data });
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
});

rateLimit({
  methods: ["pest.insert", "pest.update", "pest.delete"],
  limit: 5,
  timeRange: 1000,
});
