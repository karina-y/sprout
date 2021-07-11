//i want steady data to test against helper methods
//if i change the helper method, these will tell me if i messed something up
//todo can i use a factory for this though?

export const plant = {
  _id: "1",
  image: "/images/plant-04.jpg",
  category: "potted",
  commonName: "Prayer Plant",
  latinName: "Maranta leuconeura",
  lightPreference: "low-mid indirect light",
  toxicity: "toxicity here",
  locationBought: "location bought here",
  dateBought: new Date(0),
  datePlanted: new Date(0),
  location: "living room",
  companions: ["companion plants here"],
  createdAt: new Date(1611095798256),
  updatedAt: new Date(1611095798256),
  userId: "10",
};

export const water = {
  _id: "2",
  waterScheduleAuto: false,
  waterSchedule: 14,
  waterPreference: "keep soil moist",
  createdAt: new Date(1611095799787),
  updatedAt: new Date(1611097316077),
  plantId: "1",
  waterTracker: [{ date: new Date(1610406113000) }],
};

export const fertilizer = {
  _id: "3",
  createdAt: new Date(1611091990885),
  updatedAt: new Date(1611095330882),
  plantId: "1",
  preferredFertilizer: "preferred fertilizer here",
  fertilizerTracker: [{ date: new Date(1610487302000), fertilizer: "test" }],
  compost: "compost here",
  fertilizerSchedule: 16
};

export const pruningDeadheading = {
  _id: "4",
  pruningPreference: "pruning here",
  deadheadingPreference: "deadheading here",
  createdAt: new Date(1611095970755),
  updatedAt: new Date(1611112990925),
  plantId: "9",
  pruningTracker: [
    { date: new Date(1610594581000) },
    { date: new Date(1609557788000) },
  ],
  deadheadingTracker: [
    { date: new Date(1610076185000) },
    { date: new Date(1609557788000) },
  ],
};

export const soilCompositionPotted = {
  _id: "5",
  createdAt: new Date(1611095971291),
  updatedAt: new Date(1611113112657),
  plantId: "9",
  soilRecipe: "soil recipe here",
  soilCompositionTracker: [
    {
      date: new Date(1609212304000),
      moisture: 0.45,
    },
  ],
};

export const soilCompositionInGround = {
  _id: "6",
  createdAt: new Date(1611095971291),
  updatedAt: new Date(1611113226481),
  plantId: "9",
  soilAmendment: "soil amendment here",
  soilType: "sandy",
  tilled: true,
  soilCompositionTracker: [
    {
      date: new Date(1610508422000),
      ph: 2.7,
    },
  ],
};

export const pest = {
  _id: "7",
  createdAt: new Date(1611095970933),
  updatedAt: new Date(1611113269084),
  plantId: "9",
  pestTracker: [
    {
      date: new Date(1609817259000),
      pest: "pest treated here",
      treatment: "treatment method here",
    },
  ],
};

export const diary = {
  _id: "8",
  createdAt: new Date(1611095971114),
  updatedAt: new Date(1611113305077),
  plantId: "9",
  diary: [
    {
      entry: "first diary entry",
      date: new Date(1611113298791),
    },
    {
      entry: "second diary entry",
      date: new Date(1611113303631),
    },
  ],
};
