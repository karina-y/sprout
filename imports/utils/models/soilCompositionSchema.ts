import { ISoilCompositionTrackerSchema } from "@model/ITrackerSchema";

export interface ISoilCompositionSchema {
  _id?: string;
  plantId: string;
  tilled?: boolean;
  soilType?: string;
  soilAmendment?: string;
  soilRecipe?: string;
  soilCompositionTracker?: Array<ISoilCompositionTrackerSchema>;
  createdAt: Date;
  updatedAt: Date;
}

//normal account
export interface ISoilCompositionStats {
  soilCompLastChecked: string;
  soilPh: number;
  soilMoisture: string;
  highlightDates: Array<Date>;
}
