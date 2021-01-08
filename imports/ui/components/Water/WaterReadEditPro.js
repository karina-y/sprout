import React from "react";
import PropTypes from "prop-types";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";
import UpdateTypes from "/imports/utils/constants/updateTypes";
import { withTracker } from "meteor/react-meteor-data";
import {
  getDaysSinceAction,
  getHighlightDates,
  getPlantCondition,
  sortByLastDate,
} from "../../../utils/helpers/plantData";

const WaterReadEditPro = (props) => {
  const { item, updateData, editingType } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">
        Water
        {/*<FontAwesomeIcon
				  icon={item.waterCondition === 'needs-attn' ? faSadTear : item.waterCondition === 'neutral' ? faMeh : item.waterCondition === 'unsure' ? faQuestionCircle : faSmile}
				  className="plant-condition-icon"
				  title="water condition"
				  alt={item.waterCondition === 'needs-attn' ? 'sad face with tear' : item.waterCondition === 'neutral' ? 'neutral face' : item.waterCondition === 'unsure' ? 'question mark' : 'smiling face'}/>*/}
      </p>

      {editingType === UpdateTypes.water.waterEditModal ? (
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

          <SwipePanelContent
            icon="waterAuto"
            iconTitle="automatic water schedule"
          >
            <p>
              <label>
                <input
                  type="checkbox"
                  className="small-checkbox"
                  onChange={(e) => updateData(e, "waterScheduleAuto")}
                  defaultChecked={item.waterScheduleAuto || false}
                />
                Automatic watering
              </label>
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="water">
            <p className="modern-input">
              <label>watering preferences</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "waterPreference")}
                defaultValue={item.waterPreference || ""}
              />
            </p>
          </SwipePanelContent>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <SwipePanelContent
            icon="schedule"
            iconTitle="water schedule"
            additionalOuterClasses={!item.waterScheduleAuto ? "top-align" : ""}
          >
            <p>
              {item.waterSchedule != null
                ? `Water every ${item.waterSchedule} days`
                : "No schedule set"}
            </p>
            {!item.waterScheduleAuto &&
            item.waterSchedule != null &&
            item.daysSinceWatered != null ? (
              <p>
                Due in {item.waterSchedule - item.daysSinceWatered - 1} days
              </p>
            ) : (
              ""
            )}
          </SwipePanelContent>

          {item.waterScheduleAuto && (
            <SwipePanelContent
              icon="waterAuto"
              iconTitle="automatic water schedule"
            >
              <p>Watering is automated</p>
            </SwipePanelContent>
          )}

          <SwipePanelContent icon="water" iconTitle="water preference">
            <p>{item.waterPreference}</p>
          </SwipePanelContent>
        </React.Fragment>
      )}
    </div>
  );
};

WaterReadEditPro.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editingType: PropTypes.string,
};

export default withTracker(() => {
  const editingType = Session.get("editingType");

  return {
    editingType,
  };
})(WaterReadEditPro);
