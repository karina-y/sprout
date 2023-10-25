import { Categories } from "@enum";

export interface IPlantSchema {
  _id: string;
  userId?: string;
  commonName: string;
  latinName: string;
  category: Categories;
  datePlanted: Date;
  dateBought: Date;
  location: string;
  locationBought: string;
  companions: Array<string>;
  image?: string;
  lightPreference: string;
  toxicity: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlantStats {
  attentionNeeded: {
    water: boolean;
    fertilizer: boolean;
    pruning: boolean;
    deadheading: boolean;
  };
  condition: string;
}
