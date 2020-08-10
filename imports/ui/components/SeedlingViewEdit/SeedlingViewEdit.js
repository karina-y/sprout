import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import { Session } from 'meteor/session'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import SwipeableViews from 'react-swipeable-views'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../PlantViewEdit/PlantSeedlingViewEdit.scss'
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
import Seedling from '/imports/api/Seedling/Seedling'
import { toast } from 'react-toastify'
import ItemAddEntryModal from '../Shared/ItemAddEntryModal'
import Category from '/imports/api/Category/Category'
import WaterPro from '../SharedPlantSeedling/SwipeViewsEdit/WaterPro'
import FertilizerPro from '../SharedPlantSeedling/SwipeViewsEdit/FertilizerPro'
import SoilCompPro from '../SharedPlantSeedling/SwipeViewsEdit/SoilCompPro'
import Pest from '../SharedPlantSeedling/SwipeViewsEdit/Pest'
import Diary from '../SharedPlantSeedling/SwipeViewsEdit/Diary'
import Water from '../SharedPlantSeedling/SwipeViewsEdit/Water'
import Fertilizer from '../SharedPlantSeedling/SwipeViewsEdit/Fertilizer'
import SoilComp from '../SharedPlantSeedling/SwipeViewsEdit/SoilComp'
import EtcSeedling from '../SharedPlantSeedling/SwipeViewsEdit/EtcSeedling'
// import NotableDates from '../SharedPlantSeedling/SwipeViewsEdit/NotableDates'
import WaterModals from '../SharedPlantSeedling/SwipeModals/WaterModals'
import FertilizerModals from '../SharedPlantSeedling/SwipeModals/FertilizerModals'
import SoilCompModals from '../SharedPlantSeedling/SwipeModals/SoilCompModals'
import PestModals from '../SharedPlantSeedling/SwipeModals/PestModals'
import DiaryModals from '../SharedPlantSeedling/SwipeModals/DiaryModals'
import SeedlingDates from '../SharedPlantSeedling/SwipeViewsEdit/SeedlingDates'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/

class SeedlingViewEdit extends Component {
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
	Session.set('pageTitle', this.props.seedling.latinName || this.props.seedling.commonName)

	//this is to disable keyboard from popping up on android, sometimes you just need good ol vanilla js
	const inputs = document.getElementsByTagName('input')

