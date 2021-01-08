import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-solid-svg-icons/faSadTear";
import { faMeh } from "@fortawesome/free-solid-svg-icons/faMeh";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { faSmile } from "@fortawesome/free-solid-svg-icons/faSmile";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";
import { withTracker } from "meteor/react-meteor-data";

const WaterReadEdit = (props) => {
  const { item, updateData, editingType } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">
        Water{" "}
        <FontAwesomeIcon
          icon={
            item.waterCondition === "needs-attn"
              ? faSadTear
              : item.waterCondition === "neutral"
              ? faMeh
              : item.waterCondition === "unsure"
              ? faQuestionCircle
              : faSmile
          }
          className="plant-condition-icon"
          title="water condition"
          alt={
            item.waterCondition === "needs-attn"
              ? "sad face with tear"
              : item.waterCondition === "neutral"
              ? "neutral face"
              : item.waterCondition === "unsure"
              ? "question mark"
              : "smiling face"
          }
        />
      </p>

      {editingType === "waterTracker" ? (
        <React.Fragment>
          <SwipePanelContent icon="schedule" iconTitle="water schedule">
            <p className="modern-input">
              Water every{" "}
              <input
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                className="small"
                onChange={(e) => updateData(e, "waterSchedule")}
                defaultValue={item.waterSchedule || ""}
              />{" "}
              days
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="water">
            <p className="modern-input">
              <label>watering preferences</label>
              <input
                type="text"
                placeholder="Watering Preferences"
                onChange={(e) => updateData(e, "waterPreference")}
                defaultValue={item.waterPreference || ""}
              />
            </p>
          </SwipePanelContent>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <SwipePanelContent icon="schedule" iconTitle="water schedule">
            <p>
              {item.waterSchedule != null
                ? `Water every ${item.waterSchedule} days`
                : "No schedule set"}
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="water" iconTitle="water preference">
            <p>{item.waterPreference}</p>
          </SwipePanelContent>
        </React.Fragment>
      )}
    </div>
  );
};

WaterReadEdit.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editingType: PropTypes.string,
};

export default withTracker(() => {
  const editingType = Session.get("editingType");

  return {
    editingType,
  };
})(WaterReadEdit);
