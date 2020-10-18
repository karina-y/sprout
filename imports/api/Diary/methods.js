import Diary from "./Diary";
import rateLimit from "../../modules/rate-limit";
import logger from "/imports/utils/helpers/logger";
import SimpleSchema from "simpl-schema";
import handleMethodException from "/imports/utils/helpers/handle-method-exception";

Meteor.methods({
  "diary.insert": function diaryInsert(plantId, data) {
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.plantId = plantId;

      const validationContext = new SimpleSchema(Diary.schema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        logger("danger", "Validation failed", JSON.stringify(validationContext.validationErrors()));
        handleMethodException("Invalid arguments passed");
      } else {
        const response = Diary.insert(data);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "diary.update": function diaryUpdate(data) {
    logger("info", "data", data);

    try {
      const id = data._id;
      delete data._id;
      data.updatedAt = new Date();

      const validationSchema = Diary.schema.pick(
              "diary",
              "updatedAt"
      );

      const query = { $set: { updatedAt: data.updatedAt }, $push: { diary: data.diary } };
      data.diary = [data.diary];

      const validationContext = new SimpleSchema(validationSchema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        logger("danger", "Validation failed", JSON.stringify(validationContext.validationErrors()));
        handleMethodException(`'Validation failed', ${JSON.stringify(validationContext.validationErrors())}`);
      } else {
        logger("success", "passed", data);
        const response = Diary.update({ _id: id }, query);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "diary.delete": function diaryDelete(data) {
    try {
      if (typeof data !== "string" || !data) {
        logger("danger", "Invalid arguments passed");
        handleMethodException("Invalid arguments passed");
      } else {
        const response = Diary.remove({ _id: data });
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
});

rateLimit({
  methods: ["diary.insert", "diary.update", "diary.delete"],
  limit: 5,
  timeRange: 1000,
});
