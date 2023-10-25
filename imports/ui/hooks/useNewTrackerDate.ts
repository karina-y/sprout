import { useState } from "react";

function useNewTrackerDate() {
  const [newTrackerDate, setNewTrackerDate] = useState({});

  // @ts-ignore
  const changeNewTrackerDate = (e, type) => {
    //this is any new data that's been entered, updating it as new inputs are entered
    const newPlantTrackerDate = newTrackerDate;
    const { value } = e.target;

    if (type === "waterScheduleAuto") {
      // @ts-ignore
      if (newPlantTrackerDate[type]) {
        // @ts-ignore
        newPlantTrackerDate[type] = !newPlantTrackerDate[type];
      } else {
        // @ts-ignore
        newPlantTrackerDate[type] = !this.props.plant[type];
      }
    } else {
      // @ts-ignore
      newPlantTrackerDate[type] = value;
    }

    setNewTrackerDate({ newTrackerDate: newPlantTrackerDate });
  };

  return { newTrackerDate, changeNewTrackerDate };
}
export default useNewTrackerDate;
