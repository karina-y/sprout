import rateLimit from "../../modules/rate-limit";
import { Meteor } from "meteor/meteor";
import { loggerV2 } from "../../utils/helpers";

const logSource = "Trefle Methods > ";

//TODO what's this for?
Meteor.methods({
  "trefle.get": function profileDelete(data) {
    try {
      //https://trefle.io/api/plants/?token=WjVkVytwSU1rYzNGNUNpS24rSmxPZz09&common_name=monstera

      if (
        typeof data.commonName !== "string" ||
        typeof data.latinName !== "string"
      ) {
        loggerV2.danger(logSource, "Validation failed");

        throw new Meteor.Error("500", "Invalid arguments passed");
      } else {
        const commonPlants = HTTP.call(
          "GET",
          `https://trefle.io/api/plants/?token=${Meteor.settings.private.apiTokens.trefleToken}&common_name=${data.commonName}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        const latinPlants = HTTP.call(
          "GET",
          `https://trefle.io/api/plants/?token=${Meteor.settings.private.apiTokens.trefleToken}&scientific_name=${data.latinName}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        loggerV2.info(logSource, "commonPlants", commonPlants);
        loggerV2.info(logSource, "latinPlants", latinPlants);

        return null;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      throw new Meteor.Error("500", "Please check your inputs and try again.");
    }
  },
});

rateLimit({
  methods: ["trefle.get"],
  limit: 5,
  timeRange: 1000,
});
