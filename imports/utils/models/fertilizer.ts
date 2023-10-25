import { IFertilizerTrackerSchema } from "@model/ITrackerSchema";

export interface IFertilizerSchema {
  _id?: string;
  plantId: string;
  compost?: string;
  nutrient?: string;
  preferredFertilizer?: string;
  fertilizerSchedule?: number;
  fertilizerTracker?: Array<IFertilizerTrackerSchema>; //TODO other schema models are defining this stuff within their own file, not pulling from elsewhere.. do the same thing in those as i'm doing here
  createdAt: Date;
  updatedAt: Date;
}

//normal account
export interface IFertilizerStats {
  daysSinceFertilized: number;
  fertilizerProgress: number;
  fertilizerCondition: string; //TODO enum this shizzz
  highlightDates: Array<Date>;
}

//pro account
export interface IFertilizerStatsPro extends IFertilizerStats {
  fertilizerSchedule: number;
  fertilizer: string; //preferred fertilizer
  compost: string;
  nutrient: string;
}
