import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import './PlantViewEdit.scss'
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
import Plant from '/imports/api/Plant/Plant'
import { toast } from 'react-toastify'
import PlantAddEntryModal from '../Shared/PlantAddEntryModal'
import PlantViewHistoryModal from '../Shared/PlantViewHistoryModal'
import Category from '/imports/api/Category/Category'
import WaterPro from '../SharedPlant/SwipeViews/WaterPro'
import FertilizerPro from '../SharedPlant/SwipeViews/FertilizerPro'
import PruningDeadheadingPro from '../SharedPlant/SwipeViews/PruningDeadheadingPro'
import SoilCompPro from '../SharedPlant/SwipeViews/SoilCompPro'
import Pest from '../SharedPlant/SwipeViews/Pest'
import Diary from '../SharedPlant/SwipeViews/Diary'
import Etc from '../SharedPlant/SwipeViews/Etc'
import Water from '../SharedPlant/SwipeViews/Water'
import Fertilizer from '../SharedPlant/SwipeViews/Fertilizer'
import SoilComp from '../SharedPlant/SwipeViews/SoilComp'

class PlantViewEdit extends Component {
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
	Session.set('pageTitle', this.props.plant.latinName || this.props.plant.commonName)

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
    console.log("update")

	const newPlantData = this.state.newData

	if (tracker && addingEntry) {
	  //this is a new entry with non-date data (ie fertilizer type used)
	  if (newPlantData[tracker]) {
		newPlantData[tracker][type] = e.target.value
	  } else {
		newPlantData[tracker] = {
		  [type]: e.target.value
		}
	  }

	} else if (tracker) {
	  //special case here where the client is pruning and deadheading in the same date entry
	  if (type === 'pruningDeadheadingTracker') {
		tracker = 'pruningTracker'

		if (newPlantData[tracker]) {
		  newPlantData[tracker].date = new Date(e)
		} else {
		  newPlantData[tracker] = {
			date: new Date(e)
		  }
		}

		tracker = 'deadheadingTracker'
		//will add the next one below
	  }

	  //this is a new date entry only
	  if (newPlantData[tracker]) {
		newPlantData[tracker].date = new Date(e)
	  } else {
		newPlantData[tracker] = {
		  date: new Date(e)
		}
	  }
	} else if (type === 'companions') {

	  const stripped = e.target.value.replace(/\s*,\s*/g, ',')
	  newPlantData[type] = stripped.split(',')

	} else if (type === 'pruning') {

	  if (newPlantData.pruningTracker) {
		newPlantData.pruningTracker[type] = e.target.value
	  } else {
		newPlantData.pruningTracker = {
		  [type]: e.target.value
		}
	  }

	} else if (type === 'ph' || type === 'moisture') {
	  let phVal = parseFloat(e.target.value)
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (newPlantData.soilCompositionTracker) {
		newPlantData.soilCompositionTracker[type] = type === 'ph' ? phVal : moistureVal
	  } else {
		newPlantData.soilCompositionTracker = {
		  [type]: type === 'ph' ? phVal : moistureVal
		}
	  }

	} else if (type === 'dateBought' || type === 'datePlanted') {
	  // newPlantData[type] = new Date(e)
	  newPlantData[type] = new Date(e.target.value)
	} else if (type === 'diary') {
	  if (newPlantData[type]) {
		newPlantData[type].entry = e.target.value
		newPlantData[type].date = new Date()
	  } else {
		newPlantData[type] = {
		  entry: e.target.value,
		  date: new Date()
		}
	  }

	} else if (type === 'waterScheduleAuto') {
	  if (newPlantData[type]) {
		newPlantData[type] = !newPlantData[type]
	  } else {
		newPlantData[type] = !this.props.plant[type]
	  }
	} else {
	  newPlantData[type] = e.target.value
	}

