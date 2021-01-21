import logger from "../imports/utils/helpers/logger";
import SimpleSchema from "simpl-schema";
import SoilComposition from "../imports/api/SoilComposition/SoilComposition";
import { soilCompositionPotted, soilCompositionInGround } from "./db/db";

//validate data models
it("validate model - soilComposition potted", () => {
  let soilCompositionDb = soilCompositionPotted;
  delete soilCompositionDb._id;

  const validationContext = new SimpleSchema(
    SoilComposition.schema
  ).newContext();
  validationContext.validate(soilCompositionDb);
  if (!validationContext.isValid()) {
    logger(
      "danger",
      "Validation failed",
      JSON.stringify(validationContext.validationErrors(), null, 4)
    );
  }

  expect(validationContext.isValid()).toBe(true);
});

it("validate model - soilComposition in ground", () => {
  let soilCompositionDb = soilCompositionInGround;
  delete soilCompositionDb._id;

  const validationContext = new SimpleSchema(
    SoilComposition.schema
  ).newContext();
  validationContext.validate(soilCompositionDb);
  if (!validationContext.isValid()) {
    logger(
      "danger",
      "Validation failed",
      JSON.stringify(validationContext.validationErrors(), null, 4)
    );
  }

  expect(validationContext.isValid()).toBe(true);
});
