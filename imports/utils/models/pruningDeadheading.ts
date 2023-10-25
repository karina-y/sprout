import { IPruningDeadheadingTrackerSchema } from "@model/ITrackerSchema";

export interface IPruningDeadheadingSchema {
  _id?: string;
  plantId: string;
  pruningPreference?: string;
  deadheadingPreference?: string;
  pruningSchedule?: number;
  pruningTracker?: Array<IPruningDeadheadingTrackerSchema>;
  deadheadingTracker?: Array<IPruningDeadheadingTrackerSchema>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPruningDeadheadingStats {
  pruningDeadheadingTracker: Array<IPruningDeadheadingTrackerSchema>;
  highlightDates: Array<Date>;
}
