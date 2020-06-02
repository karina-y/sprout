const PlantCatalogueEnums = { };

//these are strings instead of ints because of the way meteor roles works
const TRACKER_TYPE_ENUM = {
  'water': { displayName: "water", propertyName: "waterTracker" },
  'fertilizer': { displayName: "fertilizer", propertyName: "fertilizerTracker" },
  'pest': { displayName: "pest", propertyName: "pestTracker" },
  'ph': { displayName: "ph", propertyName: "soilCompositionTracker" },
  'moisture': { displayName: "moisture", propertyName: "soilCompositionTracker" }
};

PlantCatalogueEnums.TRACKER_TYPE_ENUM = TRACKER_TYPE_ENUM;

export default PlantCatalogueEnums;
