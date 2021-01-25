import moment from "moment";

//interfaces
interface Tracker {
  date: Date;
}

interface SoilCompositionTracker extends Tracker {
  ph: number;
  moisture: number;
}

interface FertilizerTracker extends Tracker {
  fertilizer: string;
}

interface PestTracker extends Tracker {
  pest: string;
  treatment: string;
}

//date is for tests
export const getDaysSinceAction = (
  tracker: Array<any>,
  date: number
): string => {
  // console.log("***moment", moment(now))
  const now: number = Date.now();
  let days: string = "0";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    //doing new date so i can switch between dummy data and real data easily
    const lastDateActionOccured = new Date(tracker[tracker.length - 1].date);
    days = moment(date || now).diff(moment(lastDateActionOccured), "days");
  }

  return days;
};

export const getPlantCondition = (
  tracker: Array<any>,
  daysSince: number,
  schedule: number
): string => {
  let condition: string = "unknown";

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
};

//todo do i need this? soilCondition varies, this may not make sense
export const getSoilCondition = (
  tracker: Array<SoilCompositionTracker>,
  idealMoistureRange: number
): string => {
  let condition: string = "unknown";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    const lastSoilComp: SoilCompositionTracker = tracker[tracker.length - 1];

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
};

export const lastChecked = (tracker: Array<any>): string => {
  let lastChecked: string = "No records available.";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    lastChecked = `Last Checked ${parseDate(tracker[tracker.length - 1].date)}`;
  }

  return lastChecked;
};

export const lastFertilizerUsed = (
  tracker: Array<FertilizerTracker>
): string => {
  let fertilizer: string = "N/A";

  if (tracker?.length > 0) {
    fertilizer = tracker[tracker.length - 1].fertilizer;
  }

  return fertilizer;
};

export const getLastSoilPh = (
  tracker: Array<SoilCompositionTracker>
): number => {
  let soilPh: number;

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    soilPh = tracker[tracker.length - 1].ph;
  }

  return soilPh;
};

export const getLastSoilMoisture = (
  tracker: Array<SoilCompositionTracker>
): string => {
  let soilMoisture: string;

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    soilMoisture = tracker[tracker.length - 1].moisture
      ? `${Math.round(tracker[tracker.length - 1].moisture * 100)}%`
      : null;
  }

  return soilMoisture;
};

export const getLastPestName = (tracker: Array<PestTracker>): string => {
  let pest: string = "N/A";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    pest = tracker[tracker.length - 1].pest || "N/A";
  }

  return pest;
};

export const getLastPestTreatment = (tracker: Array<PestTracker>): string => {
  let pestTreatment: string = "N/A";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    pestTreatment = tracker[tracker.length - 1].treatment || "N/A";
  }

  return pestTreatment;
};

export const sortByLastDate = (data: Array<Tracker>): Array<any> => {
  let sortedData: Array<any> = [];

  if (data?.length > 0 && Array.isArray(data)) {
    sortedData = data.sort(function (a, b) {
      let dateA: any = new Date(a.date);
      let dateB: any = new Date(b.date);
      return dateA - dateB;
    });
  }

  return sortedData;
};

export const parseDate = (date: Date): string => {
  let parsedDate: string = "N/A";

  if (date && new Date(date)?.getFullYear() + 1900 > 1969) {
    parsedDate = new Date(date).toLocaleDateString();
  }

  return parsedDate;
};

export const getHighlightDates = (tracker: any, type: string): Array<Date> => {
  let dates: Array<Date> = [];

  if ((type === "dateBought" || type === "datePlanted") && tracker) {
    dates.push(new Date(tracker));
  } else if (tracker?.length > 0) {
    for (let i = 0; i < tracker.length; i++) {
      dates.push(new Date(tracker[i].date));
    }
  }

  return dates;
};
