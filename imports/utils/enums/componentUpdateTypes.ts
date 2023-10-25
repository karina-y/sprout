/**
 * the type of item/schema we're editing, the water panel, fertilizer panel, etc
 */
export enum TrackerEditingType {
  DIARY_EDIT = "diaryTracker-edit",
  ETC_EDIT = "etcTracker-edit",
  FERTILIZER_EDIT = "fertilizerTracker-edit",
  PEST_EDIT = "pestTracker-edit",
  PRUNING_DEADHEADING_EDIT = "pruningDeadheadingTracker-edit",
  SOIL_COMP_EDIT = "soilCompTracker-edit",
  WATER_EDIT = "waterTracker-edit",
}

/**
 * TODO
 */
export enum UpdateType {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
}

/**
 * what field in the plant schema is getting updated?
 */
export enum PlantDetailType {
  CATEGORY = "category",
  COMMON_NAME = "commonName",
  COMPANIONS = "companions",
  COMPOST = "compost",
  DATE_BOUGHT = "dateBought",
  DATE_PLANTED = "datePlanted",
  DEADHEADING_PREFERENCE = "deadheadingPreference",
  FERTILIZER = "fertilizer", //TODO do i need this? i think this is a mistake and i just want PREFERRED_FERTILIZER
  FERTILIZER_SCHEDULE = "fertilizerSchedule",
  DIARY = "diary",
  LATIN_NAME = "latinName",
  LIGHT_PREFERENCE = "lightPreference",
  LOCATION = "location",
  LOCATION_BOUGHT = "locationBought",
  NUTRIENT = "nutrient",
  PREFERRED_FERTILIZER = "preferredFertilizer",
  PRUNING_PREFERENCE = "pruningPreference",
  SOIL_AMENDMENT = "soilAmendment",
  SOIL_RECIPE = "soilRecipe",
  SOIL_TYPE = "soilType",
  TILLED = "tilled",
  TOXICITY = "toxicity",
  //TODO remove these when we stop using them
  WATER_PREFERENCE = "waterPreference",
  WATER_SCHEDULE = "waterSchedule",
  WATER_SCHEDULE_AUTO = "waterScheduleAuto",
}

/**
 * what field in the water schema is getting updated?
 */
export enum WaterDetailType {
  WATER_PREFERENCE = "waterPreference",
  WATER_SCHEDULE = "waterSchedule",
  WATER_SCHEDULE_AUTO = "waterScheduleAuto",
  WATER_TRACKER = "waterTracker",
}

/**
 * which tracker are we updated
 */
export enum TrackerType {
  DIARY_TRACKER = "diaryTracker",
  ETC_TRACKER = "etcTracker",
  FERTILIZER_TRACKER = "fertilizerTracker",
  PEST_TRACKER = "pestTracker",
  DEADHEADING_TRACKER = "deadheadingTracker",
  PRUNING_TRACKER = "pruningTracker",
  PRUNING_DEADHEADING_TRACKER = "pruningDeadheadingTracker",
  SOIL_COMP_TRACKER = "soilCompTracker",
  WATER_TRACKER = "waterTracker",
}

/**
 * which table's tracker are we editing?
 */
export enum TrackerDetailType {
  FERTILIZER = "fertilizer",
  PEST = "pest",
  PH = "ph",
  MOISTURE = "moisture",
  TREATMENT = "treatment",
}

export enum WaterUpdateType {
  WATER = "water",
  WATER_PREFERENCE = "waterPreference",
  WATER_SCHEDULE = "waterSchedule",
  WATER_SCHEDULE_AUTO = "waterScheduleAuto",
}

export enum FertilizerDetailType {
  COMPOST = "compost",
  FERTILIZER_SCHEDULE = "fertilizerSchedule",
  NUTRIENT = "nutrient",
  PREFERRED_FERTILIZER = "preferredFertilizer",
}

export enum SoilCompDetailType {
  MOISTURE = "moisture",
  PH = "ph",
  SOIL_TYPE = "soilType",
  SOIL_AMENDMENT = "soilAmendment",
  SOIL_RECIPE = "soilRecipe",
  TILLED = "tilled",
}

export enum PruningDeadheadingDetailType {
  DEADHEADING_PREFERENCE = "deadheadingPreference",
  PRUNING_PREFERENCE = "pruningPreference",
}

export enum SeedlingUpdateType {
  ACTUAL_HARVEST_DATE = "actualHarvestDate",
  CATEGORY = "category",
  COMMON_NAME = "commonName",
  DATE_BOUGHT = "dateBought",
  DATE_EXPIRES = "dateExpires",
  DAYS_TO_GERMINATE = "daysToGerminate",
  DAYS_TO_HARVEST = "daysToHarvest",
  EST_HARVEST_DATE = "estHarvestDate",
  LATIN_NAME = "latinName",
  LIGHT_PREFERENCE = "lightPreference",
  METHOD = "method",
  //TODO these two are the same as soilcompupdatetype.. extend it?
  MOISTURE = "moisture",
  PH = "ph",
  SEED_BRAND = "seedBrand",
  SOW_DATE = "sowDate",
  SPROUT_DATE = "sproutDate",
  START_DATE = "startDate",
  STARTED_INDOOR_OUTDOOR = "startedIndoorOutdoor",
  TILLED = "tilled",
  TRANSPLANT_DATE = "transplantDate",
  TRUE_LEAVES_DATE = "trueLeavesDate",
}
