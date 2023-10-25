export type WaterSchema = {
  plantId: string;
  waterSchedule?: number;
  waterScheduleAuto?: boolean;
  waterPreference: string; //TODO confirm this and others shouldn't have some enums
  waterTracker?: Array<WaterTracker>; //TODO i forget what's in here
  createdAt: Date;
  updatedAt: Date;
};

export type WaterTracker = {
  date: Date;
};
