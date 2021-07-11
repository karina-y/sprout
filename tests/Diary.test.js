import logger from "../imports/utils/helpers/logger";
import SimpleSchema from "simpl-schema";
import Diary from "../imports/api/Diary/Diary";
import { diary } from "./db/db";

//validate data models
it("validate model - diary", () => {
  let diaryDb = diary;
  delete diaryDb._id;

  const validationContext = new SimpleSchema(Diary.schema).newContext();
  validationContext.validate(diaryDb);
  if (!validationContext.isValid()) {
    logger(
      "danger",
      "Validation failed",
      JSON.stringify(validationContext.validationErrors(), null, 4)
    );
  }

  expect(validationContext.isValid()).toBe(true);
});
