import React, { ComponentClass, useEffect } from "react";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getDaysSinceAction,
  getHighlightDates,
  getPlantCondition,
  isNull,
  sortByLastDate,
  updateOrEditItem,
} from "@helper";
import { toast } from "react-toastify";
import { withTracker } from "meteor/react-meteor-data";
import { WaterEdit, WaterModals, WaterRead } from "@component";
import { Water } from "@api";
import { IWaterSchema, IWaterStats } from "@model";
import { ModalId, TrackerEditingType, WaterDetailType } from "@enum";
import { Session } from "meteor/session";
import useNewWaterData from "@hook/useNewWaterData.ts";

interface IWaterSwipePanelProps {
  exitEditMode: () => void;
  id: string;
  savingType: TrackerEditingType;
  water: IWaterSchema;
  waterStats: IWaterStats;
  editing: boolean;
}

const WaterSwipePanel = (props: IWaterSwipePanelProps) => {
  const { water, waterStats, editing } = props;
  const { newData, setNewData, changeNewData, addTrackerDate } =
    useNewWaterData({});

  useEffect(() => {
    if (props.savingType === TrackerEditingType.WATER_EDIT) {
      updatePlant(TrackerEditingType.WATER_EDIT);
    }
  }, [props]);

  //TODO correctly type this param?
  const updatePlant = (type: WaterDetailType) => {
    console.log("kytodo updatePlant() Water", { type });

    const newPlantData = newData;
    const oldPlantData = water;
    let data: Partial<IWaterSchema>;

    if (isNull(newPlantData)) {
      toast.error("No data entered.");
      return;
    } else if (type === WaterDetailType.WATER_TRACKER) {
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
      updateOrEditItem("water", type, props.id, data, oldPlantData);

      //reset the data
      resetData();
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
      {editing ? (
        <WaterEdit
          water={water}
          waterStats={waterStats}
          updateData={changeNewData}
        />
      ) : (
        <WaterRead water={water} waterStats={waterStats} />
      )}

      {/* modals */}
      <WaterModals
        addTrackerDate={addTrackerDate}
        save={updatePlant}
        resetModal={resetData}
        newDataTracker={newData.waterTracker}
        /*
        //@ts-ignore */
        tracker={water.waterTracker}
        highlightDates={waterStats.highlightDates}
      />
    </div>
  );
};

WaterSwipePanel.propTypes = {
  exitEditMode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  savingType: PropTypes.string,
  water: PropTypes.object.isRequired,
  waterStats: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((props: any) => {
  const savingType = Session.get("savingType");
  const water = Water.findOne({ plantId: props.id }) || ({} as IWaterSchema);
  const waterStats = {} as IWaterStats;
  const editingType = Session.get("editingType");
  const editing = editingType === ModalId.WATER_TRACKER;
  console.log("kytodo waterswipepanel withtracker editingType", {
    editingType,
  });

  //sort the data
  water.waterTracker = sortByLastDate(water.waterTracker);

  waterStats.daysSinceWatered = getDaysSinceAction(water.waterTracker);
  waterStats.waterCondition = getPlantCondition(
    water.waterTracker,
    waterStats.daysSinceWatered,
    water.waterSchedule,
  );
  waterStats.highlightDates = getHighlightDates(water.waterTracker);

  return {
    savingType,
    water,
    waterStats,
    editing,
  } as IWaterSwipePanelProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(WaterSwipePanel) as ComponentClass<IWaterSwipePanelProps, any>;
