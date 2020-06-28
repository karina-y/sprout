import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import './ProfileViewEdit.scss'
import { Session } from 'meteor/session'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import SwipeableViews from 'react-swipeable-views'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun'
import { faTint } from '@fortawesome/free-solid-svg-icons/faTint'
import { faBug } from '@fortawesome/free-solid-svg-icons/faBug'
import { faSprayCan } from '@fortawesome/free-solid-svg-icons/faSprayCan'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faMeh } from '@fortawesome/free-solid-svg-icons/faMeh'
import { faSadTear } from '@fortawesome/free-solid-svg-icons/faSadTear'
import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons/faMapMarker'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faLeaf } from '@fortawesome/free-solid-svg-icons/faLeaf'
import { faMortarPestle } from '@fortawesome/free-solid-svg-icons/faMortarPestle'
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt'
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter'
import {
  getDaysSinceAction, getLastPestName, getLastPestTreatment, getLastSoilMoisture, getLastSoilPh,
  getPlantCondition, getSoilCondition, lastChecked
} from '../../../utils/plantData'
import Profile from '/imports/api/Profile/Profile'
import { toast } from 'react-toastify'
import SwipePanelContent from '../Shared/SwipePanelContent'
import ProfileAddEntryModal from '../Shared/ProfileAddEntryModal'
import ProfileViewHistoryModal from '../Shared/ProfileViewHistoryModal'
import Category from '/imports/api/Category/Category'
import SoilTypes from '../../../utils/soilTypes'

//TODO order dates in trackers from latest first

