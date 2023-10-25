import SoilComposition from "./SoilComposition";
import rateLimit from "../../modules/rate-limit";
import SimpleSchema from "simpl-schema";
import handleMethodException from "/imports/utils/helpers/handle-method-exception";
import { UpdateTypes } from "@constant";
import { Meteor } from "meteor/meteor";
import { loggerV2 } from "../../utils/helpers";

const logSource = "SoilComposition Methods > ";

Meteor.methods({
  "soilComposition.insert": function soilCompositionInsert(plantId, data) {
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.plantId = plantId;

      const validationContext = new SimpleSchema(
        SoilComposition.schema,
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
        const response = SoilComposition.insert(data);
        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException(e.message);
    }
  },
  "soilComposition.update": function soilCompositionUpdate(
    type,
    data,
    category,
  ) {
    loggerV2.info(logSource, "type", type);
    loggerV2.info(logSource, "data", data);

    try {
      const id = data._id;
      delete data._id;
      data.updatedAt = new Date();
      let validationSchema;
      let query;

      if (type === UpdateTypes.soilComp.soilCompEditModal) {
        validationSchema = SoilComposition.schema.pick(type, "updatedAt");
        query = {
          $set: { updatedAt: data.updatedAt },
          $push: { [type]: data[type] },
        };

        data[type] = [data[type]];
      } else {
        //entry for both pruning and deadheading
        validationSchema =
          category === "in-ground"
            ? SoilComposition.schema.pick(
                "soilAmendment",
                "soilType",
                "tilled",
                "updatedAt",
              )
            : SoilComposition.schema.pick("soilRecipe", "updatedAt");

        query =
          category === "in-ground"
            ? {
                $set: {
                  soilAmendment: data.soilAmendment,
                  soilType: data.soilType,
                  tilled: data.tilled,
                  updatedAt: data.updatedAt,
                },
              }
            : {
                $set: {
                  soilRecipe: data.soilRecipe,
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

        const response = SoilComposition.update({ _id: id }, query);

        //todo for all methods, if response is 0 then something went wrong, need to throw err to the client
        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException(e.message);
    }
  },
  "soilComposition.delete": function soilCompositionDelete(data) {
    try {
      if (typeof data !== "string" || !data) {
        loggerV2.danger(logSource, "Invalid arguments passed");

        handleMethodException("Invalid arguments passed");
        // throw new Meteor.Error('500', 'Invalid arguments passed')
      } else {
        const response = SoilComposition.remove({ _id: data });
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
    "soilComposition.insert",
    "soilComposition.update",
    "soilComposition.delete",
  ],
  limit: 5,
  timeRange: 1000,
});
