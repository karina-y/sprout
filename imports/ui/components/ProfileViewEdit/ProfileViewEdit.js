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
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar'
import {
  getDaysSinceAction, getLastPestName, getLastPestTreatment, getLastSoilMoisture, getLastSoilPh,
  getPlantCondition, lastChecked, lastFertilizerUsed, sortByLastDate
} from '../../../utils/plantData'
import Profile from '/imports/api/Profile/Profile'
import { toast } from 'react-toastify'
import ProfileAddEntryModal from '../Shared/ProfileAddEntryModal'
import ProfileViewHistoryModal from '../Shared/ProfileViewHistoryModal'
import Category from '/imports/api/Category/Category'
import WaterPro from '../SharedProfile/SwipeViews/WaterPro'
import FertilizerPro from '../SharedProfile/SwipeViews/FertilizerPro'
import PruningDeadheadingPro from '../SharedProfile/SwipeViews/PruningDeadheadingPro'
import SoilCompPro from '../SharedProfile/SwipeViews/SoilCompPro'
import Pest from '../SharedProfile/SwipeViews/Pest'
import Diary from '../SharedProfile/SwipeViews/Diary'
import Etc from '../SharedProfile/SwipeViews/Etc'
import Water from '../SharedProfile/SwipeViews/Water'
import Fertilizer from '../SharedProfile/SwipeViews/Fertilizer'
import SoilComp from '../SharedProfile/SwipeViews/SoilComp'

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
	  //special case here where the client is pruning and deadheading in the same date entry
	  if (type === 'pruningDeadheadingTracker') {
		tracker = 'pruningTracker'

		if (newProfileData[tracker]) {
		  newProfileData[tracker].date = new Date(e)
		} else {
		  newProfileData[tracker] = {
			date: new Date(e)
		  }
		}

		tracker = 'deadheadingTracker'
		//will add the next one below
	  }

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

	} else if (type === 'pruning') {

	  if (newProfileData.pruningTracker) {
		newProfileData.pruningTracker[type] = e.target.value
	  } else {
		newProfileData.pruningTracker = {
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

	if (type === 'pruningDeadheadingTracker') {
	  type = this.state.pruneType
	}

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
		case 'pruningDeadheadingTracker-edit':
		  data = {
			pruningSchedule: parseInt(newProfileData.pruningSchedule || oldProfileData.pruningSchedule),
			deadheadingSchedule: parseInt(newProfileData.deadheadingSchedule || oldProfileData.deadheadingSchedule),
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
		case 'pruningDeadheadingTracker':
		  data = {
			pruningTracker: newProfileData.pruningTracker,
			deadheadingTracker: newProfileData.deadheadingTracker,
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
		editing = 'pruningDeadheadingTracker'
		break
	  case 3:
		editing = 'soilCompositionTracker'
		break
	  case 6:
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
		modalOpen = history ? 'pruningDeadheadingTracker-history' : 'pruningDeadheadingTracker'
		break
	  case 3:
		modalOpen = history ? 'soilCompositionTracker-history' : 'soilCompositionTracker'
		break
	  case 4:
		modalOpen = history ? 'pestTracker-history' : 'pestTracker'
		break
	  case 5:
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
				{Meteor.isPro ?
						<WaterPro profile={profile} updateData={this.updateData} editing={this.state.editing}/>
						:
						<Water profile={profile} updateData={this.updateData} editing={this.state.editing}/>
				}


				{/* fertilizer */}
				{Meteor.isPro ?
						<FertilizerPro profile={profile}
									   updateData={this.updateData}
									   fertilizerContent={fertilizerContent}
									   editing={this.state.editing}/>
						:
						<Fertilizer profile={profile}
									updateData={this.updateData}
									fertilizerContent={fertilizerContent}
									editing={this.state.editing}/>
				}

				{/* pruning/deadheading */}
				{Meteor.isPro &&
				<PruningDeadheadingPro profile={profile}
									   updateData={this.updateData}
									   editing={this.state.editing}/>
				}

				{/* soil comp */}
				{Meteor.isPro ?
						<SoilCompPro profile={profile}
									 updateData={this.updateData}
									 soilCompLastChecked={soilCompLastChecked}
									 soilMoisture={soilMoisture}
									 soilPh={soilPh}
									 editing={this.state.editing}/>
						:
						<SoilComp profile={profile}
								  updateData={this.updateData}
								  soilCompLastChecked={soilCompLastChecked}
								  soilMoisture={soilMoisture}
								  soilPh={soilPh}
								  editing={this.state.editing}/>
				}


				{/* pest */}
				<Pest profile={profile}
					  updateData={this.updateData}
					  pestLastChecked={pestLastChecked}
					  pestName={pestName}
					  pestTreatment={pestTreatment}/>

				{/* diary */}
				<Diary profile={profile} updateData={this.updateData}/>

				{/* etc */}
				<Etc profile={profile} updateData={this.updateData} editing={this.state.editing}/>

			  </SwipeableViews>

			  {/* buttons */}
			  <div className="add-data flex-around bottom-nav">
				<FontAwesomeIcon icon={faTrash}
								 className="plant-condition-icon"
								 alt="trash"
								 title="delete"
								 onClick={() => this.setState({modalOpen: 'delete'})}/>

				{this.state.swipeViewIndex < 6 &&
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

				{(this.state.swipeViewIndex < 4 || this.state.swipeViewIndex > 5) ?
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


			  {/* pruning */}
			  <ProfileAddEntryModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="pruningDeadheadingTracker"
									header="New pruning or deadheading entry">

				{!this.state.pruneType &&
				<div className="flex-between">
				  <label>Pruned <input type="radio"
									   checked={this.state.pruneType === 'pruningTracker'}
									   onChange={() => this.state.pruneType !== 'pruningTracker' ? this.setState({pruneType: 'pruningTracker'}) : this.setState({
										 pruneType: null,
										 newData: null
									   })}/></label>
				  <label>Deadheaded <input type="radio"
										   checked={this.state.pruneType === 'deadheadingTracker'}
										   onChange={() => this.state.pruneType !== 'deadheadingTracker' ? this.setState({pruneType: 'deadheadingTracker'}) : this.setState({
											 pruneType: null,
											 newData: null
										   })}/></label>
				  <label>Both <input type="radio"
									 checked={this.state.pruneType === 'pruningDeadheadingTracker'}
									 onChange={() => this.state.pruneType !== 'pruningDeadheadingTracker' ? this.setState({pruneType: 'pruningDeadheadingTracker'}) : this.setState({
									   pruneType: null,
									   newData: null
									 })}/></label>
				</div>
				}

				{this.state.pruneType &&
				<DatePicker
						selected={this.state.newData.pruningDeadheadingTracker ? this.state.newData.pruningDeadheadingTracker.date : Date.now()}
						className="react-datepicker-wrapper"
						dateFormat="dd-MMMM-yyyy"
						popperPlacement="bottom"
						inline
						onSelect={(e) => this.state.pruneType ? this.updateData(e, this.state.pruneType, this.state.pruneType) : toast.warning('Please select an action below first.')}
						highlightDates={ProfileViewEdit.getHighlightDates(profile.pruningDeadheadingTracker, 'pruning')}/>
				}

			  </ProfileAddEntryModal>


			  <ProfileViewHistoryModal cancel={this.resetModal}
									   show={this.state.modalOpen}
									   type="pruningDeadheadingTracker-history"
									   header="Pruning - Deadheading History">

				{profile.pruningDeadheadingTracker && profile.pruningDeadheadingTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
							<th>Action</th>
						  </tr>
						  </thead>
						  <tbody>

						  {profile.pruningDeadheadingTracker.map((item, index) => {
							return <tr key={index}>
							  <td>{new Date(item.date).toLocaleDateString()}</td>
							  <td>{item.action}</td>
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

				<p className="modern-input">
				  {profile.category === 'potted' ?
						  <input type="number"
								 placeholder="Soil Moisture %"
								 onChange={(e) => this.updateData(e, 'moisture')}/>
						  :
						  <input type="number"
								 placeholder="pH Reading"
								 onChange={(e) => this.updateData(e, 'ph')}/>
				  }
				</p>

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

  profile.daysSincePruned = getDaysSinceAction(profile.pruningTracker)
  profile.daysSinceDeadheaded = getDaysSinceAction(profile.deadheadingTracker)

  if (profile.pruningTracker || profile.deadheadingTracker) {
	const pruning = profile.pruningTracker || []
	const deadheading = profile.deadheadingTracker || []

	for (let i = 0; i < pruning.length; i++) {
	  pruning[i].action = 'Pruned'
	}

	for (let i = 0; i < deadheading.length; i++) {
	  deadheading[i].action = 'Deadheaded'
	}

	profile.pruningDeadheadingTracker = sortByLastDate(pruning.concat(deadheading))
  } else {
	profile.pruningDeadheadingTracker = null
  }
  // profile.soilCondition = getSoilCondition(profile.soilCompositionTracker)

  return {
	profile: profile,
	categories
  }
})(ProfileViewEdit)

