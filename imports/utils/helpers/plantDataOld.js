import moment from "moment";

//date is for tests
export function getDaysSinceAction(tracker, date) {
  // console.log("***moment", moment(now))
  const now = Date.now();
  let days = "0";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    //doing new date so i can switch between dummy data and real data easily
    const lastDateActionOccured = new Date(tracker[tracker.length - 1].date);
    days = moment(date || now).diff(moment(lastDateActionOccured), "days");
  }

  return days;
}

//TODO do i need tracker here? it's not being used
export function getPlantCondition(tracker, daysSince, schedule) {
  let condition = "unknown";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    if (daysSince / schedule >= 0.8) {
      condition = "needs-attn";
    } else if (daysSince / schedule >= 0.5) {
      condition = "neutral";
    } else {
      condition = "happy";
    }
  }

  return condition;
}

//todo do i need this? soilCondition varies, this may not make sense
export function getSoilCondition(tracker, idealMoistureRange) {
  let condition = "unknown";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    const lastSoilComp = tracker[tracker.length - 1];

    //scale of 3.5 to 8, calculate percentage
    if (
      lastSoilComp.ph >= 6.0 ||
      lastSoilComp.ph <= 5.4 ||
      lastSoilComp.moisture < 0.3
    ) {
      condition = "needs-attn";
    } else if (lastSoilComp.moisture >= 0.3 && lastSoilComp.moisture < 0.6) {
      condition = "neutral";
    } else {
      condition = "happy";
    }
  }

  return condition;
}

export function lastChecked(tracker) {
  let lastChecked = "No records available.";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    lastChecked = `Last Checked ${parseDate(tracker[tracker.length - 1].date)}`;
  }

  return lastChecked;
}

export function lastFertilizerUsed(tracker) {
  let fertilizer = "N/A";

  if (tracker?.length > 0) {
    fertilizer = tracker[tracker.length - 1].fertilizer;
  }

  return fertilizer;
}

export function getLastSoilPh(tracker) {
  let soilPh;

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    soilPh = tracker[tracker.length - 1].ph;
  }

  return soilPh;
}

export function getLastSoilMoisture(tracker) {
  let soilMoisture;

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    soilMoisture = tracker[tracker.length - 1].moisture
      ? `${Math.round(tracker[tracker.length - 1].moisture * 100)}%`
      : null;
  }

  return soilMoisture;
}

export function getLastPestName(tracker) {
  let pest = "N/A";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    pest = tracker[tracker.length - 1].pest || "N/A";
  }

  return pest;
}

export function getLastPestTreatment(tracker) {
  let pestTreatment = "N/A";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    pestTreatment = tracker[tracker.length - 1].treatment || "N/A";
  }

  return pestTreatment;
}

export function sortByLastDate(data) {
  let sortedData = [];

  if (data?.length > 0 && Array.isArray(data)) {
    sortedData = data.sort(function (a, b) {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      return dateA - dateB;
    });
  }

  return sortedData;
}

export function parseDate(date) {
  let parsedDate = "N/A";

  if (date && new Date(date)?.getFullYear() + 1900 > 1969) {
    parsedDate = new Date(date).toLocaleDateString();
  }

  return parsedDate;
}

export function getHighlightDates(tracker, type) {
  let dates = [];

  if ((type === "dateBought" || type === "datePlanted") && tracker) {
    dates.push(new Date(tracker));
  } else if (tracker?.length > 0) {
    for (let i = 0; i < tracker.length; i++) {
      dates.push(new Date(tracker[i].date));
    }
  }

  return dates;
}
