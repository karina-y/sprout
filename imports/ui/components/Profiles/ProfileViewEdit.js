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

import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faMeh } from '@fortawesome/free-solid-svg-icons/faMeh'
import { faSadTear } from '@fortawesome/free-solid-svg-icons/faSadTear'
import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle'
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar'
import {
  getDaysSinceAction, getLastPestName, getLastPestTreatment, getLastSoilMoisture, getLastSoilPh,
  getPlantCondition, lastChecked, lastFertilizerUsed, sortByLastDate
} from '../../../utils/plantData'
import Profile from '/imports/api/Profile/Profile'
import { toast } from 'react-toastify'
import SwipePanelContent from '../Shared/SwipePanelContent'
import ProfileAddEntryModal from '../Shared/ProfileAddEntryModal'
import ProfileViewHistoryModal from '../Shared/ProfileViewHistoryModal'
import Category from '/imports/api/Category/Category'
import SoilTypes from '../../../utils/soilTypes'
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'

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

	if ((type === 'dateBought' || type === 'datePlanted') && items) {
	  dates.push(new Date(items))
	} else if (items && items.length > 0) {
	  for (let i = 0; i < items.length; i++) {
		dates.push(new Date(items[i].date))
	  }
	}

	return dates
  }

  updatePhoto (e) {
	let files = e.target.files

	if (files.length === 0) {
	  return
	}

	let file = files[0]

	let fileReader = new FileReader()

	fileReader.onload = function (event) {
	  let dataUrl = event.target.result
	  template.dataUrl.set(dataUrl)
	}

	fileReader.readAsDataURL(file)
  }

  updateData (e, type, tracker, addingEntry) {

	const newProfileData = this.state.newData

	if (tracker && addingEntry) {
	  //this is a new entry with non-date data (ie fertilizer type used)
	  if (newProfileData[tracker]) {
		newProfileData[tracker][type] = e.target.value
	  } else {
		newProfileData[tracker] = {
		  [type]: e.target.value
		}
	  }

	} else if (tracker) {

	  //this is a new date entry only
	  if (newProfileData[tracker]) {
		newProfileData[tracker].date = new Date(e)
	  } else {
		newProfileData[tracker] = {
		  date: new Date(e)
		}
	  }
	} else if (type === 'companions') {

	  const stripped = e.target.value.replace(/\s*,\s*/g, ',')
	  newProfileData[type] = stripped.split(',')

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

	} else if (type === 'dateBought' || type === 'datePlanted') {
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

	} else if (type === 'waterScheduleAuto') {
	  if (newProfileData[type]) {
		newProfileData[type] = !newProfileData[type]
	  } else {
		newProfileData[type] = !this.props.profile[type]
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
	let changeTitle = false

	if (!type || !newProfileData || JSON.stringify(newProfileData) === '{}') {
	  toast.error('No data entered.')
	} else {
	  switch (type) {
		case 'waterTracker-edit':
		  //doing the waterscheduleauto checks because they're bools
		  data = {
			waterPreference: newProfileData.waterPreference || oldProfileData.waterPreference,
			lightPreference: newProfileData.lightPreference || oldProfileData.lightPreference,
			waterSchedule: parseInt(newProfileData.waterSchedule || oldProfileData.waterSchedule),
			waterScheduleAuto: newProfileData.waterScheduleAuto !== null ? newProfileData.waterScheduleAuto : oldProfileData.waterScheduleAuto !== null ? oldProfileData.waterScheduleAuto : false
		  }
		  break
		case 'fertilizerTracker-edit':
		  data = {
			fertilizerSchedule: parseInt(newProfileData.fertilizerSchedule || oldProfileData.fertilizerSchedule),
			fertilizer: newProfileData.fertilizer,
			compost: newProfileData.compost,
			nutrient: newProfileData.nutrient,
		  }
		  break
		case 'etc-edit':
		  data = {
			commonName: newProfileData.commonName || oldProfileData.commonName,
			latinName: newProfileData.latinName || oldProfileData.latinName,
			toxicity: newProfileData.toxicity || oldProfileData.toxicity,
			category: newProfileData.category || oldProfileData.category,
			location: newProfileData.location || oldProfileData.location,
			locationBought: newProfileData.locationBought || oldProfileData.locationBought,
			dateBought: new Date(newProfileData.dateBought || oldProfileData.dateBought),
			datePlanted: new Date(newProfileData.datePlanted || oldProfileData.datePlanted),
			companions: newProfileData.companions || oldProfileData.companions
		  }

		  if (newProfileData.latinName !== oldProfileData.latinName || newProfileData.commonName !== oldProfileData.commonName) {
			changeTitle = true
		  }
		  break
		case 'soilCompositionTracker-edit':
		  if (newProfileData.category === 'in-ground' || (!newProfileData.category && oldProfileData.category === 'in-ground')) {
			data = {
			  soilAmendment: newProfileData.soilAmendment,
			  soilType: newProfileData.soilType,
			  tilled: newProfileData.tilled === 'true'
			}
		  } else {
			data = {
			  soilRecipe: newProfileData.soilRecipe
			}
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

			if (changeTitle) {
			  Session.set('pageTitle', newProfileData.latinName || newProfileData.commonName)
			}

			//reset the data
			this.resetModal()
		  }
		})
	  } else {
		toast.error('No data entered.')
	  }
	}

  }

  resetModal () {
	this.setState({
	  modalOpen: false,
	  editing: null,
	  pruneType: null,
	  newData: {}
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
	const fertilizerContent = lastFertilizerUsed(profile.fertilizerTracker)
	let soilCompLastChecked = lastChecked(profile.soilCompositionTracker)
	let soilPh = getLastSoilPh(profile.soilCompositionTracker)
	let soilMoisture = getLastSoilMoisture(profile.soilCompositionTracker)
	let pestLastChecked = lastChecked(profile.pestTracker)
	let pestName = getLastPestName(profile.pestTracker)
	let pestTreatment = getLastPestTreatment(profile.pestTracker)

	//TODO add ability to add more plant photos and view calendar with details for each view (ie fertilizerTracker with date and fertilizer used)

	return (
			<div className="ProfileViewEdit">
			  {this.state.editing === 'etc' ?
					  <div className="plant-photo editing">
						<img src={profile.image}
							 alt={profile.commonName}
							 title={profile.commonName}/>

						{/*<FontAwesomeIcon icon={faCamera}
										 size="3x"
										 className="plant-condition-icon"
										 alt="camera"
										 title="update photo"/>

						<input type="file" name="plant photo" onChange={this.updatePhoto}/>*/}
					  </div>
					  :
					  <div className="plant-photo">
						<img src={profile.image}
							 alt={profile.commonName}
							 title={profile.commonName}/>
					  </div>
			  }

			  <SwipeableViews className={`swipe-view ${this.state.editing && 'editing'}`}
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e, editing: null})}>

				{/* water */}
				<div className="swipe-slide">

				  <p className="swipe-title title-ming">
					Water - Light <FontAwesomeIcon
						  icon={profile.waterCondition === 'needs-attn' ? faSadTear : profile.waterCondition === 'neutral' ? faMeh : profile.waterCondition === 'unsure' ? faQuestionCircle : faSmile}
						  className="plant-condition-icon"
						  title="water condition"
						  alt={profile.waterCondition === 'needs-attn' ? 'sad face with tear' : profile.waterCondition === 'neutral' ? 'neutral face' : profile.waterCondition === 'unsure' ? 'question mark' : 'smiling face'}/>
				  </p>

				  {this.state.editing === 'waterTracker' ?
						  <React.Fragment>
							<SwipePanelContent icon="schedule"
											   iconTitle="water schedule">
							  <p className="modern-input">Water every <input type="number"
																			 placeholder="4"
																			 className="small"
																			 onChange={(e) => this.updateData(e, 'waterSchedule')}
																			 defaultValue={profile.waterSchedule || ''}/> days
							  </p>
							</SwipePanelContent>

							<SwipePanelContent icon="water">
							  <p className="modern-input">
								<label>watering preferences</label>
								<input type="text" placeholder="Watering Preferences"
									   onChange={(e) => this.updateData(e, 'waterPreference')}
									   defaultValue={profile.waterPreference || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon="lightPreference">
							  <p className="modern-input">
								<label>light preferences</label>
								<input type="text"
									   onChange={(e) => this.updateData(e, 'lightPreference')}
									   defaultValue={profile.lightPreference || ''}/></p>
							</SwipePanelContent>
						  </React.Fragment>
						  :
						  <React.Fragment>
							<SwipePanelContent icon="schedule"
											   iconTitle="water schedule">
							  <p>Water every {profile.waterSchedule} days</p>
							  {!profile.waterScheduleAuto &&
							  <p>Due in {profile.waterSchedule - profile.daysSinceWatered - 1} days</p>
							  }
							</SwipePanelContent>

							<SwipePanelContent icon="water"
											   iconTitle="water preference">
							  <p>{profile.waterPreference}</p>
							</SwipePanelContent>

							<SwipePanelContent icon="lightPreference">
							  <p>{profile.lightPreference}</p>
							</SwipePanelContent>
						  </React.Fragment>
				  }

				</div>

				{/* fertilizer */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">
					Fertilizer <FontAwesomeIcon
						  icon={profile.fertilizerCondition === 'needs-attn' ? faSadTear : profile.fertilizerCondition === 'neutral' ? faMeh : faSmile}
						  className="plant-condition-icon"
						  title="fertilizer condition"
						  alt={profile.fertilizerCondition === 'needs-attn' ? 'sad face with tear' : profile.fertilizerCondition === 'neutral' ? 'neutral face' : profile.fertilizerCondition === 'unsure' ? 'question mark' : 'smiling face'}/>
				  </p>


				  <SwipePanelContent icon="schedule" iconTitle="fertilizer schedule">
					{this.state.editing === 'fertilizerTracker' ?
							<p className="modern-input">Fertilize every <input type="number"
																			   placeholder="30"
																			   className="small"
																			   onChange={(e) => this.updateData(e, 'fertilizerSchedule')}
																			   defaultValue={profile.fertilizerSchedule || ''}/> days
							</p>
							: profile.fertilizerSchedule ?
									<React.Fragment>
									  <p>Fertilize every {profile.fertilizerSchedule} days</p>
									  <p>Due in {profile.fertilizerSchedule - profile.daysSinceFertilized - 1} days</p>
									</React.Fragment>
									:
									<p>No schedule set</p>
					}
				  </SwipePanelContent>

				  {this.state.editing === 'fertilizerTracker' ?
						  <SwipePanelContent icon="fertilizer">
							<p className="modern-input">
							  <label>preferred fertilizer</label>
							  <input type="text"
									 onChange={(e) => this.updateData(e, 'fertilizer')}
									 defaultValue={profile.fertilizer || ''}/></p>
						  </SwipePanelContent>
						  : (profile.fertilizer || fertilizerContent) &&
						  <SwipePanelContent icon="fertilizer">
							<p>{profile.fertilizer || fertilizerContent}</p>
						  </SwipePanelContent>
				  }

				</div>

				{/* soil comp */}
				<div className="swipe-slide slide-three">
				  <p className="swipe-title title-ming">
					Soil Composition
				  </p>

				  <SwipePanelContent icon="schedule"
									 iconTitle="last checked soil composition">
					<p>{soilCompLastChecked}</p>
				  </SwipePanelContent>


				  {profile.category === 'in-ground' ?
						  <SwipePanelContent icon="soilMoisture">
							{soilMoisture ?
									<p>Moisture Level {soilMoisture}</p>
									:
									<p>No records available.</p>
							}
						  </SwipePanelContent>
						  :
						  <SwipePanelContent icon="soilMoisture">
							{soilPh ?
									<p>Soil pH {soilPh}</p>
									:
									<p>No records available.</p>
							}
						  </SwipePanelContent>
				  }

				</div>

				{/* pest */}
				<div className="swipe-slide slide-four">
				  <p className="swipe-title title-ming">Pests</p>

				  <SwipePanelContent icon="schedule" iconTitle="last checked for pests">
					<p>{pestLastChecked}</p>
				  </SwipePanelContent>

				  {pestName &&
				  <SwipePanelContent icon="pest">
					<p>{pestName}</p>
				  </SwipePanelContent>
				  }

				  {pestTreatment &&
				  <SwipePanelContent icon="pestTreatment">
					<p>{pestTreatment}</p>
				  </SwipePanelContent>
				  }

				</div>

				{/* diary */}
				<div className="swipe-slide slide-five">
				  <p className="swipe-title title-ming">Diary</p>

				  <SwipePanelContent icon="diary">
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
							<SwipePanelContent icon="info" iconTitle="common name">
							  <p className="modern-input">
								<label>common name</label>
								<input type="text"
									   onChange={(e) => this.updateData(e, 'commonName')}
									   defaultValue={profile.commonName || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon="info" iconTitle="latin name">
							  <p className="modern-input">
								<label>latin name</label>
								<input type="text"
									   onChange={(e) => this.updateData(e, 'latinName')}
									   defaultValue={profile.latinName || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon="category">
							  <p className="modern-input">
								<label>category</label>
								<select onChange={(e) => this.updateData(e, 'category')}
										defaultValue={profile.category || ''}>
								  <option value='' disabled={true}>- Select a category -</option>
								  {this.props.categories && this.props.categories.map((item, index) => {
									return <option value={item.category} key={index}>{item.displayName}</option>
								  })}
								</select></p>
							</SwipePanelContent>

							<SwipePanelContent icon="toxicity">
							  <p className="modern-input">
								<label>toxicity</label>
								<input type="text"
									   placeholder="Toxicity (ie poisonous to dogs if leaves are consumed)"
									   onChange={(e) => this.updateData(e, 'toxicity')}
									   defaultValue={profile.toxicity || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon="locationBought">
							  <p className="modern-input">
								<label>location bought</label>
								<input type="text"
									   onChange={(e) => this.updateData(e, 'locationBought')}
									   defaultValue={profile.locationBought}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon="schedule" iconTitle="date bought">
							  <p className="modern-input">
								<label>date bought</label>
								<input type="date"
									   onBlur={(e) => this.updateData(e, 'dateBought')}
									   defaultValue={profile.dateBought ? new Date(profile.dateBought).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
							  </p>

							  {/*<DatePicker selected={this.state.newData.dateBought || Date.now()}
										  className="react-datepicker-wrapper"
										  dateFormat="dd-MMMM-yyyy"
										  inline
										  onSelect={(e) => this.updateData(e, 'dateBought')}
										  highlightDates={ProfileViewEdit.getHighlightDates(profile.dateBought, 'dateBought')}/>*/}
							</SwipePanelContent>

							<SwipePanelContent icon="schedule"
											   iconTitle={profile.category === 'potted' ? 'Date Potted' : 'Date Planted'}>
							  <p className="modern-input">
								<label>{profile.category === 'potted' ? 'date potted' : 'date planted'}</label>
								<input type="date"
									   onBlur={(e) => this.updateData(e, 'datePlanted')}
									   defaultValue={profile.datePlanted ? new Date(profile.datePlanted).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
							  </p>
							</SwipePanelContent>

							<SwipePanelContent icon="plantLocation">
							  <p className="modern-input">
								<label>plant location</label>
								<input type="text"
									   onChange={(e) => this.updateData(e, 'location')}
									   defaultValue={profile.location}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon="companions">
							  <p className="modern-input">
								<label>companions</label>
								<input type="text"
									   onChange={(e) => this.updateData(e, 'companions')}
									   defaultValue={profile.companions ? profile.companions.join(', ') : null}/></p>
							</SwipePanelContent>
						  </React.Fragment>
						  :
						  <React.Fragment>
							<SwipePanelContent icon="category">
							  <p>{profile.category}</p>
							</SwipePanelContent>

							{profile.toxicity &&
							<SwipePanelContent icon="toxicity">
							  <p>{profile.toxicity || 'N/A'}</p>
							</SwipePanelContent>
							}

							{profile.locationBought &&
							<SwipePanelContent icon="locationBought">
							  <p>{profile.locationBought || 'N/A'}</p>
							</SwipePanelContent>
							}

							{profile.dateBought &&
							<SwipePanelContent icon="schedule" iconTitle="date bought">
							  <p>{profile.dateBought ? new Date(profile.dateBought).toLocaleDateString() : 'N/A'}</p>
							</SwipePanelContent>
							}

							{profile.datePlanted &&
							<SwipePanelContent icon="schedule" iconTitle="date planted">
							  <p>{profile.datePlanted ? new Date(profile.datePlanted).toLocaleDateString() : 'N/A'}</p>
							</SwipePanelContent>
							}

							<SwipePanelContent icon="plantLocation">
							  <p>{profile.location || 'N/A'}</p>
							</SwipePanelContent>

							{profile.companions && profile.companions.length > 0 &&
							<SwipePanelContent icon="companions">
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

				  <FontAwesomeIcon icon={faCalendar}
								   className="plant-condition-icon"
								   alt={'calendar'}
								   title="view history"
								   onClick={() => this.openModal(true)}/>
				</React.Fragment>
				}

				{(this.state.swipeViewIndex < 2 || this.state.swipeViewIndex === 5) ?
						<React.Fragment>
						  <FontAwesomeIcon icon={this.state.editing ? faTimes : faPencilAlt}
										   className="plant-condition-icon"
										   alt={this.state.editing ? 'times' : 'pencil'}
										   title={this.state.editing ? 'cancel' : 'edit'}
										   onClick={() => this.state.editing ? this.resetModal() : this.handleEdit()}/>

						  {this.state.editing &&
						  <FontAwesomeIcon icon={faSave}
										   className="plant-condition-icon"
										   alt="floppy disk"
										   title="save"
										   onClick={() => this.updateProfile(`${this.state.editing}-edit`)}/>
						  }
						</React.Fragment>
						: ''
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
						onSelect={(e) => this.updateData(e, 'waterDate', 'waterTracker')}
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
						onSelect={(e) => this.updateData(e, 'fertilizerDate', 'fertilizerTracker')}
						highlightDates={ProfileViewEdit.getHighlightDates(profile.fertilizerTracker, 'fertilizer')}/>

				<p className="modern-input for-modal">
				  <label>fertilizer used</label>
				  <input type="text"
						 onChange={(e) => this.updateData(e, 'fertilizer', 'fertilizerTracker', true)}/>
				</p>
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
						onSelect={(e) => this.updateData(e, 'soilDate', 'soilCompositionTracker')}
						highlightDates={ProfileViewEdit.getHighlightDates(profile.soilCompositionTracker)}/>

				{profile.category === 'potted' ?
						<p className="modern-input for-modal">
						  <label>soil moisture %</label>
						  <input type="number"
								 onChange={(e) => this.updateData(e, 'moisture')}/>
						</p>
						:
						<p className="modern-input for-modal">
						  <label>pH reading</label>
						  <input type="number"
								 onChange={(e) => this.updateData(e, 'ph')}/>
						</p>
				}

			  </ProfileAddEntryModal>

			  <ProfileViewHistoryModal cancel={this.resetModal}
									   show={this.state.modalOpen}
									   type="soilCompositionTracker-history"
									   header="Soil Composition History">

				{profile.soilCompositionTracker && profile.soilCompositionTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th width="50%">Date</th>
							{profile.category === 'potted' ?
									<th width="50%">Moisture</th>
									:
									<th width="50%">pH</th>
							}
						  </tr>
						  </thead>
						  <tbody>

						  {profile.soilCompositionTracker.map((item, index) => {
							return <tr key={index}>
							  <td>{new Date(item.date).toLocaleDateString()}</td>
							  {profile.category === 'potted' ?
									  <td>{item.moisture ? `${Math.round(item.moisture * 100)}%` : 'N/A'}</td>
									  :
									  <td>{item.ph || 'N/A'}</td>
							  }
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
							onSelect={(e) => this.updateData(e, 'pestDate', 'pestTracker')}
							highlightDates={ProfileViewEdit.getHighlightDates(profile.pestTracker)}/>

				<p className="modern-input for-modal">
				  <label>pest treated</label>
				  <input type="text"
						 onChange={(e) => this.updateData(e, 'pest', 'pestTracker', true)}/>
				</p>

				<p className="modern-input for-modal">
				  <label>treatment method</label>
				  <input type="text"
						 onChange={(e) => this.updateData(e, 'treatment', 'pestTracker', true)}/>
				</p>
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
									type="diary">

				<p className="modern-input for-modal">
				  <label>new diary entry</label>
				  <textarea rows="6"
							onChange={(e) => this.updateData(e, 'diary')}/>
				</p>
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
									header="Are you sure you want to delete this plant's entire profile?">

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

  //sort the data
  profile.waterTracker = sortByLastDate(profile.waterTracker)
  profile.fertilizerTracker = sortByLastDate(profile.fertilizerTracker)
  profile.soilCompositionTracker = sortByLastDate(profile.soilCompositionTracker)
  profile.pestTracker = sortByLastDate(profile.pestTracker)
  profile.diary = sortByLastDate(profile.diary)

  profile.daysSinceWatered = getDaysSinceAction(profile.waterTracker)
  profile.waterCondition = getPlantCondition(profile.waterTracker, profile.daysSinceWatered, profile.waterSchedule)

  profile.daysSinceFertilized = getDaysSinceAction(profile.fertilizerTracker)
  profile.fertilizerCondition = getPlantCondition(profile.fertilizerTracker, profile.daysSinceFertilized, profile.fertilizerSchedule)

  return {
	profile: profile,
	categories
  }
})(ProfileViewEdit)

