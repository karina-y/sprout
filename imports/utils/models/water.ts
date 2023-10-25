export interface IWaterSchema {
  _id?: string;
  plantId: string;
  waterSchedule?: number;
  waterScheduleAuto?: boolean;
  waterPreference: string; //TODO confirm this and others shouldn't have some enums
  waterTracker?: Array<IWaterTrackerSchema>; //TODO i forget what's in here
  createdAt: Date;
  updatedAt: Date;
}

export interface IWaterTrackerSchema {
  date: Date;
}

//normal account
export interface IWaterStats {
  daysSinceWatered: number;
  waterProgress: number;
  waterCondition: string; //TODO enum this shizzz
  highlightDates: Array<Date>;
}

//pro account
export interface IWaterStatsPro extends IWaterStats {
  waterSchedule: number;
  water: string; //preferred water
  compost: string;
  nutrient: string;
}
