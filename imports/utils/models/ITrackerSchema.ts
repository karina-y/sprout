//TODO fix up the schemas and models with these, maybe move into a shared models folder?
export interface ITrackerSchema {
  date: Date;
}

//TODO diff between this and SoilCompositionTrackerSchema?
export interface ISoilCompositionTrackerSchema extends ITrackerSchema {
  ph: number;
  moisture: number;
}

export interface IFertilizerTrackerSchema extends ITrackerSchema {
  fertilizer: string;
}

export interface IPestTrackerSchema extends ITrackerSchema {
  pest: string;
  treatment: string;
}

export interface IPruningDeadheadingTrackerSchema extends ITrackerSchema {
  action: "Pruned" | "Deadheaded"; //TODO enum these
}
