import SimpleSchema from "simpl-schema";
import PruningDeadheading from "../imports/api/PruningDeadheading/PruningDeadheading";
import { pruningDeadheading } from "./db/db";

//validate data models
it("validate model - pruningDeadheading", () => {
  let pruningDeadheadingDb = pruningDeadheading;
  delete pruningDeadheadingDb._id;

  const validationContext = new SimpleSchema(
    PruningDeadheading.schema,
  ).newContext();
  validationContext.validate(pruningDeadheadingDb);
  if (!validationContext.isValid()) {
    loggerV2.danger(
      logSource,
      "Validation failed",
      JSON.stringify(validationContext.validationErrors(), null, 4),
    );
  }

  expect(validationContext.isValid()).toBe(true);
});
