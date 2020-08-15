import { useState } from 'react';

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
		newPlantData[type] = !this.props.plant[type];
	  }
	} else if (type === 'diary') {
	  if (newPlantData[type]) {
		newPlantData[type].entry = e.target.value
		newPlantData[type].date = new Date()
	  } else {
		newPlantData[type] = {
		  entry: e.target.value,
		  date: new Date()
		}
	  }
	} else if (type === 'companions') {
	  const stripped = e.target.value.replace(/\s*,\s*/g, ',')
	  newPlantData[type] = stripped.split(',')

	} else if (type === 'dateBought' || type === 'datePlanted') {
	  newPlantData[type] = new Date(e.target.value)
	}  else {
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

  return { newData, setNewData, changeNewData, addTrackerDate, addTrackerDetails };
}

export default useNewData;
