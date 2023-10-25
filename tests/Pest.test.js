import SimpleSchema from "simpl-schema";
import Pest from "../imports/api/Pest/Pest";
import { pest } from "./db/db";

//validate data models
it("validate model - pest", () => {
  let pestDb = pest;
  delete pestDb._id;

  const validationContext = new SimpleSchema(Pest.schema).newContext();
  validationContext.validate(pestDb);
  if (!validationContext.isValid()) {
    loggerV2.danger(
      logSource,
      "Validation failed",
      JSON.stringify(validationContext.validationErrors(), null, 4),
    );
  }

  expect(validationContext.isValid()).toBe(true);
});
