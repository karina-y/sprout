import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import './PlantSeedlingViewEdit.scss'
import { Session } from 'meteor/session'
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
  getPlantCondition, lastChecked, lastFertilizerUsed, parseDate, sortByLastDate
} from '../../../utils/plantData'
import Plant from '/imports/api/Plant/Plant'
import { toast } from 'react-toastify'
import ItemAddEntryModal from '../Shared/ItemAddEntryModal'
import Category from '/imports/api/Category/Category'
import WaterPro from '../SharedPlantSeedling/SwipeViewsEdit/WaterPro'
import FertilizerPro from '../SharedPlantSeedling/SwipeViewsEdit/FertilizerPro'
import PruningDeadheadingPro from '../SharedPlantSeedling/SwipeViewsEdit/PruningDeadheadingPro'
import SoilCompPro from '../SharedPlantSeedling/SwipeViewsEdit/SoilCompPro'
import Pest from '../SharedPlantSeedling/SwipeViewsEdit/Pest'
import Diary from '../SharedPlantSeedling/SwipeViewsEdit/Diary'
import EtcPlant from '../SharedPlantSeedling/SwipeViewsEdit/EtcPlant'
import Water from '../SharedPlantSeedling/SwipeViewsEdit/Water'
import Fertilizer from '../SharedPlantSeedling/SwipeViewsEdit/Fertilizer'
import SoilComp from '../SharedPlantSeedling/SwipeViewsEdit/SoilComp'
import WaterModals from '../SharedPlantSeedling/SwipeModals/WaterModals'
import FertilizerModals from '../SharedPlantSeedling/SwipeModals/FertilizerModals'
import SoilCompModals from '../SharedPlantSeedling/SwipeModals/SoilCompModals'
import PestModals from '../SharedPlantSeedling/SwipeModals/PestModals'
import DiaryModals from '../SharedPlantSeedling/SwipeModals/DiaryModals'
import PruningDeadheadingModals from '../SharedPlantSeedling/SwipeModals/PruningDeadheadingModals'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/


