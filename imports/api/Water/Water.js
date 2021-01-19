//sample schema

import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Water = new Mongo.Collection("Water");

Water.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Water.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Water.schema = new SimpleSchema(
  {
    plantId: {
      type: String,
      defaultValue: "admin",
      label: "userId",
    },
    waterSchedule: {
      type: Number,
      optional: true,
      label: "waterSchedule",
    },
    waterScheduleAuto: {
      type: Boolean,
      defaultValue: false,
      optional: true,
      label: "waterScheduleAuto",
    },
    waterPreference: {
      type: String,
      defaultValue: "",
      label: "waterPreference",
    },
    waterTracker: {
      type: Array,
      optional: true,
      label: "waterTracker",
    },
    "waterTracker.$": {
      type: Object,
      label: "waterTracker.$",
    },
    "waterTracker.$.date": {
      type: Date,
      label: "waterTracker.$.date",
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

Water.attachSchema(Water.schema);

export default Water;
