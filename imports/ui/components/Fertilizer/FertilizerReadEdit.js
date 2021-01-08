import React from "react";
import PropTypes from "prop-types";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";
import UpdateTypes from "/imports/utils/constants/updateTypes";
import { withTracker } from "meteor/react-meteor-data";

const FertilizerReadEdit = (props) => {
  const { editingType, item, updateData, fertilizerContent } = props;

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
        {editingType === UpdateTypes.fertilizer.fertilizerEditModal ? (
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
              Due in {item.fertilizerSchedule - item.daysSinceFertilized - 1}{" "}
              days
            </p>
          </React.Fragment>
        ) : (
          <p>No schedule set</p>
        )}
      </SwipePanelContent>

      {editingType === UpdateTypes.fertilizer.fertilizerEditModal ? (
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
};

export default withTracker(() => {
  const editingType = Session.get("editingType");

  return {
    editingType,
  };
})(FertilizerReadEdit);
