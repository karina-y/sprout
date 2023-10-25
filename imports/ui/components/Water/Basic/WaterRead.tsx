import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-solid-svg-icons/faSadTear";
import { faMeh } from "@fortawesome/free-solid-svg-icons/faMeh";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { faSmile } from "@fortawesome/free-solid-svg-icons/faSmile";
import { SwipePanelContent } from "@component";
import { IWaterSchema, IWaterStats } from "@model";

interface IWaterReadProps {
  water: IWaterSchema;
  waterStats: IWaterStats;
}

const WaterRead = (props: IWaterReadProps) => {
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

      <SwipePanelContent icon="schedule" iconTitle="water schedule">
        <p>
          {water.waterSchedule != null
            ? `Water every ${water.waterSchedule} days`
            : "No schedule set"}
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="water" iconTitle="water preference">
        <p>{water.waterPreference}</p>
      </SwipePanelContent>
    </div>
  );
};

WaterRead.propTypes = {
  water: PropTypes.object.isRequired,
  waterStats: PropTypes.object.isRequired,
};

export default WaterRead;
