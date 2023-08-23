export type SeedlingSchema = {
  userId: string;
  commonName: string;
  latinName: string;
  category: string;
  seedBrand?: string;
  dateExpires?: Date;
  method: string;
  startedIndoorOutdoor: string; // ["indoor", "outdoor"],
  sowDate?: string;
  sproutDate?: Date;
  trueLeavesDate?: Date;
  daysToGerminate?: string;
  transplantDate?: Date;
  daysToHarvest?: string;
  estHarvestDate?: Date;
  actualHarvestDate?: Date;
  diary?: Array<DiarySchema>;
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
};

export type DiarySchema = {
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
