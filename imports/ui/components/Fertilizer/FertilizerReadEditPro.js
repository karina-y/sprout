import React from "react";
import PropTypes from "prop-types";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";
import UpdateTypes from "/imports/utils/constants/updateTypes";
import { withTracker } from "meteor/react-meteor-data";

const FertilizerReadEditPro = (props) => {
  const { editing, item, updateData, fertilizerContent } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Fertilizer - Nutrients</p>

      {editing ? (
        <React.Fragment>
          <SwipePanelContent icon="schedule" iconTitle="fertilizer schedule">
            <p className="modern-input">
              Feed every{" "}
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
          </SwipePanelContent>

          <SwipePanelContent icon="fertilizer">
            <p className="modern-input">
              <label>preferred fertilizer</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "preferredFertilizer")}
                defaultValue={item.preferredFertilizer || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="compost">
            <p className="modern-input">
              <label>compost</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "compost")}
                defaultValue={item.compost || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="nutrients">
            <p className="modern-input">
              <label>other nutrient amendment</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "nutrient")}
                defaultValue={item.nutrient || ""}
              />
            </p>
          </SwipePanelContent>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <SwipePanelContent
            icon="schedule"
            iconTitle="fertilizer schedule"
            additionalOuterClasses="top-align"
          >
            <p>
              {item.fertilizerSchedule != null
                ? `Feed every ${item.fertilizerSchedule} days`
                : "No schedule set"}
            </p>
            {item.fertilizerSchedule != null &&
            item.daysSinceFertilized != null ? (
              <p>
                Due in {item.fertilizerSchedule - item.daysSinceFertilized - 1}{" "}
                days
              </p>
            ) : (
              ""
            )}
          </SwipePanelContent>

          <React.Fragment>
            {(item.fertilizer || fertilizerContent) && (
              <SwipePanelContent icon="fertilizer">
                <p>
                  {item.fertilizer ||
                    fertilizerContent ||
                    item.preferredFertilizer}
                </p>
              </SwipePanelContent>
            )}

            {item.compost && (
              <SwipePanelContent icon="compost">
                <p>{item.compost}</p>
              </SwipePanelContent>
            )}

            {item.nutrient && (
              <SwipePanelContent icon="nutrients">
                <p>{item.nutrient}</p>
              </SwipePanelContent>
            )}
          </React.Fragment>
        </React.Fragment>
      )}
    </div>
  );
};

FertilizerReadEditPro.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string,
  editing: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const editingType = Session.get("editingType");
  const editing = editingType === UpdateTypes.fertilizer.fertilizerEditModal;

  return {
    editing,
  };
})(FertilizerReadEditPro);
