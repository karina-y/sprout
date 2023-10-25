import SimpleSchema from "simpl-schema";
import Diary from "../imports/api/Diary/Diary";
import { diary } from "./db/db";
import { loggerV2 } from '../imports/utils/helpers'

describe("Diary Schema", () => {
  const logSource = "Diary Schema test > ";

//validate data models
  it("should validate model - diary", () => {
    let diaryDb = diary;
    delete diaryDb._id;

    const validationContext = new SimpleSchema(Diary.schema).newContext();
    validationContext.validate(diaryDb);

    if (!validationContext.isValid()) {
      loggerV2.danger(
              logSource,
              "Validation failed",
              JSON.stringify(validationContext.validationErrors(), null, 4),
      );
    }

    expect(validationContext.isValid()).toBe(true);
  });
}
