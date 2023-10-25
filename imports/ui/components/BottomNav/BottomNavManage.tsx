import React, { ComponentClass } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Session } from "meteor/session";
import "./BottomNav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons/faPencilAlt";
import { faSave } from "@fortawesome/free-solid-svg-icons/faSave";
import { ModalActions, ModalId } from "@enum/modalEnums";

interface IBottomNavManageProps {
  exitEditMode: () => void;
  editingType?: ModalId; //TODO modify this to EditingTypes eventually
  type: "plant" | "seedling"; //TODO enums?
  swipeViewIndex: number;
}

//TODO why is this a class and some of my others aren't?
const BottomNavManage = (props: IBottomNavManageProps) => {
  const { exitEditMode, editingType, swipeViewIndex } = props;

  //TODO confirm this works when things are updated/clicked
  const isEditing = !!editingType;

  /**
   * this sets a session var to let the ReadEdit components know which one of them should be active
   * ie are we editing the Water? the Fertilizer? etc
   */
  const handleEditPlant = () => {
    console.log("kytodo handleEditPlant() ", {
      swipeViewIndex,
    });

    let modalId;

    //selecting which swipe view to edit
    switch (swipeViewIndex) {
      case 0:
        modalId = ModalId.WATER_TRACKER;
        break;
      case 1:
        modalId = ModalId.FERTILIZER_TRACKER;
        break;
      case 2:
        modalId = ModalId.PRUNING_DEADHEADING_TRACKER;
        break;
      case 3:
        modalId = ModalId.SOIL_COMP_TRACKER;
        break;
      case 6:
        modalId = ModalId.ETC_TRACKER;
        break;
    }

    Session.set("editingType", modalId);
  };

  //TODO
  /* const handleEditSeedling = () => {
    let modalId;

    //selecting which swipe view to edit
    switch (swipeViewIndex) {
      case 0:
        modalId = ModalId.DATES;
        break;
      case 1:
        modalId = ModalId.WATER_EDIT;
        break;
      case 2:
        modalId = ModalId.FERTILIZER_EDIT;
        break;
      case 3:
        modalId = ModalId.SOIL_COMP_EDIT;
        break;
      case 6:
        modalId = ModalId.ETC_EDIT;
        break;
    }

    Session.set("editingType", modalId);
  };*/

  /**
   * this sets a session var to identify which modal needs to be open
   * ie ModalId.WATER_EDIT to add a watering entry and ModalId.WATER_HISTORY to view the watering history
   * @param isHistoryModal
   */
  const handleOpenPlantModal = (isHistoryModal: boolean) => {
    console.log("kytodo handleOpenPlantModal() ", {
      isHistoryModal,
      swipeViewIndex,
    });

    let modalId;

    //selecting which modal to open, see water as an example
    //TODO swap these out for ModalId enums
    switch (swipeViewIndex) {
      case 0:
        modalId = isHistoryModal
          ? ModalId.WATER_TRACKER_HISTORY
          : ModalId.WATER_TRACKER;
        break;
      case 1:
        modalId = isHistoryModal
          ? ModalId.FERTILIZER_TRACKER_HISTORY
          : ModalId.FERTILIZER_TRACKER;
        break;
      case 2:
        modalId = isHistoryModal
          ? ModalId.PRUNING_DEADHEADING_TRACKER_HISTORY
          : ModalId.PRUNING_DEADHEADING_TRACKER;
        break;
      case 3:
        modalId = isHistoryModal
          ? ModalId.SOIL_COMP_TRACKER_HISTORY
          : ModalId.SOIL_COMP_TRACKER;
        break;
      case 4:
        modalId = isHistoryModal
          ? ModalId.PEST_TRACKER_HISTORY
          : ModalId.PEST_TRACKER;
        break;
      case 5:
        modalId = isHistoryModal
          ? ModalId.DIARY_TRACKER_HISTORY
          : ModalId.DIARY_TRACKER;
        break;
    }

    Session.set("activeModalId", modalId);
  };

  /*
  TODO
  const handleOpenSeedlingModal = (isHistoryModal: boolean) => {
    let modal;

    //selecting which modal to open
    switch (swipeViewIndex) {
      case 1:
        modal = isHistoryModal
          ? UpdateTypes.water.waterHistoryModal
          : UpdateTypes.water.waterEditModal;
        break;
      case 2:
        modal = isHistoryModal
          ? UpdateTypes.fertilizer.fertilizerHistoryModal
          : UpdateTypes.fertilizer.fertilizerEditModal;
        break;
      case 3:
        modal = isHistoryModal
          ? UpdateTypes.soilComp.soilCompHistoryModal
          : UpdateTypes.soilComp.soilCompEditModal;
        break;
      case 4:
        modal = isHistoryModal
          ? UpdateTypes.pest.pestHistoryModal
          : UpdateTypes.pest.pestEditModal;
        break;
      case 5:
        modal = isHistoryModal
          ? UpdateTypes.diary.diaryHistoryModal
          : UpdateTypes.diary.diaryEditModal;
        break;
    }

    Session.set("activeModalId", modal);
  };*/
  /*
  const showAddAndCalendar =
    type === "plant" ? swipeViewIndex < 6 : swipeViewIndex < 5;
  const showDeleteAndSave =
    type === "plant"
      ? swipeViewIndex < 4 || swipeViewIndex > 5
      : swipeViewIndex < 3 || swipeViewIndex > 4;
*/

  const showAddAndCalendar = swipeViewIndex < 6;
  const showDeleteAndSave = swipeViewIndex < 4 || swipeViewIndex > 5;

  return (
    <div className="BottomNav add-data flex-around">
      <FontAwesomeIcon
        icon={faTrash}
        className="plant-condition-icon"
        title="delete"
        onClick={() => Session.set("activeModalId", "delete")}
      />

      {showAddAndCalendar && (
        <React.Fragment>
          <FontAwesomeIcon
            icon={faPlus}
            className="plant-condition-icon"
            title="add"
            onClick={() => handleOpenPlantModal(false)}
          />

          {!editingType && (
            <FontAwesomeIcon
              icon={faCalendar}
              className="plant-condition-icon"
              title="view history"
              onClick={() => handleOpenPlantModal(true)}
            />
          )}
        </React.Fragment>
      )}

      {showDeleteAndSave ? (
        <React.Fragment>
          <FontAwesomeIcon
            icon={isEditing ? faTimes : faPencilAlt}
            className="plant-condition-icon"
            title={isEditing ? ModalActions.CANCEL : ModalActions.EDIT}
            onClick={() => (isEditing ? exitEditMode() : handleEditPlant())}
          />

          {editingType && (
            <FontAwesomeIcon
              icon={faSave}
              className="plant-condition-icon"
              title="save"
              /* TODO set enums for savingType too */
              onClick={() => Session.set("savingType", `${editingType}-edit`)}
            />
          )}
        </React.Fragment>
      ) : (
        ""
      )}
    </div>
  );
};

BottomNavManage.propTypes = {
  exitEditMode: PropTypes.func.isRequired,
  editingType: PropTypes.string,
  type: PropTypes.string.isRequired,
  swipeViewIndex: PropTypes.number.isRequired,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const editingType = Session.get("editingType");

  return {
    editingType,
  } as IBottomNavManageProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(BottomNavManage) as ComponentClass<IBottomNavManageProps, any>;
