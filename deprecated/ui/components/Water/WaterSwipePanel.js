import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getDaysSinceAction,
  getHighlightDates,
  getPlantCondition,
  sortByLastDate,
} from "@helper";
import { toast } from "react-toastify";
import { withTracker } from "meteor/react-meteor-data";
import { WaterModals, WaterReadEdit, WaterReadEditPro } from "@component";
import { useNewData } from "@hook";
import { UpdateTypes } from "@constant";
import { Water } from "@api";
import { isNull } from "../../../../imports/utils/helpers";

const WaterSwipePanel = (props) => {
  const water = props.water;
  const { newData, setNewData, changeNewData, addTrackerDate } = useNewData({});

  useEffect(() => {
    if (props.savingType === `${UpdateTypes.water.waterEditModal}-edit`) {
      updatePlant(`${UpdateTypes.water.waterEditModal}-edit`);
    }
  }, [props]);

  const updatePlant = (type) => {
    const newPlantData = newData;
    const oldPlantData = water;
    let data;

    if (isNull(newPlantData)) {
      toast.error("No data entered.");
      return;
    } else if (type === UpdateTypes.water.waterEditModal) {
      data = {
        waterTracker: newPlantData.waterTracker,
      };
    } else {
      //TODO abstract each of these cases out
      data = {
        waterPreference:
          newPlantData.waterPreference || oldPlantData.waterPreference,
        waterSchedule:
          newPlantData.waterSchedule === ""
            ? null
            : newPlantData.waterSchedule || oldPlantData.waterSchedule
            ? parseInt(newPlantData.waterSchedule || oldPlantData.waterSchedule)
            : newPlantData.waterSchedule || oldPlantData.waterSchedule,
        // waterSchedule: (newPlantData.waterSchedule === '' && oldPlantData.waterSchedule > 0) ? null : (newPlantData.waterSchedule || oldPlantData.waterSchedule) ? parseInt(newPlantData.waterSchedule || oldPlantData.waterSchedule) : newPlantData.waterSchedule || oldPlantData.waterSchedule,
        waterScheduleAuto:
          newPlantData.waterScheduleAuto != null
            ? newPlantData.waterScheduleAuto
            : oldPlantData.waterScheduleAuto != null
            ? oldPlantData.waterScheduleAuto
            : false,
      };
    }

    if (data) {
      data._id = oldPlantData._id;

      Meteor.call("water.update", type, data, (err, response) => {
        if (err) {
          toast.error(err.message);
        } else {
          toast.success("Successfully saved new entry.");

          //reset the data
          resetData();
        }
      });
    } else {
      toast.error("No data entered.");
    }
  };

  const resetData = () => {
    setNewData({});

    props.exitEditMode();
  };

  return (
    <div className="PlantSeedlingViewEdit">
      {/* water */}
      {Meteor.isPro ? (
        <WaterReadEditPro item={water} updateData={changeNewData} />
      ) : (
        <WaterReadEdit item={water} updateData={changeNewData} />
      )}

      {/* modals */}
      <WaterModals
        addTrackerDate={addTrackerDate}
        save={updatePlant}
        resetModal={resetData}
        newDataTracker={newData.waterTracker}
        tracker={water.waterTracker}
        highlightDates={water.highlightDates}
      />
    </div>
  );
};

WaterSwipePanel.propTypes = {
  water: PropTypes.object.isRequired,
  exitEditMode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  savingType: PropTypes.string,
};

export default withTracker((props) => {
  const savingType = Session.get("savingType");
  let water = Water.findOne({ plantId: props.id }) || {};

  //sort the data
  water.waterTracker = sortByLastDate(water.waterTracker);

  water.daysSinceWatered = getDaysSinceAction(water.waterTracker);
  water.waterCondition = getPlantCondition(
    water.waterTracker,
    water.daysSinceWatered,
    water.waterSchedule,
  );
  water.highlightDates = getHighlightDates(water.waterTracker);

  return {
    water,
    savingType,
  };
})(WaterSwipePanel);
