import { ChangeEvent, useState } from "react";
import { PlantDetailType, TrackerDetailType, TrackerType } from "@enum";

//TODO
// @ts-ignore
function useNewData(initial) {
  const [newData, setNewData] = useState(initial);

  const changeNewData = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    type: PlantDetailType,
  ) => {
    //this is any new data that's been entered, updating it as new inputs are entered
    const newPlantData = newData;

    if (type === PlantDetailType.WATER_SCHEDULE_AUTO) {
      if (newPlantData[type]) {
        newPlantData[type] = !newPlantData[type];
      } else {
        newPlantData[type] = !newPlantData[type];
      }
    } else if (type === PlantDetailType.DIARY) {
      if (newPlantData[type]) {
        newPlantData[type].entry = e.target.value;
        newPlantData[type].date = new Date();
      } else {
        newPlantData[type] = {
          entry: e.target.value,
          date: new Date(),
        };
      }
    } else if (type === PlantDetailType.COMPANIONS) {
      const stripped = e.target.value.replace(/\s*,\s*/g, ",");
      newPlantData[type] = stripped.split(",");
    } else if (
      type === PlantDetailType.DATE_BOUGHT ||
      type === PlantDetailType.DATE_PLANTED
    ) {
      newPlantData[type] = new Date(e.target.value);
    } else {
      newPlantData[type] = e.target.value;
    }

    setNewData(newPlantData);
  };

  //this only adds new dates to trackers, ie adding date fertilizer was used
  const addTrackerDate = (e: Date, trackerType: TrackerType) => {
    const newPlantData = newData;

    //TODO clean up the deadheading pruning stuff
    //TODO confirm this even works
    // @ts-ignore
    if (trackerType.pruneType) {
      // @ts-ignore
      trackerType = trackerType.pruneType;

      //this case means we're doing both pruning and deadheading
      if (trackerType === TrackerType.PRUNING_DEADHEADING_TRACKER) {
        if (newPlantData.deadheadingTracker) {
          newPlantData.deadheadingTracker.date = new Date(e);
        } else {
          newPlantData.deadheadingTracker = {
            date: new Date(e),
          };
        }

        if (newPlantData.pruningTracker) {
          newPlantData.pruningTracker.date = new Date(e);
        } else {
          newPlantData.pruningTracker = {
            date: new Date(e),
          };
        }
      }
    }

    if (newPlantData[trackerType]) {
      newPlantData[trackerType].date = new Date(e);
    } else {
      newPlantData[trackerType] = {
        date: new Date(e),
      };
    }

    setNewData(newPlantData);
  };

  //this adds additional details to trackers, ie fertilizer type used
  const addTrackerDetails = (
    e: ChangeEvent<HTMLInputElement>,
    trackerType: TrackerType,
    detailType: TrackerDetailType,
  ) => {
    const newPlantData = newData;

    if (
      detailType === TrackerDetailType.PH ||
      detailType === TrackerDetailType.MOISTURE
    ) {
      const phVal = parseFloat(e.target.value);
      const moistureVal = parseFloat(
        (parseInt(e.target.value) / 100).toFixed(2),
      );

      if (newPlantData.soilCompositionTracker) {
        newPlantData.soilCompositionTracker[detailType] =
          detailType === TrackerDetailType.PH ? phVal : moistureVal;
      } else {
        newPlantData.soilCompositionTracker = {
          [detailType]:
            detailType === TrackerDetailType.PH ? phVal : moistureVal,
        };
      }
    } else if (newPlantData[trackerType]) {
      newPlantData[trackerType][detailType] = e.target.value;
    } else {
      newPlantData[trackerType] = {
        [detailType]: e.target.value,
      };
    }

    setNewData(newPlantData);
  };

  return {
    newData,
    setNewData,
    changeNewData,
    addTrackerDate,
    addTrackerDetails,
  };
}

export default useNewData;
