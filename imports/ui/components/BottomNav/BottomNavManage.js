import React from "react";
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
import { UpdateTypes } from "@constant";

const BottomNavManage = (props) => {
  const { exitEditMode, editingType, swipeViewIndex, type } = props;

  const handleEditPlant = () => {
    let editing;

    //selecting which swipe view to edit
    switch (swipeViewIndex) {
      case 0:
        editing = UpdateTypes.water.waterEditModal;
        break;
      case 1:
        editing = UpdateTypes.fertilizer.fertilizerEditModal;
        break;
      case 2:
        editing = UpdateTypes.pruningDeadheading.pruningDeadheadingEditModal;
        break;
      case 3:
        editing = UpdateTypes.soilComp.soilCompEditModal;
        break;
      case 6:
        editing = UpdateTypes.etc.etcEditModal;
        break;
    }

    Session.set("editingType", editing);
  };

  const handleEditSeedling = () => {
    let editing;

    //selecting which swipe view to edit
    switch (swipeViewIndex) {
      case 0:
        editing = UpdateTypes.general.dates;
        break;
      case 1:
        editing = UpdateTypes.water.waterEditModal;
        break;
      case 2:
        editing = UpdateTypes.fertilizer.fertilizerEditModal;
        break;
      case 3:
        editing = UpdateTypes.soilComp.soilCompEditModal;
        break;
      case 6:
        editing = UpdateTypes.etc.etcEditModal;
        break;
    }

    Session.set("editingType", editing);
  };

  const handleOpenPlantModal = (isHistoryModal) => {
    let modal;

    //selecting which modal to open
    switch (swipeViewIndex) {
      case 0:
        modal = UpdateTypes.water.waterEditModal;
        break;
      case 1:
        modal = UpdateTypes.fertilizer.fertilizerEditModal;
        break;
      case 2:
        modal = UpdateTypes.pruningDeadheading.pruningDeadheadingEditModal;
        break;
      case 3:
        modal = UpdateTypes.soilComp.soilCompEditModal;
        break;
      case 4:
        modal = UpdateTypes.pest.pestEditModal;
        break;
      case 5:
        modal = UpdateTypes.diary.diaryEditModal;
        break;
    }

    if (isHistoryModal) {
      modal += "-history";
    }

    Session.set("modalOpen", modal);
  };

  const handleOpenSeedlingModal = (isHistoryModal) => {
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

    Session.set("modalOpen", modal);
  };

  const showAddAndCalendar =
    type === "plant" ? swipeViewIndex < 6 : swipeViewIndex < 5;
  const showDeleteAndSave =
    type === "plant"
      ? swipeViewIndex < 4 || swipeViewIndex > 5
      : swipeViewIndex < 3 || swipeViewIndex > 4;

  return (
    <div className="BottomNav add-data flex-around">
      <FontAwesomeIcon
        icon={faTrash}
        className="plant-condition-icon"
        alt="trash"
        title="delete"
        onClick={() => Session.set("modalOpen", "delete")}
      />

      {showAddAndCalendar && (
        <React.Fragment>
          <FontAwesomeIcon
            icon={faPlus}
            className="plant-condition-icon"
            alt="plus"
            title="add"
            onClick={() =>
              type === "plant"
                ? handleOpenPlantModal(false)
                : handleOpenSeedlingModal(false)
            }
          />

          {!editingType && (
            <FontAwesomeIcon
              icon={faCalendar}
              className="plant-condition-icon"
              alt={"calendar"}
              title="view history"
              onClick={() =>
                type === "plant"
                  ? handleOpenPlantModal(true)
                  : handleOpenSeedlingModal(true)
              }
            />
          )}
        </React.Fragment>
      )}

      {showDeleteAndSave ? (
        <React.Fragment>
          <FontAwesomeIcon
            icon={editingType ? faTimes : faPencilAlt}
            className="plant-condition-icon"
            alt={editingType ? "times" : "pencil"}
            title={editingType ? "cancel" : "edit"}
            onClick={() =>
              editingType
                ? exitEditMode()
                : type === "plant"
                ? handleEditPlant()
                : handleEditSeedling()
            }
          />

          {editingType && (
            <FontAwesomeIcon
              icon={faSave}
              className="plant-condition-icon"
              alt="floppy disk"
              title="save"
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
};

export default withTracker(() => {
  const editingType = Session.get("editingType");

  return {
    editingType,
  };
})(BottomNavManage);
