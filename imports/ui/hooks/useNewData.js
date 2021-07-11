import { useState } from "react";

function useNewData(initial) {
  const [newData, setNewData] = useState(initial);

  const changeNewData = (e, type) => {
    //this is any new data that's been entered, updating it as new inputs are entered
    let newPlantData = newData;

    //TODO make these types constants as well
    if (type === "waterScheduleAuto") {
      if (newPlantData[type]) {
        newPlantData[type] = !newPlantData[type];
      } else {
        newPlantData[type] = !newPlantData[type];
      }
    } else if (type === "diary") {
      if (newPlantData[type]) {
        newPlantData[type].entry = e.target.value;
        newPlantData[type].date = new Date();
      } else {
        newPlantData[type] = {
          entry: e.target.value,
          date: new Date(),
        };
      }
    } else if (type === "companions") {
      const stripped = e.target.value.replace(/\s*,\s*/g, ",");
      newPlantData[type] = stripped.split(",");
    } else if (type === "dateBought" || type === "datePlanted") {
      newPlantData[type] = new Date(e.target.value);
    } else {
      newPlantData[type] = e.target.value;
    }

    setNewData(newPlantData);
  };

  //this only adds new dates to trackers, ie adding date fertilizer was used
  const addTrackerDate = (e, trackerType) => {
    let newPlantData = newData;

    //TODO clean up the deadheading pruning stuff
    if (trackerType.pruneType) {
      trackerType = trackerType.pruneType;

      //this case means we're doing both pruning and deadheading
      if (trackerType === "pruningDeadheadingTracker") {
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
  const addTrackerDetails = (e, trackerType, detailType) => {
    let newPlantData = newData;

    if (detailType === "ph" || detailType === "moisture") {
      let phVal = parseFloat(e.target.value);
      let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2));

      if (newPlantData.soilCompositionTracker) {
        newPlantData.soilCompositionTracker[detailType] = detailType === "ph" ? phVal : moistureVal;
      } else {
        newPlantData.soilCompositionTracker = {
          [detailType]: detailType === "ph" ? phVal : moistureVal,
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