class PlantViewEdit extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  newData: {},
	  swipeViewIndex: 0,
	  currentDateSelection: null,
	  modalOpen: null,
	  editing: null,
	  pruneType: null
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

  //TODO turn into hook?
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

  //TODO
  updatePhoto (e) {
	let files = e.target.files
	let file = files[0]
	let fileReader = new FileReader()

	if (files.length === 0) {
	  return
	}

	fileReader.onload = function (event) {
	  let dataUrl = event.target.result
	  template.dataUrl.set(dataUrl)
	}

	fileReader.readAsDataURL(file)
  }

  //TODO this is heavy! simplify this and break it out into diff functions (one separate for tracker for sure)
  //tracker should be able to be simplified
  //this updates the plant's data in my state before it gets sent out to the backend
  updateData (e, type) {
	//this is any new data that's been entered, updating it as new inputs are entered
	const newPlantData = this.state.newData

	if (type === 'companions') {
	  const stripped = e.target.value.replace(/\s*,\s*/g, ',')
	  newPlantData[type] = stripped.split(',')

	} else if (type === 'dateBought' || type === 'datePlanted') {
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

  //this only adds new dates to trackers, ie adding date fertilizer was used
  addTrackerDate (e, trackerType) {
	let newPlantData = this.state.newData;

	if (newPlantData[trackerType]) {
	  newPlantData[trackerType].date = new Date(e)
	} else {
	  newPlantData[trackerType] = {
		date: new Date(e)
	  }
	}

	this.setState({
	  newData: newPlantData
	})
  }

  //this adds additional details to trackers, ie fertilizer type used
  addTrackerDetails (e, trackerType, detailType) {
	let newPlantData = this.state.newData;

	if (type === 'ph' || type === 'moisture') {
	  let phVal = parseFloat(e.target.value)
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (newPlantData.soilCompositionTracker) {
		newPlantData.soilCompositionTracker[type] = type === 'ph' ? phVal : moistureVal
	  } else {
		newPlantData.soilCompositionTracker = {
		  [type]: type === 'ph' ? phVal : moistureVal
		}
	  }

	} else if (newPlantData[trackerType]) {
	  newPlantData[trackerType][detailType] = e.target.value;
	} else {
	  newPlantData[trackerType] = {
		[detailType]: e.target.value
	  }
	}

	this.setState({
	  newData: newPlantData
	})
  }

  //TODO clean this up next!
  updatePlant (type) {
	console.log('profile', type)

	//these are actually stored separately in the db, but for ease for the user they're in one view
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
	  //TODO abstract each of these cases out
	  switch (type) {
		case 'waterTracker-edit':
		  //doing the waterscheduleauto checks because they're bools
		  data = {
			waterPreference: newPlantData.waterPreference || oldPlantData.waterPreference,
			lightPreference: newPlantData.lightPreference || oldPlantData.lightPreference,
			waterSchedule: (newPlantData.waterSchedule === '' && oldPlantData.waterSchedule > 0) ? null : (newPlantData.waterSchedule || oldPlantData.waterSchedule) ? parseInt(newPlantData.waterSchedule || oldPlantData.waterSchedule) : newPlantData.waterSchedule || oldPlantData.waterSchedule,
			waterScheduleAuto: newPlantData.waterScheduleAuto != null ? newPlantData.waterScheduleAuto : oldPlantData.waterScheduleAuto != null ? oldPlantData.waterScheduleAuto : false
		  }
		  break
		case 'fertilizerTracker-edit':
		  data = {
			fertilizerSchedule: (newPlantData.fertilizerSchedule === '' && oldPlantData.fertilizerSchedule > 0) ? null : (newPlantData.fertilizerSchedule || oldPlantData.fertilizerSchedule) ? parseInt(newPlantData.fertilizerSchedule || oldPlantData.fertilizerSchedule) : newPlantData.fertilizerSchedule || oldPlantData.fertilizerSchedule,
			fertilizer: newPlantData.fertilizer,
			compost: newPlantData.compost,
			nutrient: newPlantData.nutrient,
		  }
		  break
		case 'pruningDeadheadingTracker-edit':
		  /*data = {
			pruningSchedule: parseInt(newPlantData.pruningSchedule || oldPlantData.pruningSchedule),
			deadheadingSchedule: parseInt(newPlantData.deadheadingSchedule || oldPlantData.deadheadingSchedule),
		  }*/

		  data = {
			pruningPreference: newPlantData.pruningPreference || oldPlantData.pruningPreference,
			deadheadingPreference: newPlantData.deadheadingPreference || oldPlantData.deadheadingPreference
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
	  modalOpen: null,
	  editing: null,
	  pruneType: null,
	  newData: {}
	})
  }

  handleEdit () {
	let editing

	//selecting which swipe view to edit
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

	//selecting which modal to open
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
		  modalOpen: null
		})

		this.props.history.push('/catalogue/plant')
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

	return (
			<div className="PlantSeedlingViewEdit">
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
						<WaterPro item={plant} updateData={this.updateData} editing={this.state.editing}/>
						:
						<Water item={plant} updateData={this.updateData} editing={this.state.editing}/>
				}


				{/* fertilizer */}
				{Meteor.isPro ?
						<FertilizerPro item={plant}
									   updateData={this.updateData}
									   fertilizerContent={fertilizerContent}
									   editing={this.state.editing}/>
						:
						<Fertilizer item={plant}
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
						<SoilCompPro item={plant}
									 updateData={this.updateData}
									 soilCompLastChecked={soilCompLastChecked}
									 soilMoisture={soilMoisture}
									 soilPh={soilPh}
									 editing={this.state.editing}/>
						:
						<SoilComp item={plant}
								  updateData={this.updateData}
								  soilCompLastChecked={soilCompLastChecked}
								  soilMoisture={soilMoisture}
								  soilPh={soilPh}
								  editing={this.state.editing}/>
				}


				{/* pest */}
				<Pest item={plant}
					  updateData={this.updateData}
					  pestLastChecked={pestLastChecked}
					  pestName={pestName}
					  pestTreatment={pestTreatment}/>

				{/* diary */}
				<Diary item={plant} updateData={this.updateData}/>

				{/* etc */}
				<EtcPlant plant={plant} updateData={this.updateData} editing={this.state.editing}/>

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
			  <WaterModals addTrackerDate={this.addTrackerDate}
						   addTrackerDetails={this.addTrackerDetails}
						   save={this.updatePlant}
						   resetModal={this.resetModal}
						   modalOpen={this.state.modalOpen}
						   newDataTracker={this.state.newData.waterTracker}
						   tracker={plant.waterTracker}
						   highlightDates={PlantViewEdit.getHighlightDates(plant.waterTracker)}/>


			  {/* fertilizer */}
			  <FertilizerModals addTrackerDate={this.addTrackerDate}
								addTrackerDetails={this.addTrackerDetails}
								save={this.updatePlant}
								resetModal={this.resetModal}
								modalOpen={this.state.modalOpen}
								newDataTracker={this.state.newData.fertilizerTracker}
								tracker={plant.fertilizerTracker}
								highlightDates={PlantViewEdit.getHighlightDates(plant.fertilizerTracker)}/>


			  {/* pruning */}
			  <PruningDeadheadingModals addTrackerDate={this.addTrackerDate}
										addTrackerDetails={this.addTrackerDetails}
										save={this.updatePlant}
										resetModal={this.resetModal}
										modalOpen={this.state.modalOpen}
										newDataTracker={this.state.newData.pruningDeadheadingTracker}
										tracker={plant.pruningDeadheadingTracker}
										highlightDates={PlantViewEdit.getHighlightDates(plant.pruningDeadheadingTracker)}
										pruneType={this.state.pruneType}
										setPruneType={(val) => this.setState(val)}/>


			  {/* soil comp */}
			  <SoilCompModals updateData={this.updateData}
							  addTrackerDate={this.addTrackerDate}
							  save={this.updatePlant}
							  resetModal={this.resetModal}
							  modalOpen={this.state.modalOpen}
							  newDataTracker={this.state.newData.soilCompositionTracker}
							  tracker={plant.soilCompositionTracker}
							  category={plant.category}
							  highlightDates={PlantViewEdit.getHighlightDates(plant.soilCompositionTracker)}/>


			  {/* pests */}
			  <PestModals addTrackerDate={this.addTrackerDate}
						  addTrackerDetails={this.addTrackerDetails}
						  save={this.updatePlant}
						  resetModal={this.resetModal}
						  modalOpen={this.state.modalOpen}
						  newDataTracker={this.state.newData.pestTracker}
						  tracker={plant.pestTracker}
						  highlightDates={PlantViewEdit.getHighlightDates(plant.pestTracker)}/>


			  {/* diary */}
			  <DiaryModals updateData={this.updateData}
						   save={this.updatePlant}
						   resetModal={this.resetModal}
						   modalOpen={this.state.modalOpen}
						   diary={plant.diary}/>



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


			  <ItemAddEntryModal save={this.deletePlant}
								 cancel={this.resetModal}
								 show={this.state.modalOpen}
								 type="delete"
								 header="Are you sure you want to delete this plant's entire profile?" />
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
	plant,
	categories
  }
})(PlantViewEdit)

