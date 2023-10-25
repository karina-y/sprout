import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { FertilizerDetailType } from "@enum";
import { IFertilizerSchema } from "@model";

interface FertilizerAddProps {
  updateData: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: FertilizerDetailType,
  ) => void;
  item: IFertilizerSchema;
}

const FertilizerAdd = (props: FertilizerAddProps) => {
  const { updateData, item } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Fertilizer</p>

      <SwipePanelContent icon="schedule" iconTitle="fertilizer schedule">
        <p className="modern-input">
          Fertilize every{" "}
          <input
            type="number"
            min="0"
            inputMode="numeric"
            pattern="[0-9]*"
            className="small"
            onChange={(e) =>
              updateData(e, FertilizerDetailType.FERTILIZER_SCHEDULE)
            }
            value={item.fertilizerSchedule || ""}
          />{" "}
          days
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="fertilizer">
        <p className="modern-input">
          <label>preferred fertilizer</label>
          <input
            type="text"
            onChange={(e) =>
              updateData(e, FertilizerDetailType.PREFERRED_FERTILIZER)
            }
            value={item.preferredFertilizer || ""}
          />
        </p>
      </SwipePanelContent>
    </div>
  );
};

FertilizerAdd.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default FertilizerAdd;
