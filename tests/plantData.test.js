import logger from "../imports/utils/helpers/logger";
import {
  getDaysSinceAction,
  getHighlightDates,
  getLastPestName,
  getLastPestTreatment,
  getLastSoilMoisture,
  getLastSoilPh,
  getPlantCondition,
  lastChecked,
  lastFertilizerUsed,
  parseDate,
  sortByLastDate,
} from "../imports/utils/helpers/plantData.ts";
import {
  diary,
  fertilizer,
  pest,
  pruningDeadheading,
  soilCompositionInGround,
  soilCompositionPotted,
  water,
} from "./db/db";

const mockDateNow = 1611097349127;

//#region getDaysSinceAction
it("get days since - water", () => {
  expect(getDaysSinceAction(water.waterTracker, mockDateNow)).toBe(8);
});

it("get days since - fertilizer", () => {
  expect(getDaysSinceAction(fertilizer.fertilizerTracker, mockDateNow)).toBe(7);
});
//#endregion

//#region getPlantCondition
it("get plant condition - water", () => {
  expect(getPlantCondition(water.waterTracker, 8, water.waterSchedule)).toBe(
    "neutral"
  );
});

it("get plant condition - fertilizer", () => {
  expect(
    getPlantCondition(
      fertilizer.fertilizerTracker,
      7,
      fertilizer.fertilizerSchedule
    )
  ).toBe("happy");
});
//#endregion

//#region lastChecked
it("get last date checked - soilComposition - potted", () => {
  expect(lastChecked(soilCompositionPotted.soilCompositionTracker)).toBe(
    "Last Checked 12/28/2020"
  );
});

it("get last date checked - soilComposition - in ground", () => {
  expect(lastChecked(soilCompositionInGround.soilCompositionTracker)).toBe(
    "Last Checked 1/12/2021"
  );
});

it("get last date checked - pest", () => {
  expect(lastChecked(pest.pestTracker)).toBe("Last Checked 1/4/2021");
});
//#endregion

//#region lastFertilizerUsed
it("last fertilizer used - fertilizer", () => {
  expect(lastFertilizerUsed(fertilizer.fertilizerTracker)).toBe("test");
});
//#endregion

//#region getLastSoilPh
it("get last soil ph", () => {
  expect(
    getLastSoilPh(soilCompositionInGround.soilCompositionTracker)
  ).toBeCloseTo(2.7);
});
//#endregion

//#region getLastSoilMoisture
it("get last soil moisture", () => {
  expect(
    getLastSoilMoisture(soilCompositionPotted.soilCompositionTracker)
  ).toBe("45%");
});
//#endregion

//#region getLastPestName
it("get last pest name", () => {
  expect(getLastPestName(pest.pestTracker)).toBe("pest treated here");
});
//#endregion

//#region getLastPestTreatment
it("get last pest treated", () => {
  expect(getLastPestTreatment(pest.pestTracker)).toBe("treatment method here");
});
//#endregion

//#region sortByLastDate
it("sort by last date - diary", () => {
  expect(sortByLastDate(diary.diary)).toMatchObject([
    // { date: "2021-01-20T03:28:18.791Z", entry: "first diary entry" },
    // { date: "2021-01-20T03:28:23.631Z", entry: "second diary entry" },
    { date: new Date(1611113298791), entry: "first diary entry" },
    { date: new Date(1611113303631), entry: "second diary entry" },
  ]);
});
//#endregion

//#region parseDate
it("parse date - mockDateNow", () => {
  expect(parseDate(mockDateNow)).toBe("1/19/2021");
});

it("parse date - water", () => {
  expect(parseDate(water.waterTracker[0].date)).toBe("1/11/2021");
});
//#endregion

//#region getHighlightDates
it("get highlight dates - water", () => {
  expect(getHighlightDates(water.waterTracker)).toEqual([
    new Date(water.waterTracker[0].date),
  ]);
});

it("get highlight dates - fertilizer", () => {
  expect(getHighlightDates(fertilizer.fertilizerTracker)).toEqual([
    new Date(fertilizer.fertilizerTracker[0].date),
  ]);
});

it("get highlight dates - pruning", () => {
  expect(getHighlightDates(pruningDeadheading.pruningTracker)).toEqual([
    new Date(pruningDeadheading.pruningTracker[0].date),
    new Date(pruningDeadheading.pruningTracker[1].date),
  ]);
});

it("get highlight dates - deadheading", () => {
  expect(getHighlightDates(pruningDeadheading.deadheadingTracker)).toEqual([
    new Date(pruningDeadheading.deadheadingTracker[0].date),
    new Date(pruningDeadheading.deadheadingTracker[1].date),
  ]);
});

it("get highlight dates - pest", () => {
  expect(getHighlightDates(pest.pestTracker)).toEqual([
    new Date(pest.pestTracker[0].date),
  ]);
});
//#endregion
