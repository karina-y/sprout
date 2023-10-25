import { IPestTrackerSchema } from "@model/ITrackerSchema";

export interface IPestSchema {
  _id?: string;
  plantId: string;
  pestTracker?: Array<IPestTrackerSchema>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPestStats {
  highlightDates: Array<Date>;
}
