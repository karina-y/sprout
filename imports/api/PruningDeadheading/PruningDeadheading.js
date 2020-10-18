//sample schema

import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const PruningDeadheading = new Mongo.Collection("PruningDeadheading");

PruningDeadheading.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

PruningDeadheading.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

PruningDeadheading.schema = new SimpleSchema(
  {
    plantId: {
      type: String,
      defaultValue: "admin",
      label: "userId",
    },
    pruningPreference: {
      type: String,
      optional: true,
      label: "pruningPreference",
    },
    deadheadingPreference: {
      type: String,
      optional: true,
      label: "deadheadingPreference",
    },
    pruningSchedule: {
      type: Number,
      optional: true,
      label: "pruningSchedule",
    },
    deadheadingSchedule: {
      type: Number,
      optional: true,
      label: "deadheadingSchedule",
    },
    pruningTracker: {
      type: Array,
      optional: true,
      label: "pruningTracker",
    },
    "pruningTracker.$": {
      type: Object,
      label: "pruningTracker.$",
    },
    "pruningTracker.$.date": {
      type: Date,
      label: "pruningTracker.$.date",
    },
    deadheadingTracker: {
      type: Array,
      optional: true,
      label: "deadheadingTracker",
    },
    "deadheadingTracker.$": {
      type: Object,
      label: "deadheadingTracker.$",
    },
    "deadheadingTracker.$.date": {
      type: Date,
      label: "deadheadingTracker.$.date",
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

PruningDeadheading.attachSchema(PruningDeadheading.schema);

export default PruningDeadheading;
