export const UpdateTypes = {
  water: {
    waterEdit: "waterEdit",
    waterEditModal: "waterTracker",
    waterHistoryModal: "waterTracker-history",
  },
  fertilizer: {
    fertilizerEdit: "fertilizerEdit",
    fertilizerEditModal: "fertilizerTracker",
    fertilizerHistoryModal: "fertilizerTracker-history",
  },
  pruningDeadheading: {
    pruningDeadheadingEdit: "pruningDeadheadingEdit",
    pruningDeadheadingEditModal: "pruningDeadheadingTracker",
    pruningDeadheadingHistoryModal: "pruningDeadheadingTracker-history",
  },
  soilComp: {
    soilCompEdit: "soilCompositionTrackerEdit",
    soilCompEditModal: "soilCompositionTracker",
    soilCompHistoryModal: "soilCompositionTracker-history",
  },
  pest: {
    pestEdit: "pestEdit",
    pestEditModal: "pestTracker",
    pestHistoryModal: "pestTracker-history",
  },
  diary: {
    diaryEdit: "diaryEdit",
    diaryEditModal: "diaryTracker",
    diaryHistoryModal: "diaryTracker-history",
  },
  etc: {
    etcEdit: "etcEdit",
    etcEditModal: "etcTracker",
    etcHistoryModal: "etcTracker-history",
  },
  general: {
    dates: "dates",
  },
};

export const EditingType = {
  waterEditModal: UpdateTypes.water.waterEditModal,
  fertilizerEditModal: UpdateTypes.fertilizer.fertilizerEditModal,
  pruningDeadheadingEditModal:
    UpdateTypes.pruningDeadheading.pruningDeadheadingEditModal,
  soilCompEditModal: UpdateTypes.soilComp.soilCompEditModal,
  etcEditModal: UpdateTypes.etc.etcEditModal,
};