class ProfileViewEdit extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  newData: {},
	  swipeViewIndex: 0,
	  currentDateSelection: null,
	  modalOpen: null,
	  editing: null
	}

	autobind(this)
  }

  componentDidMount () {
	Session.set('pageTitle', this.props.profile.latinName || this.props.profile.commonName)

	//this is to disable keyboard from popping up on android, sometimes you just need good ol vanilla js
	const inputs = document.getElementsByTagName('input')

	for (let i = 0; i < inputs.length; i++) {
	  inputs[i].disabled = true
	}
  }

  //TODO turn into hook and memoize
  static getHighlightDates (items, type) {
	let dates = []

	if (type === 'dateBought' && items) {
	  dates.push(new Date(items))
	} else if (items && items.length > 0) {
	  for (let i = 0; i < items.length; i++) {
		dates.push(new Date(items[i].date))
	  }
	}

	return dates
  }

  updateData (e, type) {

	const newProfileData = this.state.newData

	if (type === 'companions') {

	  const stripped = e.target.value.replace(/\s*,\s*/g, ',')
	  newProfileData[type] = stripped.split(',')

	} else if (type === 'waterDate') {

	  if (newProfileData.waterTracker) {
		newProfileData.waterTracker.date = new Date(e)
	  } else {
		newProfileData.waterTracker = {
		  date: new Date(e)
		}
	  }

	} else if (type === 'fertilizerDate') {

	  if (newProfileData.fertilizerTracker) {
		newProfileData.fertilizerTracker.date = new Date(e)
	  } else {
		newProfileData.fertilizerTracker = {
		  date: new Date(e)
		}
	  }

	} else if (type === 'soilDate') {

	  if (newProfileData.soilCompositionTracker) {
		newProfileData.soilCompositionTracker.date = new Date(e)
	  } else {
		newProfileData.soilCompositionTracker = {
		  date: new Date(e)
		}
	  }

	} else if (type === 'pestDate') {

	  if (newProfileData.pestTracker) {
		newProfileData.pestTracker.date = new Date(e)
	  } else {
		newProfileData.pestTracker = {
		  date: new Date(e)
		}
	  }

	} else if (type === 'fertilizer') {

	  if (newProfileData.fertilizerTracker) {
		newProfileData.fertilizerTracker[type] = e.target.value
	  } else {
		newProfileData.fertilizerTracker = {
		  [type]: e.target.value
		}
	  }

	} else if (type === 'ph' || type === 'moisture') {
	  let phVal = parseFloat(e.target.value)
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (newProfileData.soilCompositionTracker) {
		newProfileData.soilCompositionTracker[type] = type === 'ph' ? phVal : moistureVal
	  } else {
		newProfileData.soilCompositionTracker = {
		  [type]: type === 'ph' ? phVal : moistureVal
		}
	  }

	} else if (type === 'pest' || type === 'treatment') {

	  if (newProfileData.pestTracker) {
		newProfileData.pestTracker[type] = e.target.value
	  } else {
		newProfileData.pestTracker = {
		  [type]: e.target.value
		}
	  }

	} else if (type === 'dateBought') {
	  // newProfileData[type] = new Date(e)
	  newProfileData[type] = new Date(e.target.value)
	} else if (type === 'diary') {

	  if (newProfileData[type]) {
		newProfileData[type].entry = e.target.value
		newProfileData[type].date = new Date()
	  } else {
		newProfileData[type] = {
		  entry: e.target.value,
		  date: new Date()
		}
	  }

	} else {
	  newProfileData[type] = e.target.value
	}

	this.setState({
	  newData: newProfileData
	})
  }

  updateProfile (type) {

	const newProfileData = this.state.newData
	const oldProfileData = this.props.profile
	let data

	switch (type) {
	  case 'waterTracker-edit':
		data = {
		  waterPreference: newProfileData.waterPreference || oldProfileData.waterPreference,
		  lightPreference: newProfileData.lightPreference || oldProfileData.lightPreference,
		  waterSchedule: parseInt(newProfileData.waterSchedule || oldProfileData.waterSchedule)
		}
		break
	  case 'fertilizerTracker-edit':
		data = {
		  fertilizerSchedule: parseInt(newProfileData.fertilizerSchedule || oldProfileData.fertilizerSchedule)
		}
		break
	  case 'etc-edit':
		data = {
		  location: newProfileData.location || oldProfileData.location,
		  locationBought: newProfileData.locationBought || oldProfileData.locationBought,
		  dateBought: newProfileData.dateBought || oldProfileData.dateBought,
		  companions: newProfileData.companions || oldProfileData.companions
		}
		break
	  default:
		data = {
		  [type]: newProfileData[type]
		}
	}

	if (data) {
	  data._id = oldProfileData._id

	  Meteor.call('profile.update', type, data, (err, response) => {
		if (err) {
		  toast.error(err.message)
		} else {
		  toast.success('Successfully saved new entry.')

		  //reset the data
		  this.setState({
			modalOpen: false,
			editing: null,
			newData: {}
		  })
		}
	  })
	} else {
	  toast.error('No data entered.')
	}
  }

  resetModal () {
	this.setState({
	  newData: {},
	  modalOpen: null
	})
  }

  handleEdit () {
	let editing

	switch (this.state.swipeViewIndex) {
	  case 0:
		editing = 'waterTracker'
		break
	  case 1:
		editing = 'fertilizerTracker'
		break
	  case 2:
		editing = 'soilCompositionTracker'
		break
	  case 5:
		editing = 'etc'
		break
	}

	this.setState({
	  editing
	})
  }

  openModal (history) {
	let modalOpen

	switch (this.state.swipeViewIndex) {
	  case 0:
		modalOpen = history ? 'waterTracker-history' : 'waterTracker'
		break
	  case 1:
		modalOpen = history ? 'fertilizerTracker-history' : 'fertilizerTracker'
		break
	  case 2:
		modalOpen = history ? 'soilCompositionTracker-history' : 'soilCompositionTracker'
		break
	  case 3:
		modalOpen = history ? 'pestTracker-history' : 'pestTracker'
		break
	  case 4:
		modalOpen = history ? 'diary-history' : 'diary'
		break
	}

	this.setState({
	  modalOpen
	})
  }

  deleteProfile () {

	Meteor.call('profile.delete', this.props.profile._id, (err, response) => {
	  if (err) {
		toast.error(err.message)
	  } else {
		this.setState({
		  modalOpen: false
		})

		this.props.history.push('/catalogue')
	  }
	})

  }

  render () {
	const profile = this.props.profile
	const fertilizerContent = profile.fertilizerTracker && profile.fertilizerTracker.length > 0 ? profile.fertilizerTracker[profile.fertilizerTracker.length - 1].fertilizer : 'N/A'
	let soilCompLastChecked = lastChecked(profile.soilCompositionTracker)
	let soilPh = getLastSoilPh(profile.soilCompositionTracker)
	let soilMoisture = getLastSoilMoisture(profile.soilCompositionTracker)
	let pestLastChecked = lastChecked(profile.pestTracker)
	let pestName = getLastPestName(profile.pestTracker)
	let pestTreatment = getLastPestTreatment(profile.pestTracker)

	//TODO add ability to add more plant photos and view calendar with details for each view (ie fertilizerTracker with date and fertilizer used)

	return (
			<div className="ProfileViewEdit">
			  <img src={profile.image}
				   alt={profile.commonName}
				   title={profile.commonName}
				   className="hero-img"/>


			  <SwipeableViews className={`swipe-view ${this.state.editing && 'editing'}`}
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e, editing: null})}>

				{/* water */}
				<div className="swipe-slide slide-one">

				  <p className="swipe-title title-ming">
					Water - Light <FontAwesomeIcon
						  icon={profile.waterCondition === 'needs-attn' ? faSadTear : profile.waterCondition === 'neutral' ? faMeh : profile.waterCondition === 'unsure' ? faQuestionCircle : faSmile}
						  className="plant-condition-icon"
						  title="water condition"
						  alt={profile.waterCondition === 'needs-attn' ? 'sad face with tear' : profile.waterCondition === 'neutral' ? 'neutral face' : profile.waterCondition === 'unsure' ? 'question mark' : 'smiling face'}/>
				  </p>

				  {this.state.editing === 'waterTracker' ?
						  <React.Fragment>
							<SwipePanelContent icon={faCalendarAlt} iconAlt="calendar" iconTitle="water schedule">
							  <p>Water every <input type="number"
													placeholder="4"
													className="small"
													onChange={(e) => this.updateData(e, 'waterSchedule')}
													defaultValue={profile.waterSchedule || ''}/> days</p>
							</SwipePanelContent>

							<SwipePanelContent icon={faTint} iconAlt="water drop" iconTitle="water preference">
							  <p><input type="text"
										placeholder="Watering Preferences"
										onChange={(e) => this.updateData(e, 'waterPreference')}
										defaultValue={profile.waterPreference || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faSun} iconAlt="sun" iconTitle="light preference">
							  <p><input type="text"
										placeholder="Light Preferences"
										onChange={(e) => this.updateData(e, 'lightPreference')}
										defaultValue={profile.lightPreference || ''}/></p>
							</SwipePanelContent>
						  </React.Fragment>
						  :
						  <React.Fragment>
							<SwipePanelContent icon={faCalendarAlt} iconAlt="calendar" iconTitle="water schedule">
							  <p>Water every {profile.waterSchedule} days</p>
							  <p>Due in {profile.waterSchedule - profile.daysSinceWatered} days</p>
							</SwipePanelContent>

							<SwipePanelContent icon={faTint} iconAlt="water drop" iconTitle="water preference">
							  <p>{profile.waterPreference}</p>
							</SwipePanelContent>

							<SwipePanelContent icon={faSun} iconAlt="sun" iconTitle="light preference">
							  <p>{profile.lightPreference}</p>
							</SwipePanelContent>
						  </React.Fragment>
				  }


				</div>

				{/* fertilizer */}
				<div className="swipe-slide slide-two">
				  <p className="swipe-title title-ming">
					{Meteor.isPro ? 'Fertilizer / Nutrients' : 'Fertilizer'} <FontAwesomeIcon
						  icon={profile.fertilizerCondition === 'needs-attn' ? faSadTear : profile.fertilizerCondition === 'neutral' ? faMeh : faSmile}
						  className="plant-condition-icon"
						  title="fertilizer condition"
						  alt={profile.fertilizerCondition === 'needs-attn' ? 'sad face with tear' : profile.fertilizerCondition === 'neutral' ? 'neutral face' : profile.fertilizerCondition === 'unsure' ? 'question mark' : 'smiling face'}/>
				  </p>

				  {this.state.editing === 'fertilizerTracker' && Meteor.isPro ?
						  <React.Fragment>
							<SwipePanelContent icon={faCalendarAlt} iconAlt="calendar" iconTitle="fertilizer schedule">
							  <p>{Meteor.isPro ? 'Feed' : 'Fertilize'} every <input type="number"
																					placeholder="30"
																					className="small"
																					onChange={(e) => this.updateData(e, 'fertilizerSchedule')}
																					defaultValue={profile.fertilizerSchedule || ''}/> days
							  </p>
							</SwipePanelContent>

							<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="preferred fertilizer">
							  <p><input type="text"
										placeholder="Preferred Fertilizer"
										onChange={(e) => this.updateData(e, 'fertilizer')}
										value={profile.fertilizer || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="compost">
							  <p><input type="text"
										placeholder="Compost"
										onChange={(e) => this.updateData(e, 'compost')}
										value={profile.compost || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faLeaf} iconAlt="leaf" iconTitle="other nutrient amendment">
							  <p><input type="text"
										placeholder="Other Nutrient Amendment"
										onChange={(e) => this.updateData(e, 'nutrient')}
										value={profile.nutrient || ''}/></p>
							</SwipePanelContent>
						  </React.Fragment>
						  : this.state.editing === 'fertilizerTracker' ?
								  <React.Fragment>
						  <SwipePanelContent icon={faCalendarAlt} iconAlt="calendar" iconTitle="fertilizer schedule">
							<p>{Meteor.isPro ? 'Feed' : 'Fertilize'} every <input type="number"
																				  placeholder="30"
																				  className="small"
																				  onChange={(e) => this.updateData(e, 'fertilizerSchedule')}
																				  defaultValue={profile.fertilizerSchedule || ''}/> days
							</p>
						  </SwipePanelContent>

									<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="preferred fertilizer">
									  <p><input type="text"
												placeholder="Preferred Fertilizer"
												onChange={(e) => this.updateData(e, 'fertilizer')}
												value={profile.fertilizer || ''}/></p>
									</SwipePanelContent>
								  </React.Fragment>
						  :
						  <React.Fragment>
							<SwipePanelContent icon={faCalendarAlt} iconAlt="calendar" iconTitle="fertilizer schedule">
							  <p>{Meteor.isPro ? 'Feed' : 'Fertilize'} every {profile.fertilizerSchedule} days</p>
							  <p>Due in {profile.fertilizerSchedule - profile.daysSinceFertilized} days</p>
							</SwipePanelContent>

							{Meteor.isPro ?
									<React.Fragment>
									  {(profile.fertilizer || fertilizerContent) &&
									  <SwipePanelContent icon={faInfoCircle} iconAlt="info"
														 iconTitle="fertilizer">
										<p>{profile.fertilizer || fertilizerContent}</p>
									  </SwipePanelContent>
									  }

									  {profile.compost &&
									  <SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="compost">
										<p>{profile.compost}</p>
									  </SwipePanelContent>
									  }

									  {profile.nutrient &&
									  <SwipePanelContent icon={faLeaf} iconAlt="leaf"
														 iconTitle="other nutrient amendment">
										<p>{profile.nutrient}</p>
									  </SwipePanelContent>
									  }
									</React.Fragment>
									:
									(profile.fertilizer || fertilizerContent) &&
									<SwipePanelContent icon={faInfoCircle} iconAlt="info"
													   iconTitle="fertilizer">
									  <p>{profile.fertilizer || fertilizerContent}</p>
									</SwipePanelContent>
							}
						  </React.Fragment>
				  }


				</div>

				{/* soil comp */}
				<div className="swipe-slide slide-three">
				  <p className="swipe-title title-ming">
					Soil Composition
				  </p>

				  <SwipePanelContent icon={faCalendarAlt} iconAlt="calendar" iconTitle="last checked soil composition">
					<p>{soilCompLastChecked}</p>
				  </SwipePanelContent>

				  {this.state.editing === 'soilCompositionTracker' && Meteor.isPro && profile.category === 'in-ground' ?
						  <React.Fragment>

							<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="tilled">
							  <p><select placeholder="Tilled"
										 onChange={(e) => this.updateData(e, 'tilled')}
										 value={profile.tilled || ''}>
								<option value='' disabled={true}>- Is the soil tilled? -</option>
								<option value={false}>No</option>
								<option value={true}>Yes</option>
							  </select>
							  </p>
							</SwipePanelContent>

							<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="soil type">
							  <p><select placeholder="Soil Type"
										 onChange={(e) => this.updateData(e, 'soilType')}
										 value={profile.soilType || ''}>
								<option value='' disabled={true}>- Select a ground soil type -</option>
								{SoilTypes.map((item, index) => {
								  return <option value={item.type} key={index}>{item.displayName}</option>
								})}
							  </select>
							  </p>
							</SwipePanelContent>

							<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="soil amendment">
							  <p><input type="text"
										placeholder="Soil Amendment"
										onChange={(e) => this.updateData(e, 'soilAmendment')}
										value={profile.soilAmendment || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faTachometerAlt} iconAlt="tachometer" iconTitle="pH level">
							  <p>pH <input type="number"
										   placeholder="6.2"
										   className="small"
										   onChange={(e) => this.updateData(e, 'ph')}/></p>
							</SwipePanelContent>

						  </React.Fragment>
						  :
						  (this.state.editing === 'soilCompositionTracker' && Meteor.isPro && profile.category === 'potted') &&
						  <React.Fragment>
							<SwipePanelContent icon={faMortarPestle} iconAlt="mortar and pestle"
											   iconTitle="soil recipe">
							  <p><input type="text"
										placeholder="Soil Recipe"
										onChange={(e) => this.updateData(e, 'soilRecipe')}
										value={profile.soilRecipe || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faTint} iconAlt="water drop" iconTitle="soil moisture">
							  <p>Moisture Level <input type="number"
													   placeholder="40"
													   className="small"
													   onChange={(e) => this.updateData(e, 'moisture')}/>%</p>
							</SwipePanelContent>
						  </React.Fragment>
				  }

				  {!this.state.editing && Meteor.isPro && profile.category === 'potted' ?
						  <React.Fragment>
							{profile.soilRecipe &&
							<SwipePanelContent icon={faMortarPestle} iconAlt="water drop"
											   iconTitle="soil recipe">
							  <p>{profile.soilRecipe}</p>
							</SwipePanelContent>
							}

							{soilMoisture &&
							<SwipePanelContent icon={faTint} iconAlt="water drop" iconTitle="soil moisture">
							  <p>Moisture Level {soilMoisture}</p>
							</SwipePanelContent>
							}

							{(!profile.soilRecipe && !soilMoisture) &&
							<p>No records available</p>
							}
						  </React.Fragment>
						  : !this.state.editing && Meteor.isPro && profile.category === 'in-ground' ?
								  <React.Fragment>
									<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="tilled">
									  <p>Tilled: {profile.tilled ? 'Yes' : 'No'}</p>
									</SwipePanelContent>

									{profile.soilType &&
									<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="soil type">
									  <p>Soil Type: {profile.soilType}</p>
									</SwipePanelContent>
									}

									{profile.soilAmendment &&
									<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="soil amendment">
									  <p>Soil Amendment: {profile.soilAmendment ? 'Yes' : 'No'}</p>
									</SwipePanelContent>
									}

									{soilPh &&
									<SwipePanelContent icon={faTachometerAlt} iconAlt="tachometer" iconTitle="pH level">
									  <p>pH {soilPh}</p>
									</SwipePanelContent>
									}
								  </React.Fragment>
								  : !this.state.editing &&
								  <React.Fragment>

									{soilMoisture ?
											<SwipePanelContent icon={faTint} iconAlt="water drop"
															   iconTitle="soil moisture">
											  <p>Moisture Level {soilMoisture}</p>
											</SwipePanelContent>
											:
											<p>No records available.</p>
									}
								  </React.Fragment>
				  }

				</div>

				{/* pest */}
				<div className="swipe-slide slide-four">
				  <p className="swipe-title title-ming">Pests</p>

				  <SwipePanelContent icon={faCalendarAlt} iconAlt="calendar" iconTitle="last checked for pests">
					<p>{pestLastChecked}</p>
				  </SwipePanelContent>

				  {pestName &&
				  <SwipePanelContent icon={faBug} iconAlt="bug" iconTitle="pest name">
					<p>{pestName}</p>
				  </SwipePanelContent>
				  }

				  {pestTreatment &&
				  <SwipePanelContent icon={faSprayCan} iconAlt="spray can" iconTitle="pest treatment">
					<p>{pestTreatment}</p>
				  </SwipePanelContent>
				  }

				</div>

				{/* diary */}
				<div className="swipe-slide slide-five">
				  <p className="swipe-title title-ming">Diary</p>

				  <SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="diary">
					{/*<p>{profile.diary[profile.diary.length - 1].entry || 'N/A'}</p>*/}

					<div className="scroll-box">
					  {profile.diary && profile.diary.length > 0 ?
							  profile.diary.map((item, index) => {
								return <div key={index}>
								  <p style={{padding: 0}}><b>Date: {new Date(item.date).toLocaleDateString()}</b></p>
								  <p>{item.entry || 'N/A'}</p>
								</div>
							  })
							  :
							  'No records available.'
					  }
					</div>

				  </SwipePanelContent>
				</div>

				{/* etc */}
				<div className="swipe-slide slide-six">
				  <p className="swipe-title title-ming">Etc</p>

				  {this.state.editing === 'etc' ?
						  <React.Fragment>
							<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="common name">
							  <p><input type="text"
										placeholder="Common Name"
										onChange={(e) => this.updateData(e, 'commonName')}
										value={profile.commonName || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="latin name">
							  <p><input type="text"
										placeholder="Latin Name"
										onChange={(e) => this.updateData(e, 'latinName')}
										value={profile.latinName || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faFilter} iconAlt="filter" iconTitle="category">
							  <p><select placeholder="Category"
										 onChange={(e) => this.updateData(e, 'category')}
										 value={profile.category || ''}>
								<option value='' disabled={true}>- Select a category -</option>
								{this.props.categories && this.props.categories.map((item, index) => {
								  return <option value={item.category} key={index}>{item.displayName}</option>
								})}
							  </select></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faMapMarker} iconAlt="map marker" iconTitle="location bought">
							  <p><input type="text"
										placeholder="Location Bought"
										onChange={(e) => this.updateData(e, 'locationBought')}
										defaultValue={profile.locationBought}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faCalendarAlt} iconAlt="calendar" iconTitle="date bought">
							  <p><input type="date"
										placeholder="Date Bought"
										onBlur={(e) => this.updateData(e, 'dateBought')}
										defaultValue={new Date(profile.dateBought).toJSON().slice(0, 10)}/></p>

							  {/*<DatePicker selected={this.state.newData.dateBought || Date.now()}
										  className="react-datepicker-wrapper"
										  dateFormat="dd-MMMM-yyyy"
										  inline
										  onSelect={(e) => this.updateData(e, 'dateBought')}
										  highlightDates={ProfileViewEdit.getHighlightDates(profile.dateBought, 'dateBought')}/>*/}
							</SwipePanelContent>

							<SwipePanelContent icon={faHome} iconAlt="home" iconTitle="plant location">
							  <p><input type="text"
										placeholder="Plant Location"
										onChange={(e) => this.updateData(e, 'location')}
										defaultValue={profile.location}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faUserFriends} iconAlt="people" iconTitle="companion plants">
							  <p><input type="text"
										placeholder="Companions"
										onChange={(e) => this.updateData(e, 'companions')}
										defaultValue={profile.companions ? profile.companions.join(', ') : null}/></p>
							</SwipePanelContent>
						  </React.Fragment>
						  :
						  <React.Fragment>
							{Meteor.isPro &&
							<SwipePanelContent icon={faFilter} iconAlt="filter" iconTitle="category">
							  <p>{profile.category}</p>
							</SwipePanelContent>
							}

							{profile.locationBought &&
							<SwipePanelContent icon={faMapMarker} iconAlt="map marker" iconTitle="location bought">
							  <p>{profile.locationBought || 'N/A'}</p>
							</SwipePanelContent>
							}

							{profile.dateBought &&
							<SwipePanelContent icon={faCalendarAlt} iconAlt="calendar" iconTitle="date bought">
							  <p>{profile.dateBought ? new Date(profile.dateBought).toLocaleDateString() : 'N/A'}</p>
							</SwipePanelContent>
							}

							<SwipePanelContent icon={faHome} iconAlt="home" iconTitle="plant location">
							  <p>{profile.location || 'N/A'}</p>
							</SwipePanelContent>

							{profile.companions && profile.companions.length > 0 &&
							<SwipePanelContent icon={faUserFriends} iconAlt="people" iconTitle="companion plants">
							  <p>{profile.companions.join(', ')}</p>
							</SwipePanelContent>
							}
						  </React.Fragment>
				  }

				</div>
			  </SwipeableViews>

			  {/* buttons */}
			  <div className="add-data flex-around bottom-nav">
				<FontAwesomeIcon icon={faTrash}
								 className="plant-condition-icon"
								 alt="trash"
								 title="delete"
								 onClick={() => this.setState({modalOpen: 'delete'})}/>

				{this.state.swipeViewIndex < 5 &&
				<React.Fragment>
				  <FontAwesomeIcon icon={faPlus}
								   className="plant-condition-icon"
								   alt='plus'
								   title="add"
								   onClick={() => this.openModal(false)}/>

				  <FontAwesomeIcon icon={faCalendarAlt}
								   className="plant-condition-icon"
								   alt={'calendar'}
								   title="view history"
								   onClick={() => this.openModal(true)}/>
				</React.Fragment>
				}

				{(this.state.swipeViewIndex < 3 || this.state.swipeViewIndex === 5) &&
				<React.Fragment>
				  <FontAwesomeIcon icon={this.state.editing ? faTimes : faPencilAlt}
								   className="plant-condition-icon"
								   alt={this.state.editing ? 'times' : 'pencil'}
								   title={this.state.editing ? 'cancel' : 'edit'}
								   onClick={() => this.state.editing ? this.setState({editing: false}) : this.handleEdit()}/>

				  {this.state.editing &&
				  <FontAwesomeIcon icon={faSave}
								   className="plant-condition-icon"
								   alt="floppy disk"
								   title="save"
								   onClick={() => this.updateProfile(`${this.state.editing}-edit`)}/>
				  }
				</React.Fragment>
				}

			  </div>


			  {/* TODO - make modal situation more efficient, i should really be able to decrease this code, too much repetition */}
			  {/* water */}
			  <ProfileAddEntryModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="waterTracker"
									header="New water entry">
				<DatePicker
						selected={this.state.newData.waterTracker ? this.state.newData.waterTracker.date : Date.now()}
						className="react-datepicker-wrapper"
						dateFormat="dd-MMMM-yyyy"
						popperPlacement="bottom"
						inline
						onSelect={(e) => this.updateData(e, 'waterDate')}
						highlightDates={ProfileViewEdit.getHighlightDates(profile.waterTracker)}/>
			  </ProfileAddEntryModal>


			  <ProfileViewHistoryModal cancel={this.resetModal}
									   show={this.state.modalOpen}
									   type="waterTracker-history"
									   header="Watering History">

				{profile.waterTracker && profile.waterTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
						  </tr>
						  </thead>
						  <tbody>

						  {profile.waterTracker.map((item, index) => {
							return <tr key={index}>
							  <td>{new Date(item.date).toLocaleDateString()}</td>
							</tr>
						  })}

						  </tbody>
						</table>
						:
						<p>No entries recorded</p>
				}

			  </ProfileViewHistoryModal>


			  {/* fertilizer */}
			  <ProfileAddEntryModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="fertilizerTracker"
									header="New fertilizer entry">

				<DatePicker
						selected={this.state.newData.fertilizerTracker ? this.state.newData.fertilizerTracker.date : Date.now()}
						className="react-datepicker-wrapper"
						dateFormat="dd-MMMM-yyyy"
						popperPlacement="bottom"
						inline
						onSelect={(e) => this.updateData(e, 'fertilizerDate')}
						highlightDates={ProfileViewEdit.getHighlightDates(profile.fertilizerTracker, 'fertilizer')}/>

				<input type="text"
					   placeholder="Fertilizer"
					   onChange={(e) => this.updateData(e, 'fertilizer')}/>
			  </ProfileAddEntryModal>

			  <ProfileViewHistoryModal cancel={this.resetModal}
									   show={this.state.modalOpen}
									   type="fertilizerTracker-history"
									   header="Fertilizing History">

				{profile.fertilizerTracker && profile.fertilizerTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
							<th>Fertilizer</th>
						  </tr>
						  </thead>
						  <tbody>

						  {profile.fertilizerTracker.map((item, index) => {
							return <tr key={index}>
							  <td>{new Date(item.date).toLocaleDateString()}</td>
							  <td>{item.fertilizer}</td>
							</tr>
						  })}

						  </tbody>
						</table>
						:
						<p>No entries recorded</p>
				}

			  </ProfileViewHistoryModal>


			  {/* soil comp */}
			  <ProfileAddEntryModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="soilCompositionTracker"
									header="New soil composition entry">

				<DatePicker
						selected={this.state.newData.soilCompositionTracker ? this.state.newData.soilCompositionTracker.date : Date.now()}
						className="react-datepicker-wrapper"
						dateFormat="dd-MMMM-yyyy"
						popperPlacement="bottom"
						inline
						onSelect={(e) => this.updateData(e, 'soilDate')}
						highlightDates={ProfileViewEdit.getHighlightDates(profile.soilCompositionTracker)}/>

				<input type="number"
					   placeholder="pH Reading"
					   onChange={(e) => this.updateData(e, 'ph')}/>

				<input type="number"
					   placeholder="Soil Moisture %"
					   onChange={(e) => this.updateData(e, 'moisture')}/>
			  </ProfileAddEntryModal>

			  <ProfileViewHistoryModal cancel={this.resetModal}
									   show={this.state.modalOpen}
									   type="soilCompositionTracker-history"
									   header="Soil Composition History">

				{profile.soilCompositionTracker && profile.soilCompositionTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
							<th>pH</th>
							<th>Moisture</th>
						  </tr>
						  </thead>
						  <tbody>

						  {profile.soilCompositionTracker.map((item, index) => {
							return <tr key={index}>
							  <td>{new Date(item.date).toLocaleDateString()}</td>
							  <td>{item.ph || 'N/A'}</td>
							  <td>{item.moisture ? `${Math.round(item.moisture * 100)}%` : 'N/A'}</td>
							</tr>
						  })}
						  </tbody>
						</table>
						:
						<p>No entries recorded</p>
				}

			  </ProfileViewHistoryModal>


			  {/* pests */}
			  <ProfileAddEntryModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="pestTracker"
									header="New pest entry">

				<DatePicker selected={this.state.newData.pestTracker ? this.state.newData.pestTracker.date : Date.now()}
							className="react-datepicker-wrapper"
							dateFormat="dd-MMMM-yyyy"
							popperPlacement="bottom"
							inline
							onSelect={(e) => this.updateData(e, 'pestDate')}
							highlightDates={ProfileViewEdit.getHighlightDates(profile.pestTracker)}/>

				<input type="text"
					   placeholder="Pest"
					   onChange={(e) => this.updateData(e, 'pest')}/>

				<input type="text"
					   placeholder="Treatment Method"
					   onChange={(e) => this.updateData(e, 'treatment')}/>
			  </ProfileAddEntryModal>


			  <ProfileViewHistoryModal cancel={this.resetModal}
									   show={this.state.modalOpen}
									   type="pestTracker-history"
									   header="Pest History">


				{profile.pestTracker && profile.pestTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
							<th>Pest</th>
							<th>Treatment</th>
						  </tr>
						  </thead>
						  <tbody>

						  {profile.pestTracker.map((item, index) => {
							return <tr key={index}>
							  <td>{new Date(item.date).toLocaleDateString()}</td>
							  <td>{item.pest || 'N/A'}</td>
							  <td>{item.treatment || 'N/A'}</td>
							</tr>
						  })}

						  </tbody>
						</table>
						:
						<p>No entries recorded</p>
				}

			  </ProfileViewHistoryModal>


			  {/* diary */}
			  <ProfileAddEntryModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="diary"
									header="Add diary">

			  <textarea rows="3"
						placeholder="Diary"
						onChange={(e) => this.updateData(e, 'diary')}/>
			  </ProfileAddEntryModal>

			  <ProfileViewHistoryModal cancel={this.resetModal}
									   show={this.state.modalOpen}
									   type="diary-history"
									   header="Diary History">


				{profile.diary && profile.diary.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
							<th>Entry</th>
						  </tr>
						  </thead>
						  <tbody>

						  {profile.diary.map((item, index) => {
							return <tr key={index}>
							  <td>{new Date(item.date).toLocaleDateString()}</td>
							  <td>{item.entry || 'N/A'}</td>
							</tr>
						  })}

						  </tbody>
						</table>
						:
						<p>No diary recorded</p>
				}

			  </ProfileViewHistoryModal>


			  {/* the rest */}
			  {/*<ProfileAddEntryModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="etc"
									header="Edit other details">

				<input type="text"
					   placeholder="Location Bought"
					   onChange={(e) => this.updateData(e, 'locationBought')}
					   defaultValue={profile.locationBought}/>

				<DatePicker selected={this.state.newData.dateBought || Date.now()}
							className="react-datepicker-wrapper"
							dateFormat="dd-MMMM-yyyy"
							popperPlacement="bottom"
							onSelect={(e) => this.updateData(e, 'dateBought')}
							highlightDates={ProfileViewEdit.getHighlightDates(profile.dateBought, 'dateBought')}/>

				<input type="text"
					   placeholder="Location In Home"
					   onChange={(e) => this.updateData(e, 'location')}
					   defaultValue={profile.location}/>

				<input type="text"
					   placeholder="Companions"
					   onChange={(e) => this.updateData(e, 'companions')}
					   defaultValue={profile.companions ? profile.companions.join(', ') : null}/>
			  </ProfileAddEntryModal>*/}


			  <ProfileAddEntryModal save={this.deleteProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="delete"
									header="Are you sure you want to delete this profile?">

			  </ProfileAddEntryModal>
			</div>
	)
  }
}

ProfileViewEdit.propTypes = {
  profile: PropTypes.object.isRequired
}

export default withTracker((props) => {
  const id = props.match.params.id
  const profile = Profile.findOne({_id: id})
  const categories = Category.find({}).fetch()

  profile.daysSinceFertilized = getDaysSinceAction(profile.fertilizerTracker)
  profile.fertilizerCondition = getPlantCondition(profile.fertilizerTracker, profile.daysSinceFertilized, profile.fertilizerSchedule)

  profile.daysSinceWatered = getDaysSinceAction(profile.waterTracker)
  profile.waterCondition = getPlantCondition(profile.waterTracker, profile.daysSinceWatered, profile.waterSchedule)

  profile.soilCondition = getSoilCondition(profile.soilCompositionTracker)

  return {
	profile: profile,
	categories
  }
})(ProfileViewEdit)

