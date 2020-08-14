import { useState } from 'react';

function useNewTrackerDate() {
  const [newTrackerDate, setNewTrackerDate] = useState({});

  const changeNewTrackerDate = (e, type) => {
	//this is any new data that's been entered, updating it as new inputs are entered
	const newPlantTrackerDate = newTrackerDate;
	const { value } = e.target;

	if (type === "waterScheduleAuto") {
	  if (newPlantTrackerDate[type]) {
		newPlantTrackerDate[type] = !newPlantTrackerDate[type];
	  } else {
		newPlantTrackerDate[type] = !this.props.plant[type];
	  }
	} else {
	  newPlantTrackerDate[type] = value;
	}

	setNewTrackerDate({newTrackerDate: newPlantTrackerDate})
  }

  return { newTrackerDate, changeNewTrackerDate };
}
export default useNewTrackerDate;
