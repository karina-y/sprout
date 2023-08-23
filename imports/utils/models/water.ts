//export types
export type PlantSchema = {
  userId: string;
  commonName: string;
  latinName: string;
  category: string;
  datePlanted: Date;
  dateBought: Date;
  location: string;
  locationBought: string;
  companions: Array<string>;
  image: string;
  lightPreference: string;
  toxicity: string;
  createdAt: Date;
  updatedAt: Date;
};
