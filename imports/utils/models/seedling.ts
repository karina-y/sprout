//TODO this is an older version of the style, plant has it right, it's al separated and connected by plantId, in this case seedlingId
export interface ISeedlingSchema {
  _id?: string;
  userId: string;
  commonName: string;
  latinName: string;
  category: string;
  seedBrand?: string;
  dateExpires?: Date;
  method: string;
  startedIndoorOutdoor: string; // ["indoor", "outdoor"],
  sowDate?: Date;
  sproutDate?: Date;
  trueLeavesDate?: Date;
  daysToGerminate?: number;
  transplantDate?: Date;
  startDate?: Date;
  daysToHarvest?: number;
  estHarvestDate?: Date;
  actualHarvestDate?: Date;
  diary?: Array<SeedlingDiarySchema>;
  image: string;
  compost?: string;
  nutrient?: string;
  fertilizer?: string;
  fertilizerSchedule?: number;
  waterSchedule?: number;
  waterScheduleAuto: boolean;
  waterPreference: string;
  lightPreference: string;
  fertilizerTracker?: Array<FertilizerTrackerSchema>;
  waterTracker?: Array<WaterTrackerSchema>;
  pestTracker?: Array<PestTrackerSchema>;
  fungusTracker?: Array<FungusTrackerSchema>;
  tilled?: boolean;
  soilType?: string;
  soilAmendment?: string;
  soilRecipe?: string;
  soilCompositionTracker?: Array<SoilCompositionTrackerSchema>;
  createdAt: Date;
  updatedAt: Date;
}

export type SeedlingDiarySchema = {
  date: Date;
  entry: string;
};

//TODO is this going to be shared?
export type FertilizerTrackerSchema = {
  date: Date;
  fertilizer: string;
};

//TODO is this going to be shared?
export type WaterTrackerSchema = {
  date: Date;
};

export type PestTrackerSchema = {
  date: Date;
  pest?: string;
  treatment?: string;
};

export type FungusTrackerSchema = {
  date: Date;
  pest?: string;
  treatment?: string;
};

export type SoilCompositionTrackerSchema = {
  date: Date;
  ph?: number;
  moisture?: number;
};