	this.setState({
	  newData: newPlantData
	})
  }

  updatePlant (type) {
    console.log("profile")

	if (type === 'pruningDeadheadingTracker') {
	  type = this.state.pruneType
	}

	const newPlantData = this.state.newData
	const oldPlantData = this.props.plant
	let data
	let changeTitle = false

	if (!type || !newPlantData || JSON.stringify(newPlantData) === '{}') {
	  toast.error('No data entered.')
	} else {
	  switch (type) {
		case 'waterTracker-edit':
		  //doing the waterscheduleauto checks because they're bools
		  data = {
			waterPreference: newPlantData.waterPreference || oldPlantData.waterPreference,
			lightPreference: newPlantData.lightPreference || oldPlantData.lightPreference,
			waterSchedule: (newPlantData.waterSchedule === "" && oldPlantData.waterSchedule > 0) ? null : (newPlantData.waterSchedule || oldPlantData.waterSchedule) ? parseInt(newPlantData.waterSchedule || oldPlantData.waterSchedule) : newPlantData.waterSchedule || oldPlantData.waterSchedule,
			waterScheduleAuto: newPlantData.waterScheduleAuto != null ? newPlantData.waterScheduleAuto : oldPlantData.waterScheduleAuto != null ? oldPlantData.waterScheduleAuto : false
		  }
		  break
		case 'fertilizerTracker-edit':
		  data = {
			fertilizerSchedule: (newPlantData.fertilizerSchedule === "" && oldPlantData.fertilizerSchedule > 0) ? null : (newPlantData.fertilizerSchedule || oldPlantData.fertilizerSchedule) ? parseInt(newPlantData.fertilizerSchedule || oldPlantData.fertilizerSchedule) : newPlantData.fertilizerSchedule || oldPlantData.fertilizerSchedule,
			fertilizer: newPlantData.fertilizer,
			compost: newPlantData.compost,
			nutrient: newPlantData.nutrient,
		  }
		  break
		case 'pruningDeadheadingTracker-edit':
		  data = {
			pruningSchedule: parseInt(newPlantData.pruningSchedule || oldPlantData.pruningSchedule),
			deadheadingSchedule: parseInt(newPlantData.deadheadingSchedule || oldPlantData.deadheadingSchedule),
		  }
		  break
		case 'etc-edit':
		  data = {
			commonName: newPlantData.commonName || oldPlantData.commonName,
			latinName: newPlantData.latinName || oldPlantData.latinName,
			toxicity: newPlantData.toxicity || oldPlantData.toxicity,
			category: newPlantData.category || oldPlantData.category,
			location: newPlantData.location || oldPlantData.location,
			locationBought: newPlantData.locationBought || oldPlantData.locationBought,
			dateBought: new Date(newPlantData.dateBought || oldPlantData.dateBought),
			datePlanted: new Date(newPlantData.datePlanted || oldPlantData.datePlanted),
			companions: newPlantData.companions || oldPlantData.companions
		  }

		  if (newPlantData.latinName !== oldPlantData.latinName || newPlantData.commonName !== oldPlantData.commonName) {
			changeTitle = true
		  }
		  break
		case 'pruningDeadheadingTracker':
		  data = {
			pruningTracker: newPlantData.pruningTracker,
			deadheadingTracker: newPlantData.deadheadingTracker,
		  }
		  break
		case 'soilCompositionTracker-edit':
		  if (newPlantData.category === 'in-ground' || (!newPlantData.category && oldPlantData.category === 'in-ground')) {
			data = {
			  soilAmendment: newPlantData.soilAmendment,
			  soilType: newPlantData.soilType,
			  tilled: newPlantData.tilled === 'true'
			}
		  } else {
			data = {
			  soilRecipe: newPlantData.soilRecipe
			}
		  }
		  break
		default:
		  data = {
			[type]: newPlantData[type]
		  }
	  }

	  if (data) {
		data._id = oldPlantData._id

		Meteor.call('plant.update', type, data, (err, response) => {
		  if (err) {
			toast.error(err.message)
		  } else {
			toast.success('Successfully saved new entry.')

			if (changeTitle) {
			  Session.set('pageTitle', newPlantData.latinName || newPlantData.commonName)
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

  deletePlant () {

	Meteor.call('plant.delete', this.props.plant._id, (err, response) => {
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
	const plant = this.props.plant
	const fertilizerContent = lastFertilizerUsed(plant.fertilizerTracker)
	let soilCompLastChecked = lastChecked(plant.soilCompositionTracker)
	let soilPh = getLastSoilPh(plant.soilCompositionTracker)
	let soilMoisture = getLastSoilMoisture(plant.soilCompositionTracker)
	let pestLastChecked = lastChecked(plant.pestTracker)
	let pestName = getLastPestName(plant.pestTracker)
	let pestTreatment = getLastPestTreatment(plant.pestTracker)

	//TODO add ability to add more plant photos and view calendar with details for each view (ie fertilizerTracker with date and fertilizer used)

	return (
			<div className="PlantViewEdit">
			  {this.state.editing === 'etc' ?
					  <div className="plant-photo editing">
						<img src={plant.image}
							 alt={plant.commonName}
							 title={plant.commonName}/>

						{/*<FontAwesomeIcon icon={faCamera}
										 size="3x"
										 className="plant-condition-icon"
										 alt="camera"
										 title="update photo"/>

						<input type="file" name="plant photo" onChange={this.updatePhoto}/>*/}
					  </div>
					  :
					  <div className="plant-photo">
						<img src={plant.image}
							 alt={plant.commonName}
							 title={plant.commonName}/>
					  </div>
			  }

			  <SwipeableViews className={`swipe-view ${this.state.editing && 'editing'}`}
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e, editing: null})}>


				{/* water */}
				{Meteor.isPro ?
						<WaterPro plant={plant} updateData={this.updateData} editing={this.state.editing}/>
						:
						<Water plant={plant} updateData={this.updateData} editing={this.state.editing}/>
				}


				{/* fertilizer */}
				{Meteor.isPro ?
						<FertilizerPro plant={plant}
									   updateData={this.updateData}
									   fertilizerContent={fertilizerContent}
									   editing={this.state.editing}/>
						:
						<Fertilizer plant={plant}
									updateData={this.updateData}
									fertilizerContent={fertilizerContent}
									editing={this.state.editing}/>
				}

				{/* pruning/deadheading */}
				{Meteor.isPro &&
				<PruningDeadheadingPro plant={plant}
									   updateData={this.updateData}
									   editing={this.state.editing}/>
				}

				{/* soil comp */}
				{Meteor.isPro ?
						<SoilCompPro plant={plant}
									 updateData={this.updateData}
									 soilCompLastChecked={soilCompLastChecked}
									 soilMoisture={soilMoisture}
									 soilPh={soilPh}
									 editing={this.state.editing}/>
						:
						<SoilComp plant={plant}
								  updateData={this.updateData}
								  soilCompLastChecked={soilCompLastChecked}
								  soilMoisture={soilMoisture}
								  soilPh={soilPh}
								  editing={this.state.editing}/>
				}


				{/* pest */}
				<Pest plant={plant}
					  updateData={this.updateData}
					  pestLastChecked={pestLastChecked}
					  pestName={pestName}
					  pestTreatment={pestTreatment}/>

				{/* diary */}
				<Diary plant={plant} updateData={this.updateData}/>

				{/* etc */}
				<Etc plant={plant} updateData={this.updateData} editing={this.state.editing}/>

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

				  {!this.state.editing &&
				  <FontAwesomeIcon icon={faCalendar}
								   className="plant-condition-icon"
								   alt={'calendar'}
								   title="view history"
								   onClick={() => this.openModal(true)}/>
				  }
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
										   onClick={() => this.updatePlant(`${this.state.editing}-edit`)}/>
						  }
						</React.Fragment>
						: ''
				}

			  </div>


			  {/* TODO - make modal situation more efficient, i should really be able to decrease this code, too much repetition */}
			  {/* water */}
			  <PlantAddEntryModal save={this.updatePlant}
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
						highlightDates={PlantViewEdit.getHighlightDates(plant.waterTracker)}/>
			  </PlantAddEntryModal>


			  <PlantViewHistoryModal cancel={this.resetModal}
									 show={this.state.modalOpen}
									 type="waterTracker-history"
									 header="Watering History">

				{plant.waterTracker && plant.waterTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
						  </tr>
						  </thead>
						  <tbody>

						  {plant.waterTracker.map((item, index) => {
							return <tr key={index}>
							  <td>{new Date(item.date).toLocaleDateString()}</td>
							</tr>
						  })}

						  </tbody>
						</table>
						:
						<p>No entries recorded</p>
				}

			  </PlantViewHistoryModal>


			  {/* fertilizer */}
			  <PlantAddEntryModal save={this.updatePlant}
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
						highlightDates={PlantViewEdit.getHighlightDates(plant.fertilizerTracker, 'fertilizer')}/>

				<p className="modern-input for-modal">
				  <label>fertilizer used</label>
				  <input type="text"
						 onChange={(e) => this.updateData(e, 'fertilizer', 'fertilizerTracker', true)}/>
				</p>
			  </PlantAddEntryModal>

			  <PlantViewHistoryModal cancel={this.resetModal}
									 show={this.state.modalOpen}
									 type="fertilizerTracker-history"
									 header="Fertilizing History">

				{plant.fertilizerTracker && plant.fertilizerTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
							<th>Fertilizer</th>
						  </tr>
						  </thead>
						  <tbody>

						  {plant.fertilizerTracker.map((item, index) => {
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

			  </PlantViewHistoryModal>


			  {/* pruning */}
			  <PlantAddEntryModal save={this.updatePlant}
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
						highlightDates={PlantViewEdit.getHighlightDates(plant.pruningDeadheadingTracker, 'pruning')}/>
				}

			  </PlantAddEntryModal>


			  <PlantViewHistoryModal cancel={this.resetModal}
									 show={this.state.modalOpen}
									 type="pruningDeadheadingTracker-history"
									 header="Pruning - Deadheading History">

				{plant.pruningDeadheadingTracker && plant.pruningDeadheadingTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
							<th>Action</th>
						  </tr>
						  </thead>
						  <tbody>

						  {plant.pruningDeadheadingTracker.map((item, index) => {
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

			  </PlantViewHistoryModal>


			  {/* soil comp */}
			  <PlantAddEntryModal save={this.updatePlant}
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
						highlightDates={PlantViewEdit.getHighlightDates(plant.soilCompositionTracker)}/>

				<p className="modern-input">
				  {plant.category === 'potted' ?
						  <input type="number"
								 placeholder="Soil Moisture %"
								 onChange={(e) => this.updateData(e, 'moisture')}/>
						  :
						  <input type="number"
								 placeholder="pH Reading"
								 onChange={(e) => this.updateData(e, 'ph')}/>
				  }
				</p>

			  </PlantAddEntryModal>

			  <PlantViewHistoryModal cancel={this.resetModal}
									 show={this.state.modalOpen}
									 type="soilCompositionTracker-history"
									 header="Soil Composition History">

				{plant.soilCompositionTracker && plant.soilCompositionTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th width="50%">Date</th>
							{plant.category === 'potted' ?
									<th width="50%">Moisture</th>
									:
									<th width="50%">pH</th>
							}
						  </tr>
						  </thead>
						  <tbody>

						  {plant.soilCompositionTracker.map((item, index) => {
							return <tr key={index}>
							  <td>{new Date(item.date).toLocaleDateString()}</td>
							  {plant.category === 'potted' ?
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

			  </PlantViewHistoryModal>


			  {/* pests */}
			  <PlantAddEntryModal save={this.updatePlant}
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
							highlightDates={PlantViewEdit.getHighlightDates(plant.pestTracker)}/>

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
			  </PlantAddEntryModal>


			  <PlantViewHistoryModal cancel={this.resetModal}
									 show={this.state.modalOpen}
									 type="pestTracker-history"
									 header="Pest History">

				{plant.pestTracker && plant.pestTracker.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
							<th>Pest</th>
							<th>Treatment</th>
						  </tr>
						  </thead>
						  <tbody>

						  {plant.pestTracker.map((item, index) => {
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

			  </PlantViewHistoryModal>


			  {/* diary */}
			  <PlantAddEntryModal save={this.updatePlant}
								  cancel={this.resetModal}
								  show={this.state.modalOpen}
								  type="diary">

				<p className="modern-input for-modal">
				  <label>new diary entry</label>
				  <textarea rows="6"
							onChange={(e) => this.updateData(e, 'diary')}/>
				</p>
			  </PlantAddEntryModal>

			  <PlantViewHistoryModal cancel={this.resetModal}
									 show={this.state.modalOpen}
									 type="diary-history"
									 header="Diary History">

				{plant.diary && plant.diary.length > 0 ?
						<table>
						  <thead>
						  <tr>
							<th>Date</th>
							<th>Entry</th>
						  </tr>
						  </thead>
						  <tbody>

						  {plant.diary.map((item, index) => {
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

			  </PlantViewHistoryModal>


			  {/* the rest */}
			  {/*<PlantAddEntryModal save={this.updatePlant}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="etc"
									header="Edit other details">

				<input type="text"
					   placeholder="Location Bought"
					   onChange={(e) => this.updateData(e, 'locationBought')}
					   defaultValue={plant.locationBought}/>

				<DatePicker selected={this.state.newData.dateBought || Date.now()}
							className="react-datepicker-wrapper"
							dateFormat="dd-MMMM-yyyy"
							popperPlacement="bottom"
							onSelect={(e) => this.updateData(e, 'dateBought')}
							highlightDates={PlantViewEdit.getHighlightDates(plant.dateBought, 'dateBought')}/>

				<input type="text"
					   placeholder="Location In Home"
					   onChange={(e) => this.updateData(e, 'location')}
					   defaultValue={plant.location}/>

				<input type="text"
					   placeholder="Companions"
					   onChange={(e) => this.updateData(e, 'companions')}
					   defaultValue={plant.companions ? plant.companions.join(', ') : null}/>
			  </PlantAddEntryModal>*/}


			  <PlantAddEntryModal save={this.deletePlant}
								  cancel={this.resetModal}
								  show={this.state.modalOpen}
								  type="delete"
								  header="Are you sure you want to delete this plant's entire profile?">

			  </PlantAddEntryModal>
			</div>
	)
  }
}

PlantViewEdit.propTypes = {
  plant: PropTypes.object.isRequired
}

export default withTracker((props) => {
  const id = props.match.params.id
  const plant = Plant.findOne({_id: id})
  const categories = Category.find({}).fetch()

  //sort the data
  plant.waterTracker = sortByLastDate(plant.waterTracker)
  plant.fertilizerTracker = sortByLastDate(plant.fertilizerTracker)
  plant.soilCompositionTracker = sortByLastDate(plant.soilCompositionTracker)
  plant.pestTracker = sortByLastDate(plant.pestTracker)
  plant.diary = sortByLastDate(plant.diary)

  plant.daysSinceWatered = getDaysSinceAction(plant.waterTracker)
  plant.waterCondition = getPlantCondition(plant.waterTracker, plant.daysSinceWatered, plant.waterSchedule)

  plant.daysSinceFertilized = getDaysSinceAction(plant.fertilizerTracker)
  plant.fertilizerCondition = getPlantCondition(plant.fertilizerTracker, plant.daysSinceFertilized, plant.fertilizerSchedule)

  plant.daysSincePruned = getDaysSinceAction(plant.pruningTracker)
  plant.daysSinceDeadheaded = getDaysSinceAction(plant.deadheadingTracker)

  if (plant.pruningTracker || plant.deadheadingTracker) {
	const pruning = plant.pruningTracker || []
	const deadheading = plant.deadheadingTracker || []

	for (let i = 0; i < pruning.length; i++) {
	  pruning[i].action = 'Pruned'
	}

	for (let i = 0; i < deadheading.length; i++) {
	  deadheading[i].action = 'Deadheaded'
	}

	plant.pruningDeadheadingTracker = sortByLastDate(pruning.concat(deadheading))
  } else {
	plant.pruningDeadheadingTracker = null
  }
  // plant.soilCondition = getSoilCondition(plant.soilCompositionTracker)

  return {
	plant: plant,
	categories
  }
})(PlantViewEdit)

