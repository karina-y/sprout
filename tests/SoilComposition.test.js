import SimpleSchema from "simpl-schema";
import SoilComposition from "../imports/api/SoilComposition/SoilComposition";
import { soilCompositionInGround, soilCompositionPotted } from "./db/db";
import { loggerV2 } from "../imports/utils/helpers";

describe("SoilComposition Schema", () => {
  const logSource = "SoilComposition Schema test > ";

  //validate data models
  it("should validate model - soilComposition potted", () => {
    let soilCompositionDb = soilCompositionPotted;
    delete soilCompositionDb._id;

    const validationContext = new SimpleSchema(
      SoilComposition.schema,
    ).newContext();
    validationContext.validate(soilCompositionDb);
    if (!validationContext.isValid()) {
      loggerV2.danger(
        logSource,
        "Validation failed",
        JSON.stringify(validationContext.validationErrors(), null, 4),
      );
    }

    expect(validationContext.isValid()).toBe(true);
  });

  it("should validate model - soilComposition in ground", () => {
    let soilCompositionDb = soilCompositionInGround;
    delete soilCompositionDb._id;

    const validationContext = new SimpleSchema(
      SoilComposition.schema,
    ).newContext();
    validationContext.validate(soilCompositionDb);
    if (!validationContext.isValid()) {
      loggerV2.danger(
        logSource,
        "Validation failed",
        JSON.stringify(validationContext.validationErrors(), null, 4),
      );
    }

    expect(validationContext.isValid()).toBe(true);
  });
});
