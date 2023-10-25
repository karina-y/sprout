//what modal are we opening?
export enum ModalId {
  DATES = "dates",
  DELETE = "delete",

  DIARY_TRACKER = "diaryTracker",
  DIARY_TRACKER_HISTORY = "diaryTracker-history",

  ETC = "etc",
  ETC_TRACKER = "etcTracker",
  ETC_TRACKER_HISTORY = "etcTracker-history",

  FERTILIZER_TRACKER = "fertilizerTracker",
  FERTILIZER_TRACKER_HISTORY = "fertilizerTracker-history",

  PEST_TRACKER = "pestTracker",
  PEST_TRACKER_HISTORY = "pestTracker-history",

  PRUNING_DEADHEADING_TRACKER = "pruningDeadheadingTracker",
  PRUNING_DEADHEADING_TRACKER_HISTORY = "pruningDeadheadingTracker-history",

  SOIL_COMP_TRACKER = "soilCompTracker",
  SOIL_COMP_TRACKER_HISTORY = "soilCompTracker-history",

  WATER_TRACKER = "waterTracker",
  WATER_TRACKER_HISTORY = "waterTracker-history",
}

export enum ModalActions {
  CANCEL = "cancel",
  EDIT = "edit",
}
