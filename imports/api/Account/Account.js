//sample schema

import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
// import AccountPreferencesEnums from '../../utils/enums';

// const AccountPreferencesEnums = AccountPreferencesEnums.ITEM_ENUM;
const AccountPreferences = new Mongo.Collection("AccountPreferences");

AccountPreferences.deny({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

AccountPreferences.schema = new SimpleSchema(
  {
    _id: {
      type: String,
      label: "_id",
    },
    email: {
      type: String,
      label: "email",
    },
    profile: {
      type: Object,
      label: "profile",
    },
    "profile.name": {
      type: String,
      label: "profile.name",
    },
    "profile.zip": {
      type: String,
      optional: true,
      label: "profile.zip",
    },
    /*emails: {
			type: Array,
			label: 'emails'
		  },
		  'emails.$': {
			type: Object,
			label: 'emails.$'
		  },
		  'emails.$.address': {
			type: String,
			label: 'emails.$.address'
		  },
		  'emails.$.verified': {
			type: Boolean,
			label: 'emails.$.verified'
		  },*/
    password: {
      type: String,
      label: "password",
    },
    services: {
      type: Object,
      optional: true,
      blackbox: true,
      label: "services",
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

AccountPreferences.attachSchema(AccountPreferences.schema);

export default AccountPreferences;
