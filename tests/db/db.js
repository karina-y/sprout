//i want steady data to test against helper methods
//if i change the helper method, these will tell me if i messed something up
//todo can i use a factory for this though?

export const plant = {
  _id: "rxgLKB55Sb8x4rfbz",
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
  userId: "r6H5iC6ySRKZZchns",
};

export const water = {
  _id: "x2d6jiBN48zfyELrG",
  waterScheduleAuto: false,
  waterSchedule: 14,
  waterPreference: "keep soil moist",
  createdAt: new Date(1611095799787),
  updatedAt: new Date(1611097316077),
  plantId: "rxgLKB55Sb8x4rfbz",
  waterTracker: [{ date: new Date(1610406113000) }],
};

export const fertilizer = {
  _id: "FKBiMxCkqQK28cGiq",
  createdAt: new Date(1611091990885),
  updatedAt: new Date(1611095330882),
  plantId: "rxgLKB55Sb8x4rfbz",
  preferredFertilizer: "preferred fertilizer here",
  fertilizerTracker: [{ date: new Date(1610487302000), fertilizer: "test" }],
  compost: "compost here",
  fertilizerSchedule: 16
};

export const pruningDeadheading = {
  _id: "DfFpXcQdou5cbAKko",
  pruningPreference: "pruning here",
  deadheadingPreference: "deadheading here",
  createdAt: new Date(1611095970755),
  updatedAt: new Date(1611112990925),
  plantId: "hdfaJCmD6Ajv8KAC2",
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
  _id: "9dB4SpxYSECWbdKGp",
  createdAt: new Date(1611095971291),
  updatedAt: new Date(1611113112657),
  plantId: "hdfaJCmD6Ajv8KAC2",
  soilRecipe: "soil recipe here",
  soilCompositionTracker: [
    {
      date: new Date(1609212304000),
      moisture: 0.45,
    },
  ],
};

export const soilCompositionInGround = {
  _id: "9dB4SpxYSECWbdKGp",
  createdAt: new Date(1611095971291),
  updatedAt: new Date(1611113226481),
  plantId: "hdfaJCmD6Ajv8KAC2",
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
  _id: "KY5LLSK3CoRtnn9F8",
  createdAt: new Date(1611095970933),
  updatedAt: new Date(1611113269084),
  plantId: "hdfaJCmD6Ajv8KAC2",
  pestTracker: [
    {
      date: new Date(1609817259000),
      pest: "pest treated here",
      treatment: "treatment method here",
    },
  ],
};

export const diary = {
  _id: "EcF95FrhNarcYMbqn",
  createdAt: new Date(1611095971114),
  updatedAt: new Date(1611113305077),
  plantId: "hdfaJCmD6Ajv8KAC2",
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
