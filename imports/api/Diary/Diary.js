//sample schema

import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Diary = new Mongo.Collection("Diary");

Diary.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Diary.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Diary.schema = new SimpleSchema(
  {
    plantId: {
      type: String,
      defaultValue: "admin",
      label: "userId",
    },
    diary: {
      type: Array,
      optional: true,
      label: "diary",
    },
    "diary.$": {
      type: Object,
      label: "diary.$",
    },
    "diary.$.date": {
      type: Date,
      label: "diary.$.date",
    },
    "diary.$.entry": {
      type: String,
      defaultValue: "",
      label: "diary.$.entry",
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
  },
);

Diary.attachSchema(Diary.schema);

export default Diary;
