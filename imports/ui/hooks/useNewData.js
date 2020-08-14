import { useState } from 'react';

function useNewData(initial) {
  const [newData, setNewData] = useState(initial);

  const changeNewData = (e, type) => {
	//this is any new data that's been entered, updating it as new inputs are entered
	let newPlantData = newData;

	if (type === "waterScheduleAuto") {
	  if (newPlantData[type]) {
		newPlantData[type] = !newPlantData[type];
	  } else {
		newPlantData[type] = !this.props.plant[type];
	  }
	} else {
	  newPlantData[type] = e.target.value;
	}

	setNewData({newData: newPlantData})
  }

  //this only adds new dates to trackers, ie adding date fertilizer was used
  const addTrackerDate = (e, trackerType) => {
	let newPlantData = newData;

	if (newPlantData[trackerType]) {
	  newPlantData[trackerType].date = new Date(e);
	} else {
	  newPlantData[trackerType] = {
		date: new Date(e),
	  };
	}

	setNewData({newData: newPlantData})
  }

  //this adds additional details to trackers, ie fertilizer type used
  const addTrackerDetails = (e, trackerType, detailType) => {
	let newPlantData = newData;

	if (type === 'ph' || type === 'moisture') {
	  let phVal = parseFloat(e.target.value)
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (newPlantData.soilCompositionTracker) {
		newPlantData.soilCompositionTracker[type] = type === 'ph' ? phVal : moistureVal
	  } else {
		newPlantData.soilCompositionTracker = {
		  [type]: type === 'ph' ? phVal : moistureVal
		}
	  }

	} else if (newPlantData[trackerType]) {
	  newPlantData[trackerType][detailType] = e.target.value;
	} else {
	  newPlantData[trackerType] = {
		[detailType]: e.target.value
	  }
	}

	setNewData({newData: newPlantData})
  }

  return { newData, changeNewData, addTrackerDate, addTrackerDetails };
}

export default useNewData;
