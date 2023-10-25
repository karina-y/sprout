import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { IWaterSchema, IWaterStats } from "@model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-solid-svg-icons/faSadTear";
import { faMeh } from "@fortawesome/free-solid-svg-icons/faMeh";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { faSmile } from "@fortawesome/free-solid-svg-icons/faSmile";

interface IWaterReadEditProProps {
  water: IWaterSchema;
  waterStats: IWaterStats;
}

const WaterReadEditPro = (props: IWaterReadEditProProps) => {
  const { water, waterStats } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">
        Water{" "}
        <FontAwesomeIcon
          icon={
            // TODO enum these conditions
            waterStats.waterCondition === "needs-attn"
              ? faSadTear
              : waterStats.waterCondition === "neutral"
              ? faMeh
              : waterStats.waterCondition === "unsure"
              ? faQuestionCircle
              : faSmile
          }
          className="plant-condition-icon"
          title="water condition"
        />
      </p>

      <SwipePanelContent
        icon="schedule"
        iconTitle="water schedule"
        /*
            //@ts-ignore */
        additionalOuterClasses={!water.waterScheduleAuto ? "top-align" : ""}
      >
        <>
          <p>
            {water.waterSchedule != null
              ? `Water every ${water.waterSchedule} days`
              : "No schedule set"}
          </p>
          {!water.waterScheduleAuto &&
            water.waterSchedule != null &&
            waterStats.daysSinceWatered != null && (
              <p>
                Due in {water.waterSchedule - waterStats.daysSinceWatered} days
              </p>
            )}
        </>
      </SwipePanelContent>

      {water.waterScheduleAuto && (
        <SwipePanelContent
          icon="waterAuto"
          iconTitle="automatic water schedule"
        >
          <p>Watering is automated</p>
        </SwipePanelContent>
      )}

      <SwipePanelContent icon="water" iconTitle="watering preference">
        <p>{water.waterPreference}</p>
      </SwipePanelContent>
    </div>
  );
};

WaterReadEditPro.propTypes = {
  water: PropTypes.object.isRequired,
  waterStats: PropTypes.object.isRequired,
};

export default WaterReadEditPro;
