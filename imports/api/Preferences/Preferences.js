//sample schema

import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Preferences = new Mongo.Collection("Preferences");

Preferences.deny({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Preferences.schema = new SimpleSchema(
  {
    userId: {
      type: String,
      label: "userId",
    },
    theme: {
      type: String,
      defaultValue: "light",
      label: "theme",
    },
    createdAt: {
      type: Date,
      autoValue() {
        if (this.isInsert) return new Date();
      },
      label: "createdAt",
    },
    updatedAt: {
      type: Date,
      autoValue() {
        if (this.isInsert || this.isUpdate) return new Date();
      },
      label: "updatedAt",
    },
  },
  {
    clean: {
      filter: true,
      autoConvert: true,
      removeEmptyStrings: true,
      trimStrings: true,
      getAutoValues: true,
      removeNullsFromArrays: true,
    },
  }
);

Preferences.attachSchema(Preferences.schema);

export default Preferences;
