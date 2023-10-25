import { ModalId } from "@enum/modalEnums";

export const UpdateTypesDep = {
  water: {
    waterEdit: "waterEdit",
    waterEditModal: ModalId.WATER_TRACKER,
    waterHistoryModal: ModalId.WATER_TRACKER_HISTORY,
  },
  fertilizer: {
    fertilizerEdit: "fertilizerEdit",
    fertilizerEditModal: ModalId.FERTILIZER_TRACKER,
    fertilizerHistoryModal: ModalId.FERTILIZER_TRACKER_HISTORY,
  },
  pruningDeadheading: {
    pruningDeadheadingEdit: "pruningDeadheadingEdit",
    pruningDeadheadingEditModal: ModalId.PRUNING_DEADHEADING_TRACKER,
    pruningDeadheadingHistoryModal: ModalId.PRUNING_DEADHEADING_TRACKER_HISTORY,
  },
  soilComp: {
    soilCompEdit: "soilCompositionTrackerEdit",
    soilCompEditModal: ModalId.SOIL_COMP_TRACKER,
    soilCompHistoryModal: ModalId.SOIL_COMP_TRACKER_HISTORY,
  },
  pest: {
    pestEdit: "pestEdit",
    pestEditModal: ModalId.PEST_TRACKER,
    pestHistoryModal: ModalId.PEST_TRACKER_HISTORY,
  },
  diary: {
    diaryEdit: "diaryEdit",
    diaryEditModal: ModalId.DIARY_TRACKER,
    diaryHistoryModal: ModalId.DIARY_TRACKER_HISTORY,
  },
  etc: {
    etcEdit: "etcEdit",
    etcEditModal: ModalId.ETC_TRACKER,
    etcHistoryModal: ModalId.ETC_TRACKER_HISTORY,
  },
  general: {
    dates: "dates",
  },
};

//TODO what was i doing here? do i want the activeModalId enums even?
export const EditingTypeDep = {
  waterEditModal: ModalId.WATER_TRACKER,
  fertilizerEditModal: ModalId.FERTILIZER_TRACKER,
  pruningDeadheadingEditModal: ModalId.PRUNING_DEADHEADING_TRACKER,
  soilCompEditModal: ModalId.SOIL_COMP_TRACKER,
  etcEditModal: ModalId.ETC_TRACKER,
};
