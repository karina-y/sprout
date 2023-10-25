import SimpleSchema from "simpl-schema";
import Plant from "../imports/api/Plant/Plant";
import { plant } from "./db/db";

//validate data models
it("validate model - plant", () => {
  let plantDb = plant;
  delete plantDb._id;

  const validationContext = new SimpleSchema(Plant.schema).newContext();
  validationContext.validate(plantDb);
  if (!validationContext.isValid()) {
    loggerV2.danger(
      logSource,
      "Validation failed",
      JSON.stringify(validationContext.validationErrors(), null, 4),
    );
  }

  expect(validationContext.isValid()).toBe(true);
});
