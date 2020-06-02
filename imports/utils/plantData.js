import moment from 'moment';

export function getDaysSinceAction(tracker) {
  const now = Date.now();
  let days = "0";

  if (tracker && tracker.length > 0) {
	//doing new date so i can switch between dummy data and real data easily
	const lastDateActionOccured = new Date(tracker[tracker.length-1].date);
	days = moment(now).diff(moment(lastDateActionOccured), 'days');
  }

  return days;
}

export function getPlantCondition(tracker, daysSince, schedule) {
  let condition = "unknown";

  if (tracker && tracker.length > 0) {
	if (daysSince / schedule >= .8) {
	  condition = "needs-attn";
	} else if (daysSince / schedule >= .5) {
	  condition = "neutral";
	} else {
	  condition = "happy";
	}
  }

  return condition;
}

export function getSoilCondition(tracker, idealMoistureRange) {
  let condition = "unknown";

  if (tracker && tracker.length > 0) {
    const lastSoilComp = tracker[tracker.length-1];

	//scale of 3.5 to 8, calculate percentage
	if (lastSoilComp.ph >= 6.0 || lastSoilComp.ph <= 5.4 || lastSoilComp.moisture < .3) {
	  condition = "needs-attn";
	} else if (lastSoilComp.moisture >= .3 && lastSoilComp.moisture < .6) {
	  condition = "neutral";
	} else {
	  condition = "happy";
	}
  }

  return condition;
}

export function lastChecked(tracker) {
  let lastChecked = "N/A";

  if (tracker && tracker.length > 0) {
	lastChecked = new Date(tracker[tracker.length-1].date).toLocaleDateString();
  }

  return lastChecked;
}

export function getLastSoilPh(tracker) {
  let soilPh = "N/A";

  if (tracker && tracker.length > 0) {
	soilPh = tracker[tracker.length-1].ph || 'N/A';
  }

  return soilPh;
}

export function getLastSoilMoisture(tracker) {
  let soilMoisture = "N/A";

  if (tracker && tracker.length > 0) {
	soilMoisture = tracker[tracker.length-1].moisture ? `${Math.round(tracker[tracker.length-1].moisture * 10)}%` : 'N/A';
  }

  return soilMoisture;
}

export function getLastPestName(tracker) {
  let pest = "N/A";

  if (tracker && tracker.length > 0) {
	pest = tracker[tracker.length-1].pest || 'N/A';
	pestTreatment = tracker[tracker.length-1].treatment || 'N/A';
  }

  return pest;
}

export function getLastPestTreatment(tracker) {
  let pestTreatment = "N/A";

  if (tracker && tracker.length > 0) {
	pestTreatment = tracker[tracker.length-1].treatment || 'N/A';
  }

  return pestTreatment;
}
