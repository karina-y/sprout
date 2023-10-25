import { Categories } from "@enum/categories";

export interface ICategorySchema {
  _id?: string;
  category: Categories;
  displayName: string; //TODO make enums or constants for the displayNames? and add them here
  createdAt: Date;
  updatedAt: Date;
}
