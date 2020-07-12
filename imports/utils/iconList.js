import { faBug } from '@fortawesome/free-solid-svg-icons/faBug'
import { faTint } from '@fortawesome/free-solid-svg-icons/faTint'
import { faMortarPestle } from '@fortawesome/free-solid-svg-icons/faMortarPestle'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { faSprayCan } from '@fortawesome/free-solid-svg-icons/faSprayCan'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun'
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt'
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends'
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons/faSkullCrossbones'
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook'
import { faLeaf } from '@fortawesome/free-solid-svg-icons/faLeaf'
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons/faMapMarker'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'

const IconList = {
  category: {icon: faFilter, alt: 'filter', title: 'category', isCustom: false},
  companions: {icon: faUserFriends, alt: 'people', title: 'companion plants', isCustom: false},
  compost: {icon: '/icons/farm_03/fertilizer.svg', alt: 'fertilizer bag', title: 'compost', isCustom: true},
  deadheading: {icon: '/icons/farm_01/025-harvest.svg', alt: 'deadheading plant', title: 'deadheading', isCustom: true},
  diary: {icon: faBook, alt: 'book', title: 'diary', isCustom: false},
  fertilizer: {icon: '/icons/farm_03/fertilizer.svg', alt: 'fertilizer bag', title: 'preferred fertilizer', isCustom: true},
  info: {icon: faInfoCircle, alt: 'info', title: 'info', isCustom: false},
  lightPreference: {icon: faSun, alt: 'sun', title: 'light preference', isCustom: false},
  locationBought: {icon: faMapMarker, alt: 'map marker', title: 'location bought', isCustom: false},
  nutrients: {icon: faLeaf, alt: 'leaf', title: 'other nutrient amendment', isCustom: false},
  pest: {icon: faBug, alt: 'bug', title: 'pest', isCustom: false},
  pestTreatment: {icon: faSprayCan, alt: 'spray can', title: 'pest treatment', isCustom: false},
  ph: {icon: faTachometerAlt, alt: 'meter', title: 'ph', isCustom: false},
  plantLocation: {icon: faHome, alt: 'home', title: 'plant location', isCustom: false},
  pruning: {icon: '/icons/farm_01/009-clipper.svg', alt: 'pruning shears', title: 'pruning', isCustom: true},
  schedule: {icon: faCalendarAlt, alt: 'calendar', title: 'schedule', isCustom: false},
  soilAmendment: {icon: faInfoCircle, alt: 'info', title: 'soil amendment', isCustom: false},
  soilMoisture: {icon: faTint, alt: 'water drop', title: 'soil moisture', isCustom: false},
  soilRecipe: {icon: faMortarPestle, alt: 'mortar and pestle', title: 'soil recipe', isCustom: false},
  soilType: {icon: faInfoCircle, alt: 'info', title: 'soil type', isCustom: false},
  water: {icon: '/icons/farm_01/046-watering can.svg', alt: 'watering can', title: 'watering preference', isCustom: true},
  tilling: {icon: '/icons/farm_01/017-farming tools.svg', alt: 'farming tools', title: 'tilling', isCustom: true},
  toxicity: {icon: faSkullCrossbones, alt: 'skull and crossbones', title: 'toxicity', isCustom: false},
  waterAuto: {icon: faHistory, alt: 'auto', title: 'automatic watering schedule', isCustom: false},
  // waterAuto: {icon: '/icons/farm_02/013-hose.svg', alt: 'watering hose', title: 'automatic watering scheudle', isCustom: true},
}

export default IconList
