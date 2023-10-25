import rateLimit from "../../modules/rate-limit";
import SimpleSchema from "simpl-schema";
import handleMethodException from "/imports/utils/helpers/handle-method-exception";
import Preferences from "./Preferences";
import { Meteor } from "meteor/meteor";
import { loggerV2 } from "../../utils/helpers";

const logSource = "Preferences Methods > ";

Meteor.methods({
  "preferences.update": function preferencesUpdate(data) {
    try {
      // data.createdAt = new Date()
      // data.updatedAt = new Date()

      const validationSchema = Preferences.schema.pick("theme");

      const validationContext = new SimpleSchema(validationSchema).newContext();
      validationContext.validate(data);

      if (!validationContext.isValid()) {
        loggerV2.danger(
          logSource,
          "Validation failed",
          JSON.stringify(validationContext.validationErrors()),
        );

        handleMethodException(
          `Validation failed, ${JSON.stringify(
            validationContext.validationErrors(),
          )}`,
        );
        // throw new Meteor.Error('500', 'Invalid arguments passed')
      } else {
        let response;

        //does a preference profile exist yet? (beta users started without one)
        if (Preferences.findOne({ userId: Meteor.userId() })) {
          response = Preferences.update(
            { userId: Meteor.userId() },
            { $set: data },
          );
        } else {
          data.userId = Meteor.userId();

          response = Preferences.insert(data);
        }

        return response;
      }
    } catch (e) {
      loggerV2.danger(logSource, e.message);

      handleMethodException("Please check your inputs and try again.");
    }
  },
});

rateLimit({
  methods: ["preferences.update"],
  limit: 5,
  timeRange: 1000,
});
