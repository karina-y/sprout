//export types
export type Tracker = {
  date: Date;
};

export type SoilCompositionTracker = Tracker & {
  ph: number;
  moisture: number;
};

export type FertilizerTracker = Tracker & {
  fertilizer: string;
};

export type PestTracker = Tracker & {
  pest: string;
  treatment: string;
};
