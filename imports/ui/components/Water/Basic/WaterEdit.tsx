import React, { ChangeEvent } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-solid-svg-icons/faSadTear";
import { faMeh } from "@fortawesome/free-solid-svg-icons/faMeh";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { faSmile } from "@fortawesome/free-solid-svg-icons/faSmile";
import { SwipePanelContent } from "@component";
import { IWaterSchema, IWaterStats } from "@model";
import { WaterDetailType } from "@enum";

interface IWaterEditProps {
  water: IWaterSchema;
  waterStats: IWaterStats;
  updateData: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    type: WaterDetailType,
  ) => void;
}

const WaterEdit = (props: IWaterEditProps) => {
  const { water, waterStats, updateData } = props;

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
        <p className="modern-input">
          Water every{" "}
          <input
            type="number"
            min="0"
            inputMode="numeric"
            pattern="[0-9]*"
            className="small"
            onChange={(e) => updateData(e, WaterDetailType.WATER_SCHEDULE)}
            defaultValue={water.waterSchedule || ""}
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
            onChange={(e) => updateData(e, WaterDetailType.WATER_PREFERENCE)}
            defaultValue={water.waterPreference || ""}
          />
        </p>
      </SwipePanelContent>
    </div>
  );
};

WaterEdit.propTypes = {
  water: PropTypes.object.isRequired,
  waterStats: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default WaterEdit;
