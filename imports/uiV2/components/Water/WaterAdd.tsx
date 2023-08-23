import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@componentV2";

const WaterAdd = (props) => {
  const { item, updateData } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Water</p>

      <SwipePanelContent icon="schedule" iconTitle="watering schedule">
        <p className="modern-input">
          Water every{" "}
          <input
            type="number"
            min="0"
            inputMode="numeric"
            pattern="[0-9]*"
            className="small"
            onChange={(e) => updateData(e, "waterSchedule")}
            value={item.waterSchedule || ""}
          />{" "}
          days
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="water">
        <p className="modern-input">
          <label>watering preferences *</label>
          <input
            type="text"
            onChange={(e) => updateData(e, "waterPreference")}
            value={item.waterPreference || ""}
          />
        </p>
      </SwipePanelContent>
    </div>
  );
};

WaterAdd.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default WaterAdd;
