import moment from "moment";
import {
  IFertilizerTrackerSchema,
  IPestTrackerSchema,
  ISoilCompositionTrackerSchema,
  ITrackerSchema,
} from "@model/ITrackerSchema";
import {
  IFertilizerSchema,
  IFertilizerStats,
  IWaterSchema,
  IWaterStats,
} from "@model";

//date is for tests
export const getDaysSinceAction = (
  tracker: Array<ITrackerSchema>,
  date?: number,
): number => {
  // console.log("***moment", moment(now))
  const now: number = Date.now();
  let days = 0;

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    //doing new date so i can switch between dummy data and real data easily
    const lastDateActionOccured = new Date(tracker[tracker.length - 1].date);
    days = moment(date || now).diff(moment(lastDateActionOccured), "days");
  }

  return days;
};

//date is for tests
export const isActionDueToday = (
  tracker: Array<ITrackerSchema>,
  schedule: number,
): boolean => {
  if (!tracker || !schedule) {
    return false;
  } else {
    return schedule - getDaysSinceAction(tracker) <= 1;
  }
};

export const getPlantCondition = (
  tracker: Array<ITrackerSchema>,
  daysSince: number,
  schedule?: number,
  isAuto?: boolean,
): string => {
  let condition = "unknown";

  if (isAuto) {
    condition = "happy";
  } else if (!schedule) {
    return condition;
  } else if (tracker?.length > 0 && Array.isArray(tracker)) {
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
  tracker: Array<ISoilCompositionTrackerSchema>,
  idealMoistureRange?: number,
): string => {
  let condition = "unknown";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    const lastSoilComp: ISoilCompositionTrackerSchema =
      tracker[tracker.length - 1];

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

export const lastChecked = (tracker: Array<ITrackerSchema>): string => {
  let lastChecked = "No records available.";

  if (tracker?.length > 0 && Array.isArray(tracker)) {
    lastChecked = `Last Checked ${parseDate(tracker[tracker.length - 1].date)}`;
  }

  return lastChecked;
};

export const lastFertilizerUsed = (
  tracker: Array<IFertilizerTrackerSchema>,
): string => {
  let fertilizer = "N/A";

  if (tracker?.length > 0) {
    fertilizer = tracker[tracker.length - 1].fertilizer;
  }

  return fertilizer;
};

export const getLastSoilPh = (
  tracker: Array<ISoilCompositionTrackerSchema>,
): number | void => {
  if (tracker?.length > 0 && Array.isArray(tracker)) {
    return tracker[tracker.length - 1].ph;
  }
};

export const getLastSoilMoisture = (
  tracker: Array<ISoilCompositionTrackerSchema>,
): string | void => {
  if (
    tracker?.length > 0 &&
    Array.isArray(tracker) &&
    tracker[tracker.length - 1].moisture
  ) {
    return `${Math.round(tracker[tracker.length - 1].moisture * 100)}%`;
  }
};

export const getLastPestName = (
  tracker?: Array<IPestTrackerSchema>,
): string => {
  let pest = "N/A";

  if (tracker?.length && Array.isArray(tracker)) {
    pest = tracker[tracker.length - 1].pest || "N/A";
  }

  return pest;
};

export const getLastPestTreatment = (
  tracker?: Array<IPestTrackerSchema>,
): string => {
  let pestTreatment = "N/A";

  if (tracker?.length && Array.isArray(tracker)) {
    pestTreatment = tracker[tracker.length - 1].treatment || "N/A";
  }

  return pestTreatment;
};

export const sortByLastDate = (
  data: Array<ITrackerSchema>,
): Array<ITrackerSchema> => {
  let sortedData: Array<ITrackerSchema> = [];

  if (data?.length > 0 && Array.isArray(data)) {
    sortedData = data.sort(function (a, b) {
      const dateA: Date = new Date(a.date);
      const dateB: Date = new Date(b.date);
      // @ts-ignore
      return dateA - dateB;
    });
  }

  return sortedData;
};

export const parseDate = (date: Date): string => {
  let parsedDate = "N/A";

  if (date && new Date(date)?.getFullYear() + 1900 > 1969) {
    parsedDate = new Date(date).toLocaleDateString();
  }

  return parsedDate;
};

//TODO split this out into two different methods?
export const getHighlightDates = (
  tracker: Array<ITrackerSchema> | Date,
  type?: string, //TODO enum this?
): Array<Date> => {
  const dates: Array<Date> = [];

  if ((type === "dateBought" || type === "datePlanted") && tracker) {
    // @ts-ignore
    dates.push(new Date(tracker));
    // @ts-ignore
  } else if (tracker?.length > 0) {
    // @ts-ignore
    for (let i = 0; i < tracker.length; i++) {
      // @ts-ignore
      dates.push(new Date(tracker[i].date));
    }
  }

  return dates;
};

/**
 * this is how we fill in the progress bar
 */
export const getWaterProgress = (
  item: IWaterSchema,
  stats: IWaterStats,
): number => {
  let progress = 0;

  //if it's automatically watered, progress will always be at 100%
  if (item.waterScheduleAuto) {
    progress = 100;
  } else if (item.waterSchedule != null) {
    progress =
      stats.daysSinceWatered / item.waterSchedule > 1
        ? 5
        : (1 - stats.daysSinceWatered / item.waterSchedule) * 100 || 5;
  }

  return progress;
};

/**
 * this is how we fill in the progress bar
 */
export const getFertilizerProgress = (
  item: IFertilizerSchema,
  stats: IFertilizerStats,
): number => {
  let progress = 0;

  if (item.fertilizerSchedule != null) {
    progress =
      stats.daysSinceFertilized / item.fertilizerSchedule > 1
        ? 5
        : (1 - stats.daysSinceFertilized / item.fertilizerSchedule) * 100 || 5;
  }
  return progress;
};
