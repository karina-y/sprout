import Plant from "./Plant";

import Fertilizer from "../Fertilizer/Fertilizer";
import Pest from "../Pest/Pest";
import Diary from "../Diary/Diary";
import PruningDeadheading from "../PruningDeadheading/PruningDeadheading";
import SoilComposition from "../SoilComposition/SoilComposition";
import Water from "../Water/Water";

import rateLimit from "../../modules/rate-limit";
import logger from "/imports/utils/helpers/logger";
import SimpleSchema from "simpl-schema";
import handleMethodException from "/imports/utils/helpers/handle-method-exception";

Meteor.methods({
  "plant.insert": function plantInsert(data) {
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.userId = Meteor.userId();

      const validationContext = new SimpleSchema(Plant.schema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        logger(
          "danger",
          "Validation failed",
          JSON.stringify(validationContext.validationErrors())
        );
        handleMethodException("Invalid arguments passed");
      } else {
        const response = Plant.insert(data);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "plant.update": function plantUpdate(data) {
    logger("info", "data", data);

    try {
      const id = data._id;
      delete data._id;
      data.updatedAt = new Date();

      const validationSchema = Plant.schema.pick(
        "commonName",
        "latinName",
        "lightPreference",
        "location",
        "dateBought",
        "datePlanted",
        "locationBought",
        "toxicity",
        "category",
        "companions",
        "updatedAt"
      );

      const query = {
        $set: {
          commonName: data.commonName,
          latinName: data.latinName,
          lightPreference: data.lightPreference,
          toxicity: data.toxicity,
          category: data.category,
          location: data.location,
          locationBought: data.locationBought,
          dateBought: data.dateBought,
          datePlanted: data.datePlanted,
          companions: data.companions,
          updatedAt: data.updatedAt,
        },
      };

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
        const response = Plant.update({ _id: id }, query);
        return response;
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
  "plant.delete": async function plantDelete(data) {
    try {
      if (typeof data !== "string" || !data) {
        logger("danger", "Invalid arguments passed");
        handleMethodException("Invalid arguments passed");
      } else {
        const promises = [
          new Promise(function (resolve, reject) {

            Plant.remove({ _id: data }, (err, done) => {
              err ? reject(err) : resolve(done);
            });
          }),

          new Promise(function (resolve, reject) {
            Water.remove({ plantId: data }, (err, done) => {
              err ? reject(err) : resolve(done);
            });
          }),

          new Promise(function (resolve, reject) {
            Fertilizer.remove({ plantId: data }, (err, done) => {
              err ? reject(err) : resolve(done);
            });
          }),

          new Promise(function (resolve, reject) {
            Diary.remove({ plantId: data }, (err, done) => {
              err ? reject(err) : resolve(done);
            });
          }),

          new Promise(function (resolve, reject) {
            Pest.remove({ plantId: data }, (err, done) => {
              err ? reject(err) : resolve(done);
            });
          }),

          new Promise(function (resolve, reject) {
            PruningDeadheading.remove({ plantId: data }, (err, done) => {
              err ? reject(err) : resolve(done);
            });
          }),

          new Promise(function (resolve, reject) {
            SoilComposition.remove({ plantId: data }, (err, done) => {
              err ? reject(err) : resolve(done);
            });
          }),
        ];

        return Promise.all(promises);
      }
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },

  "plant.migrate": function plantInsert() {
    return;

    try {
      let data = {
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      //get all plants
      const plants = Plant.find().fetch();

      for (let i = 0; i < plants.length; i++) {
        let plant = plants[i];
        if (plant._id !== "5ed45d96b2b02c4afdb8e27b") {
          data.plantId = plant._id;

          //for each plant migrate each item
          const water = {
            ...data,
          };

          if (plant.waterSchedule) water.waterSchedule = plant.waterSchedule;
          if (plant.waterScheduleAuto)
            water.waterScheduleAuto = plant.waterScheduleAuto;
          if (plant.waterPreference)
            water.waterPreference = plant.waterPreference;
          if (plant.waterTracker) water.waterTracker = plant.waterTracker;

          const fertilizer = {
            ...data,
          };

          if (plant.compost) fertilizer.compost = plant.compost;
          if (plant.nutrient) fertilizer.nutrient = plant.nutrient;
          if (plant.fertilizer) fertilizer.fertilizer = plant.fertilizer;
          if (plant.fertilizerSchedule)
            fertilizer.fertilizerSchedule = plant.fertilizerSchedule;
          if (plant.fertilizerTracker)
            fertilizer.fertilizerTracker = plant.fertilizerTracker;

          const diary = {
            ...data,
          };

          if (plant.diary) diary.diary = plant.diary;

          const pest = {
            ...data,
          };

          if (plant.pestTracker) pest.pestTracker = plant.pestTracker;

          const pruningDeadheading = {
            ...data,
          };

          if (plant.pruningPreference)
            pruningDeadheading.pruningPreference = plant.pruningPreference;
          if (plant.deadheadingPreference)
            pruningDeadheading.deadheadingPreference =
              plant.deadheadingPreference;
          if (plant.pruningSchedule)
            pruningDeadheading.pruningSchedule = plant.pruningSchedule;
          if (plant.deadheadingSchedule)
            pruningDeadheading.deadheadingSchedule = plant.deadheadingSchedule;
          if (plant.pruningTracker)
            pruningDeadheading.pruningTracker = plant.pruningTracker;
          if (plant.deadheadingTracker)
            pruningDeadheading.deadheadingTracker = plant.deadheadingTracker;

          const soilComposition = {
            ...data,
          };

          if (plant.tilled) soilComposition.tilled = plant.tilled;
          if (plant.soilType) soilComposition.soilType = plant.soilType;
          if (plant.soilAmendment)
            soilComposition.soilAmendment = plant.soilAmendment;
          if (plant.soilRecipe) soilComposition.soilRecipe = plant.soilRecipe;
          if (plant.soilCompositionTracker)
            soilComposition.soilCompositionTracker =
              plant.soilCompositionTracker;

          // break;
          // 		return;
          let waterResponse = Water.insert(water);
          let fertilizerResponse = Fertilizer.insert(fertilizer);
          let diaryResponse = Diary.insert(diary);
          let pestResponse = Pest.insert(pest);
          let pruningDeadheadingResponse = PruningDeadheading.insert(
            pruningDeadheading
          );
          let soilCompositionResponse = SoilComposition.insert(soilComposition);

          let plantResponse = Plant.update(
            { _id: plant._id },
            {
              $unset: {
                waterSchedule: 1,
                waterScheduleAuto: 1,
                waterPreference: 1,
                waterTracker: 1,
                compost: 1,
                nutrient: 1,
                fertilizer: 1,
                fertilizerSchedule: 1,
                fertilizerTracker: 1,
                diary: 1,
                pestTracker: 1,
                pruningPreference: 1,
                deadheadingPreference: 1,
                pruningSchedule: 1,
                deadheadingSchedule: 1,
                pruningTracker: 1,
                deadheadingTracker: 1,
                tilled: 1,
                soilType: 1,
                soilAmendment: 1,
                soilRecipe: 1,
                soilCompositionTracker: 1,
              },
            }
          );
        }
      }

      return;
    } catch (e) {
      logger("danger", e.message);
      handleMethodException(e.message);
    }
  },
});

rateLimit({
  methods: ["plant.insert", "plant.update", "plant.delete", "plant.migrate"],
  limit: 5,
  timeRange: 1000,
});
