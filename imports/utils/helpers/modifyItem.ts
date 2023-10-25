//KYTODO enum the methods?
import { Meteor } from "meteor/meteor";
import { toast } from "react-toastify";

export const updateOrEditItem = (
  methodName: string,
  type: string,
  plantId: string,
  newData: any,
  oldData: any,
): void => {
  console.log("kytodo updateOrEditItem()", { newData, oldData });
  newData._id = oldData._id;

  //TODO will want to do this with all plant properties
  //check if we have an id, if not, there's no fertilizer item associated with this plant yet
  if (newData._id) {
    Meteor.call(`${methodName}.update`, type, newData, (err: Meteor.Error) => {
      if (err) {
        toast.error(err.message);
      } else {
        toast.success("Successfully saved new entry.");
      }
    });
  } else {
    Meteor.call(
      `${methodName}.insert`,
      plantId,
      newData,
      (err: Meteor.Error) => {
        if (err) {
          toast.error(err.message);
        } else {
          toast.success("Successfully saved new entry.");
        }
      },
    );
  }
};
