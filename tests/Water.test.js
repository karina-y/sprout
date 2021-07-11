import logger from "../imports/utils/helpers/logger";
import SimpleSchema from "simpl-schema";
import Water from "../imports/api/Water/Water";
import { water } from "./db/db";

//validate data models
it("validate model - water", () => {
  let waterDb = water;
  delete waterDb._id;

  const validationContext = new SimpleSchema(Water.schema).newContext();
  validationContext.validate(waterDb);
  if (!validationContext.isValid()) {
    logger(
      "danger",
      "Validation failed",
      JSON.stringify(validationContext.validationErrors(), null, 4)
    );
  }

  expect(validationContext.isValid()).toBe(true);
});

/*

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const addFoo = new ValidatedMethod({
  name: 'Foo.add',
  validate: new SimpleSchema({
    bar: { type: String },
  }).validator(),
  run(bar) {
    console.log('foo', bar);
  },
});


/////////////////////////////////////


import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { addFoo } from '../imports/api/foo/methods';

describe('demo', () => {
  it('should add foo', () => {
    expect(ValidatedMethod).toHaveBeenCalledWith({
      name: 'Foo.add',
      run: jasmine.any(Function),
      validate: undefined,
    });
  });
});

*/
