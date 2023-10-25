//sample schema

import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const SoilComposition = new Mongo.Collection("SoilComposition");

SoilComposition.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

SoilComposition.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

SoilComposition.schema = new SimpleSchema(
  {
    plantId: {
      type: String,
      defaultValue: "admin", //TODO is this correct? check all the others too
      label: "userId",
    },
    tilled: {
      type: Boolean,
      optional: true,
      label: "tilled", //soil that's in the ground
    },
    soilType: {
      type: String,
      optional: true,
      label: "soilType", //soil that's in the ground
    },
    soilAmendment: {
      type: String,
      optional: true,
      label: "soilAmendment", //soil used in pots or in ground
    },
    soilRecipe: {
      type: String,
      optional: true,
      label: "soilAmmendment", //soil used in pots or in ground
    },
    soilCompositionTracker: {
      type: Array,
      optional: true,
      label: "soilCompositionTracker",
    },
    "soilCompositionTracker.$": {
      type: Object,
      label: "soilCompositionTracker.$",
    },
    "soilCompositionTracker.$.date": {
      type: Date,
      defaultValue: new Date(),
      optional: true,
      label: "soilCompositionTracker.$.date",
    },
    "soilCompositionTracker.$.ph": {
      type: Number,
      optional: true,
      label: "soilCompositionTracker.$.ph",
    },
    "soilCompositionTracker.$.moisture": {
      type: Number,
      optional: true,
      label: "soilCompositionTracker.$.moisture",
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

SoilComposition.attachSchema(SoilComposition.schema);

export default SoilComposition;
