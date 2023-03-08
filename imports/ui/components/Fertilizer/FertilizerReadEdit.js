import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { UpdateTypes } from "@constant";
import { withTracker } from "meteor/react-meteor-data";

const FertilizerReadEdit = (props) => {
  const { editingType, editing, item, updateData, fertilizerContent } = props;

  //todo why do i have 2 checks for editing?
  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Fertilizer</p>

      <SwipePanelContent
        icon="schedule"
        iconTitle="fertilizer schedule"
        additionalOuterClasses={
          editingType !== "fertilizerTracker" ? "top-align" : ""
        }
      >
        {editing ? (
          <p className="modern-input">
            Fertilize every{" "}
            <input
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              className="small"
              onChange={(e) => updateData(e, "fertilizerSchedule")}
              defaultValue={item.fertilizerSchedule || ""}
            />{" "}
            days
          </p>
        ) : item.fertilizerSchedule && item.daysSinceFertilized ? (
          <React.Fragment>
            <p>Fertilize every {item.fertilizerSchedule} days</p>
            <p>
              Due in {item.fertilizerSchedule - item.daysSinceFertilized} days
            </p>
          </React.Fragment>
        ) : (
          <p>No schedule set</p>
        )}
      </SwipePanelContent>

      {editing ? (
        <SwipePanelContent icon="fertilizer">
          <p className="modern-input">
            <label>preferred fertilizer</label>
            <input
              type="text"
              onChange={(e) => updateData(e, "fertilizer")}
              defaultValue={item.fertilizer || ""}
            />
          </p>
        </SwipePanelContent>
      ) : (
        (item.fertilizer || fertilizerContent) && (
          <SwipePanelContent icon="fertilizer">
            <p>{item.fertilizer || fertilizerContent}</p>
          </SwipePanelContent>
        )
      )}
    </div>
  );
};

FertilizerReadEdit.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string.isRequired,
  editingType: PropTypes.string,
  editing: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const editingType = Session.get("editingType");
  const editing = editingType === UpdateTypes.fertilizer.fertilizerEditModal;

  return {
    editingType,
    editing,
  };
})(FertilizerReadEdit);
