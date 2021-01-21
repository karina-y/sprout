import logger from "../imports/utils/helpers/logger";
import SimpleSchema from "simpl-schema";
import Fertilizer from "../imports/api/Fertilizer/Fertilizer";
import { fertilizer } from "./db/db";

//validate data models
it("validate model - fertilizer", () => {
  let fertilizerDb = fertilizer;
  delete fertilizerDb._id;

  const validationContext = new SimpleSchema(Fertilizer.schema).newContext();
  validationContext.validate(fertilizerDb);
  if (!validationContext.isValid()) {
    logger(
      "danger",
      "Validation failed",
      JSON.stringify(validationContext.validationErrors(), null, 4)
    );
  }

  expect(validationContext.isValid()).toBe(true);
});
