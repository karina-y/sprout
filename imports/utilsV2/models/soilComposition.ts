import { Categories } from "@enumV2/categories";

export type CategorySchema = {
  _id?: string;
  category: Categories;
  displayName: string; //TODO make enums or constants for the displayNames? and add them here
  createdAt: Date;
  updatedAt: Date;
};