	for (let i = 0; i < inputs.length; i++) {
	  inputs[i].disabled = true
	}
  }

  //TODO turn into hook
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
  updateData (e, type, tracker, addingEntry) {
	const newSeedlingData = this.state.newData

	if (tracker && addingEntry) {
	  //this is a new entry with non-date data (ie fertilizer type used)
	  if (newSeedlingData[tracker]) {
		newSeedlingData[tracker][type] = e.target.value
	  } else {
		newSeedlingData[tracker] = {
		  [type]: e.target.value
		}
	  }

	} else if (tracker) {
	  //this is a new date entry only
	  if (newSeedlingData[tracker]) {
		newSeedlingData[tracker].date = new Date(e)
	  } else {
		newSeedlingData[tracker] = {
		  date: new Date(e)
		}
	  }
	} else if (type === 'companions') {

	  const stripped = e.target.value.replace(/\s*,\s*/g, ',')
	  newSeedlingData[type] = stripped.split(',')

	} else if (type === 'pruning') {

	  if (newSeedlingData.pruningTracker) {
		newSeedlingData.pruningTracker[type] = e.target.value
	  } else {
		newSeedlingData.pruningTracker = {
		  [type]: e.target.value
		}
	  }

	} else if (type === 'ph' || type === 'moisture') {
	  let phVal = parseFloat(e.target.value)
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (newSeedlingData.soilCompositionTracker) {
		newSeedlingData.soilCompositionTracker[type] = type === 'ph' ? phVal : moistureVal
	  } else {
		newSeedlingData.soilCompositionTracker = {
		  [type]: type === 'ph' ? phVal : moistureVal
		}
	  }

	} else if (type === 'sowDate' || type === 'sproutDate' || type === 'trueLeavesDate' || type === 'transplantDate' || type === 'estHarvestDate' || type === 'actualHarvestDate') {
	  // newSeedlingData[type] = new Date(e)
	  newSeedlingData[type] = new Date(e.target.value)
	} else if (type === 'diary') {
	  if (newSeedlingData[type]) {
		newSeedlingData[type].entry = e.target.value
		newSeedlingData[type].date = new Date()
	  } else {
		newSeedlingData[type] = {
		  entry: e.target.value,
		  date: new Date()
		}
	  }

	} else if (type === 'waterScheduleAuto') {
	  if (newSeedlingData[type]) {
		newSeedlingData[type] = !newSeedlingData[type]
	  } else {
		newSeedlingData[type] = !this.props.seedling[type]
	  }
	} else {
	  newSeedlingData[type] = e.target.value
	}

	this.setState({
	  newData: newSeedlingData
	})
  }

  updateSeedling (type) {

	if (type === 'pruningDeadheadingTracker') {
	  type = this.state.pruneType
	}

	const newSeedlingData = this.state.newData
	const oldSeedlingData = this.props.seedling
	let data
	let changeTitle = false

	if (!type || !newSeedlingData || JSON.stringify(newSeedlingData) === '{}') {
	  toast.error('No data entered.')
	} else {

	  switch (type) {
		//TODO abstract each of these cases out
		case 'dates-edit':
		  data = {
			sowDate: newSeedlingData.sowDate || oldSeedlingData.sowDate,
			sproutDate: newSeedlingData.sproutDate || oldSeedlingData.sproutDate,
			trueLeavesDate: newSeedlingData.trueLeavesDate || oldSeedlingData.trueLeavesDate,
			daysToGerminate: newSeedlingData.daysToGerminate || oldSeedlingData.daysToGerminate,
			transplantDate: newSeedlingData.transplantDate || oldSeedlingData.transplantDate,
			daysToHarvest: newSeedlingData.daysToHarvest || oldSeedlingData.daysToHarvest,
			estHarvestDate: newSeedlingData.estHarvestDate || oldSeedlingData.estHarvestDate,
			actualHarvestDate: newSeedlingData.actualHarvestDate || oldSeedlingData.actualHarvestDate
		  }
		  break
		case 'waterTracker-edit':
		  //doing the waterscheduleauto checks because they're bools
		  data = {
			waterPreference: newSeedlingData.waterPreference || oldSeedlingData.waterPreference,
			lightPreference: newSeedlingData.lightPreference || oldSeedlingData.lightPreference,
			waterSchedule: (newSeedlingData.waterSchedule === '' && oldSeedlingData.waterSchedule > 0) ? null : (newSeedlingData.waterSchedule || oldSeedlingData.waterSchedule) ? parseInt(newSeedlingData.waterSchedule || oldSeedlingData.waterSchedule) : newSeedlingData.waterSchedule || oldSeedlingData.waterSchedule,
			waterScheduleAuto: newSeedlingData.waterScheduleAuto != null ? newSeedlingData.waterScheduleAuto : oldSeedlingData.waterScheduleAuto != null ? oldSeedlingData.waterScheduleAuto : false
		  }
		  break
		case 'fertilizerTracker-edit':
		  data = {
			fertilizerSchedule: (newSeedlingData.fertilizerSchedule === '' && oldSeedlingData.fertilizerSchedule > 0) ? null : (newSeedlingData.fertilizerSchedule || oldSeedlingData.fertilizerSchedule) ? parseInt(newSeedlingData.fertilizerSchedule || oldSeedlingData.fertilizerSchedule) : newSeedlingData.fertilizerSchedule || oldSeedlingData.fertilizerSchedule,
			fertilizer: newSeedlingData.fertilizer,
			compost: newSeedlingData.compost,
			nutrient: newSeedlingData.nutrient,
		  }
		  break
		case 'etc-edit':
		  data = {
			commonName: newSeedlingData.commonName || oldSeedlingData.commonName,
			latinName: newSeedlingData.latinName || oldSeedlingData.latinName,
			toxicity: newSeedlingData.toxicity || oldSeedlingData.toxicity,
			category: newSeedlingData.category || oldSeedlingData.category,
			method: newSeedlingData.method || oldSeedlingData.method,
			startedIndoorOutdoor: newSeedlingData.startedIndoorOutdoor || oldSeedlingData.startedIndoorOutdoor,
			seedBrand: new Date(newSeedlingData.seedBrand || oldSeedlingData.seedBrand),
			// datePlanted: new Date(newSeedlingData.datePlanted || oldSeedlingData.datePlanted),
			// companions: newSeedlingData.companions || oldSeedlingData.companions
		  }

		  if (newSeedlingData.latinName !== oldSeedlingData.latinName || newSeedlingData.commonName !== oldSeedlingData.commonName) {
			changeTitle = true
		  }
		  break
		case 'soilCompositionTracker-edit':
		  if (newSeedlingData.category === 'in-ground' || (!newSeedlingData.category && oldSeedlingData.category === 'in-ground')) {
			data = {
			  soilAmendment: newSeedlingData.soilAmendment,
			  soilType: newSeedlingData.soilType,
			  tilled: newSeedlingData.tilled === 'true'
			}
		  } else {
			data = {
			  soilRecipe: newSeedlingData.soilRecipe
			}
		  }
		  break
		default:
		  data = {
			[type]: newSeedlingData[type]
		  }
	  }

	  if (data) {
		data._id = oldSeedlingData._id

		Meteor.call('seedling.update', type, data, (err, response) => {
		  if (err) {
			toast.error(err.message)
		  } else {
			toast.success('Successfully saved new entry.')

			if (changeTitle) {
			  Session.set('pageTitle', newSeedlingData.latinName || newSeedlingData.commonName)
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
		editing = 'dates'
		break
	  case 1:
		editing = 'waterTracker'
		break
	  case 2:
		editing = 'fertilizerTracker'
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
	  case 1:
		modalOpen = history ? 'waterTracker-history' : 'waterTracker'
		break
	  case 2:
		modalOpen = history ? 'fertilizerTracker-history' : 'fertilizerTracker'
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

  deleteSeedling () {

	Meteor.call('seedling.delete', this.props.seedling._id, (err, response) => {
	  if (err) {
		toast.error(err.message)
	  } else {
		this.setState({
		  modalOpen: null
		})

		this.props.history.push('/catalogue/seedling')
	  }
	})

  }

  render () {
	const seedling = this.props.seedling
	const fertilizerContent = lastFertilizerUsed(seedling.fertilizerTracker)
	let soilCompLastChecked = lastChecked(seedling.soilCompositionTracker)
	let soilPh = getLastSoilPh(seedling.soilCompositionTracker)
	let soilMoisture = getLastSoilMoisture(seedling.soilCompositionTracker)
	let pestLastChecked = lastChecked(seedling.pestTracker)
	let pestName = getLastPestName(seedling.pestTracker)
	let pestTreatment = getLastPestTreatment(seedling.pestTracker)

	return (
			<div className="PlantSeedlingViewEdit">
			  {this.state.editing === 'etc' ?
					  <div className="plant-photo editing">
						<img src={seedling.image}
							 alt={seedling.commonName}
							 title={seedling.commonName}/>

						{/*<FontAwesomeIcon icon={faCamera}
										 size="3x"
										 className="plant-condition-icon"
										 alt="camera"
										 title="update photo"/>

						<input type="file" name="plant photo" onChange={this.updatePhoto}/>*/}
					  </div>
					  :
					  <div className="plant-photo">
						<img src={seedling.image}
							 alt={seedling.commonName}
							 title={seedling.commonName}/>
					  </div>
			  }

			  <SwipeableViews className={`swipe-view ${this.state.editing && 'editing'}`}
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e, editing: null})}>

				{/* dates */}
				<SeedlingDates seedling={seedling} updateData={this.updateData} editing={this.state.editing}/>

				{/* water */}
				{Meteor.isPro ?
						<WaterPro item={seedling} updateData={this.updateData} editing={this.state.editing}/>
						:
						<Water item={seedling} updateData={this.updateData} editing={this.state.editing}/>
				}


				{/* fertilizer */}
				{Meteor.isPro ?
						<FertilizerPro item={seedling}
									   updateData={this.updateData}
									   fertilizerContent={fertilizerContent}
									   editing={this.state.editing}/>
						:
						<Fertilizer item={seedling}
									updateData={this.updateData}
									fertilizerContent={fertilizerContent}
									editing={this.state.editing}/>
				}

				{/* soil comp */}
				{Meteor.isPro ?
						<SoilCompPro item={seedling}
									 updateData={this.updateData}
									 soilCompLastChecked={soilCompLastChecked}
									 soilMoisture={soilMoisture}
									 soilPh={soilPh}
									 editing={this.state.editing}/>
						:
						<SoilComp item={seedling}
								  updateData={this.updateData}
								  soilCompLastChecked={soilCompLastChecked}
								  soilMoisture={soilMoisture}
								  soilPh={soilPh}
								  editing={this.state.editing}/>
				}


				{/* pest */}
				<Pest item={seedling}
					  updateData={this.updateData}
					  pestLastChecked={pestLastChecked}
					  pestName={pestName}
					  pestTreatment={pestTreatment}/>

				{/* diary */}
				<Diary item={seedling} updateData={this.updateData}/>

				<EtcSeedling seedling={seedling} updateData={this.updateData} editing={this.state.editing}/>

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

				  {!this.state.editing &&
				  <FontAwesomeIcon icon={faCalendar}
								   className="plant-condition-icon"
								   alt={'calendar'}
								   title="view history"
								   onClick={() => this.openModal(true)}/>
				  }
				</React.Fragment>
				}

				{(this.state.swipeViewIndex < 3 || this.state.swipeViewIndex > 4) ?
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
										   onClick={() => this.updateSeedling(`${this.state.editing}-edit`)}/>
						  }
						</React.Fragment>
						: ''
				}

			  </div>


			  {/* TODO - make modal situation more efficient, i should really be able to decrease this code, too much repetition */}
			  {/* water */}
			  <ItemAddEntryModal save={this.updateSeedling}
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
						highlightDates={SeedlingViewEdit.getHighlightDates(seedling.waterTracker)}/>
			  </ItemAddEntryModal>

			  {/* water */}
			  <WaterModals updateData={this.updateData}
						   save={this.updateSeedling}
						   resetModal={this.resetModal}
						   modalOpen={this.state.modalOpen}
						   newDataTracker={this.state.newData.waterTracker}
						   tracker={seedling.waterTracker}
						   highlightDates={SeedlingViewEdit.getHighlightDates(seedling.waterTracker)}/>


			  {/* fertilizer */}
			  <FertilizerModals updateData={this.updateData}
								save={this.updateSeedling}
								resetModal={this.resetModal}
								modalOpen={this.state.modalOpen}
								newDataTracker={this.state.newData.fertilizerTracker}
								tracker={seedling.fertilizerTracker}
								highlightDates={SeedlingViewEdit.getHighlightDates(seedling.fertilizerTracker)}/>


			  {/* soil comp */}
			  <SoilCompModals updateData={this.updateData}
							  save={this.updateSeedling}
							  resetModal={this.resetModal}
							  modalOpen={this.state.modalOpen}
							  newDataTracker={this.state.newData.soilCompositionTracker}
							  tracker={seedling.soilCompositionTracker}
							  category={seedling.category}
							  highlightDates={SeedlingViewEdit.getHighlightDates(seedling.soilCompositionTracker)}/>


			  {/* pests */}
			  <PestModals updateData={this.updateData}
						  save={this.updateSeedling}
						  resetModal={this.resetModal}
						  modalOpen={this.state.modalOpen}
						  newDataTracker={this.state.newData.pestTracker}
						  tracker={seedling.pestTracker}
						  highlightDates={SeedlingViewEdit.getHighlightDates(seedling.pestTracker)}/>


			  {/* diary */}
			  <DiaryModals updateData={this.updateData}
						   save={this.updateSeedling}
						   resetModal={this.resetModal}
						   modalOpen={this.state.modalOpen}
						   diary={seedling.diary}/>

			  <ItemAddEntryModal save={this.deleteSeedling}
								 cancel={this.resetModal}
								 show={this.state.modalOpen}
								 type="delete"
								 header="Are you sure you want to delete this seedling's entire profile?" />
			</div>
	)
  }
}

SeedlingViewEdit.propTypes = {
  seedling: PropTypes.object.isRequired
}

export default withTracker((props) => {
  const id = props.match.params.id
  const seedling = Seedling.findOne({_id: id})
  const categories = Category.find({}).fetch()

  //sort the data
  seedling.waterTracker = sortByLastDate(seedling.waterTracker)
  seedling.fertilizerTracker = sortByLastDate(seedling.fertilizerTracker)
  seedling.soilCompositionTracker = sortByLastDate(seedling.soilCompositionTracker)
  seedling.pestTracker = sortByLastDate(seedling.pestTracker)
  seedling.diary = sortByLastDate(seedling.diary)

  seedling.daysSinceWatered = getDaysSinceAction(seedling.waterTracker)
  seedling.waterCondition = getPlantCondition(seedling.waterTracker, seedling.daysSinceWatered, seedling.waterSchedule)

  seedling.daysSinceFertilized = getDaysSinceAction(seedling.fertilizerTracker)
  seedling.fertilizerCondition = getPlantCondition(seedling.fertilizerTracker, seedling.daysSinceFertilized, seedling.fertilizerSchedule)

  seedling.daysSincePruned = getDaysSinceAction(seedling.pruningTracker)
  seedling.daysSinceDeadheaded = getDaysSinceAction(seedling.deadheadingTracker)

  if (seedling.pruningTracker || seedling.deadheadingTracker) {
	const pruning = seedling.pruningTracker || []
	const deadheading = seedling.deadheadingTracker || []

	for (let i = 0; i < pruning.length; i++) {
	  pruning[i].action = 'Pruned'
	}

	for (let i = 0; i < deadheading.length; i++) {
	  deadheading[i].action = 'Deadheaded'
	}

	seedling.pruningDeadheadingTracker = sortByLastDate(pruning.concat(deadheading))
  } else {
	seedling.pruningDeadheadingTracker = null
  }
  // seedling.soilCondition = getSoilCondition(seedling.soilCompositionTracker)

  return {
	seedling,
	categories
  }
})(SeedlingViewEdit)

