import { ChangeEvent, useState } from "react";
import { WaterDetailType } from "@enum";
import { IWaterSchema, IWaterTrackerSchema } from "@model";

//TODO
// @ts-ignore
function useNewWaterData(initial) {
  const [newData, setNewData] = useState(initial);

  const changeNewData = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    type: WaterDetailType,
  ) => {
    //this is any new data that's been entered, updating it as new inputs are entered
    const newPlantData: IWaterSchema = newData;

    if (type === WaterDetailType.WATER_SCHEDULE_AUTO) {
      if (newPlantData[type]) {
        newPlantData[type] = !newPlantData[type];
      } else {
        newPlantData[type] = !newPlantData[type];
      }
    } else {
      //TODO
      // @ts-ignore
      newPlantData[type] = e.target.value;
    }

    //this calls updatePlant() in WaterSwipePanel
    setNewData(newPlantData);
  };

  /**
   * Add new date to tracker
   * We're using a modified schema here because rather than updating the existing tracker array
   * we just create a new object and push it within the api method "water.update"
   * @param e
   */
  const addTrackerDate = (e: Date) => {
    type ModifiedWaterSchema = Omit<IWaterSchema, "waterTracker"> & {
      waterTracker: IWaterTrackerSchema;
    };
    const newPlantData: ModifiedWaterSchema = newData;

    if (newPlantData.waterTracker) {
      newPlantData.waterTracker.date = new Date(e);
    } else {
      newPlantData.waterTracker = {
        date: new Date(e),
      };
    }

    //this calls updatePlant() in WaterSwipePanel
    setNewData(newPlantData);
  };

  return {
    newData,
    setNewData,
    changeNewData,
    addTrackerDate,
  };
}

export default useNewWaterData;
