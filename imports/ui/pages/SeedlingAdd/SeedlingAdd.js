import React, { Component } from 'react'
import autobind from 'react-autobind'
import './SeedlingAdd.scss'
import Modal from 'react-bootstrap/Modal'
import { Session } from 'meteor/session'
import SwipeableViews from 'react-swipeable-views'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { selectRandomPlantPicture } from '/imports/utils/selectRandomPlantPicture'
import { toast } from 'react-toastify'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import Category from '/imports/api/Category/Category'
import SoilTypes from '../../../utils/soilTypes'
import SwipePanelContent from '../../components/Shared/SwipePanelContent/SwipePanelContent'

class SeedlingAdd extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  seedling: {
		image: selectRandomPlantPicture(),
		waterScheduleAuto: false
	  },
	  swipeViewIndex: 0,
	  showDiaryModal: false,
	  currentDateSelection: null,
	  categories: null
	}

	autobind(this)
  }

  componentDidMount () {
	Session.set('pageTitle', this.state.seedling.commonName)
	const categories = Category.find().fetch()

	this.setState({
	  categories
	})
  }

  addNewProfile () {
	let seedling = this.state.seedling

	if (seedling.waterSchedule) {
	  seedling.waterSchedule = parseInt(seedling.waterSchedule)
	}

	if (seedling.fertilizerSchedule) {
	  seedling.fertilizerSchedule = parseInt(seedling.fertilizerSchedule)
	}

	if (seedling.soilCompositionTracker && !Array.isArray(seedling.soilCompositionTracker)) {
	  seedling.soilCompositionTracker = [seedling.soilCompositionTracker]
	}

	let errMsg

	if ((!seedling.commonName) && (!seedling.latinName)) {
	  errMsg = 'Please enter either a common or latin name (eg. Swiss Cheese Plant or Monstera adansonii).'
	} else if (!seedling.category) {
	  errMsg = 'Please select a category.'
	} else if (!seedling.method) {
	  errMsg = 'Please enter a seed starting method (eg. used jiffy pot and greenhouse method)'
	} else if (!seedling.waterPreference) {
	  errMsg = 'Please enter a watering preference (eg. Keep soil moist but not soggy, humidity tray helpful).'
	} else if (!seedling.lightPreference) {
	  errMsg = 'Please enter a lighting preference (eg. Bright indirect light).'
	}

	if (errMsg) {
	  toast.error(errMsg)
	} else {
	  Meteor.call('seedling.insert', seedling, (err, response) => {
		if (err) {
		  toast.error(err.message)
		} else {
		  toast.success('Seedling added!')
		  this.props.history.push('/catalogue/seedling')
		}
	  })
	}
  }

  updateData (e, type) {
	const seedling = this.state.seedling

	if (type === 'ph' || type === 'moisture') {
	  let phVal = parseFloat(e.target.value)
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (seedling.soilCompositionTracker) {
		seedling.soilCompositionTracker[type] = (type === 'moisture' ? moistureVal : phVal)
	  } else {
		seedling.soilCompositionTracker = {
		  date: new Date(),
		  [type]: type === 'moisture' ? moistureVal : phVal
		}
	  }

	} else if (type === 'daysToGerminate' || type === 'daysToHarvest') {
	  seedling[type] = parseInt(e.target.value)
	} else if (type === 'dateExpires' || type === 'dateBought' || type === 'startDate' || type === 'sproutDate' || type === 'trueLeavesDate' || type === 'transplantDate' || type === 'estHarvestDate' || type === 'actualHarvestDate') {
	  seedling[type] = new Date(e)
	} else if (type === 'tilled') {
	  seedling[type] = e.target.value === 'true' ? true : false
	} else {
	  seedling[type] = e.target.value
	}

	this.setState({
	  seedling
	})
  }

  render () {
	const seedling = this.state.seedling
	//TODO add ability to set plant photo and photo history eventually

	return (
			<div className="SeedlingAdd">
			  <img src={seedling.image}
				   alt={seedling.commonName}
				   title={seedling.commonName}
				   className="hero-img"/>


			  <SwipeableViews className="swipe-view"
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e})}>

				{/* plant info */}
				<div className="swipe-slide">

				  <p className="swipe-title title-ming">
					Seedling Details
				  </p>

				  <SwipePanelContent icon="info" iconTitle="common name">
					<p className="modern-input">
					  <label>common name *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'commonName')}
							 value={seedling.commonName || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="info" iconTitle="latin name">
					<p className="modern-input">
					  <label>latin name *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'latinName')}
							 value={seedling.latinName || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="category">
					<p className="modern-input">
					  <label>category *</label>
					  <select onChange={(e) => this.updateData(e, 'category')}
							  value={seedling.category || ''}>
						<option value='' disabled={true}>- Select a category -</option>
						{this.state.categories && this.state.categories.map((item, index) => {
						  return <option value={item.category} key={index}>{item.displayName}</option>
						})}
					  </select>
					</p>
				  </SwipePanelContent>

				  <React.Fragment>
					<SwipePanelContent icon="methodSeedStart">
					  <p className="modern-input">
						<label>method to start seed *</label>
						<input type="text"
							   onChange={(e) => this.updateData(e, 'method')}
							   value={seedling.method || ''}/>
					  </p>
					</SwipePanelContent>
				  </React.Fragment>

				  <SwipePanelContent icon="indoorOutdoor">
					<p className="modern-input">
					  <label>started indoor or outdoor</label>
					  <select onChange={(e) => this.updateData(e, 'startedIndoorOutdoor')}
							  value={seedling.startedIndoorOutdoor || ''}>
						<option value='' disabled={true}>- Select a start location -</option>
						<option value="indoor">Indoor</option>
						<option value="outdoor">Outdoor</option>

					  </select>
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="seedBrand">
					<p className="modern-input">
					  <label>seed brand</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'seedBrand')}
							 value={seedling.seedBrand || ''}/></p>
				  </SwipePanelContent>

				</div>


				{/* water */}
				<div className="swipe-slide">

				  <p className="swipe-title title-ming">
					Water - Light
				  </p>


				  <SwipePanelContent icon="schedule" iconTitle="watering schedule">
					<p className="modern-input">Water every <input type="number"
																   min="0"
																   inputMode="numeric"
																   pattern="[0-9]*"
																   placeholder="4"
																   className="small"
																   onChange={(e) => this.updateData(e, 'waterSchedule')}
																   value={seedling.waterSchedule || ''}/> days</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="water">
					<p className="modern-input">
					  <label>watering preferences *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'waterPreference')}
							 value={seedling.waterPreference || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="lightPreference">
					<p className="modern-input">
					  <label>light preferences *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'lightPreference')}
							 value={seedling.lightPreference || ''}/></p>
				  </SwipePanelContent>

				</div>


				{/* fertilizer */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">
					Fertilizer / Nutrients
				  </p>

				  <SwipePanelContent icon="schedule" iconTitle="feeding schedule">
					<p className="modern-input">Feed every <input type="number"
																  min="0"
																  inputMode="numeric"
																  pattern="[0-9]*"
																  placeholder="30"
																  className="small"
																  onChange={(e) => this.updateData(e, 'fertilizerSchedule')}/> days
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="fertilizer">
					<p className="modern-input">
					  <label>preferred fertilizer</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'fertilizer')}
							 value={seedling.fertilizer || ''}/></p>
				  </SwipePanelContent>


				  <React.Fragment>
					<SwipePanelContent icon="compost">
					  <p className="modern-input">
						<label>compost</label>
						<input type="text"
							   onChange={(e) => this.updateData(e, 'compost')}
							   value={seedling.compost || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="nutrients">
					  <p className="modern-input">
						<label>other nutrient amendment</label>
						<input type="text"
							   onChange={(e) => this.updateData(e, 'nutrient')}
							   value={seedling.nutrient || ''}/></p>
					</SwipePanelContent>
				  </React.Fragment>

				</div>


				{/* notable dates */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">
					Notable Dates
				  </p>

				  <SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>start date</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'startDate')}
							 defaultValue={seedling.startDate || ''}/></p>
				  </SwipePanelContent>

				  {/*<SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>sprout date</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'sproutDate')}
							 defaultValue={seedling.sproutDate || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>true leaves date</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'trueLeavesDate')}
							 defaultValue={seedling.trueLeavesDate || ''}/></p>
				  </SwipePanelContent>*/}

				  <SwipePanelContent icon="schedule" iconTitle="days to germinate">
					<p className="modern-input">Days to germinate: <input type="number"
																		  min="0"
																		  inputMode="numeric"
																		  pattern="[0-9]*"
																		  placeholder="4"
																		  className="small"
																		  onChange={(e) => this.updateData(e, 'daysToGerminate')}
																		  value={seedling.daysToGerminate || ''}/> days
					</p>
				  </SwipePanelContent>

				  {/*<SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>transplant date</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'transplantDate')}
							 defaultValue={seedling.transplantDate || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="schedule" iconTitle="days to germinate">
					<p className="modern-input">Days to harvest: <input type="number"
																		min="0"
																		inputMode="numeric"
																		pattern="[0-9]*"
																		placeholder="4"
																		className="small"
																		onChange={(e) => this.updateData(e, 'daysToHarvest')}
																		value={seedling.daysToHarvest || ''}/> days</p>
				  </SwipePanelContent>*/}

				  <SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>estimated harvest date</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'estHarvestDate')}
							 defaultValue={seedling.estHarvestDate || ''}/></p>
				  </SwipePanelContent>

				  {/*<SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>actual harvest date</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'actualHarvestDate')}
							 defaultValue={seedling.actualHarvestDate || ''}/></p>
				  </SwipePanelContent>*/}

				  {/*<SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>date seed expires</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'dateExpires')}
							 defaultValue={seedling.dateExpires || ''}/></p>
				  </SwipePanelContent>*/}
				</div>


				{/* soil comp */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">
					Soil Composition
				  </p>

				  {seedling.category === 'in-ground' ?
						  <React.Fragment>

							<SwipePanelContent icon="tilling">
							  <p className="modern-input">
								<label>is the soil tilled</label>
								<select onChange={(e) => this.updateData(e, 'tilled')}
										value={seedling.tilled || ''}>
								  <option value='' disabled={true}>- Is the soil tilled? -</option>
								  <option value={false}>No</option>
								  <option value={true}>Yes</option>
								</select>
							  </p>
							</SwipePanelContent>

							<SwipePanelContent icon="soilType">
							  <p className="modern-input">
								<label>ground soil type</label>
								<select onChange={(e) => this.updateData(e, 'soilType')}
										value={seedling.soilType || ''}>
								  <option value='' disabled={true}>- Select a ground soil type -</option>
								  {SoilTypes.map((item, index) => {
									return <option value={item.type} key={index}>{item.displayName}</option>
								  })}
								</select>
							  </p>
							</SwipePanelContent>

							<SwipePanelContent icon="soilAmendment">
							  <p className="modern-input">
								<label>soil amendment</label>
								<input type="text"
									   onChange={(e) => this.updateData(e, 'soilAmendment')}
									   value={seedling.soilAmendment || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon="ph">
							  <p className="modern-input">pH <input type="number"
																	min="0"
																	inputMode="numeric"
																	pattern="[0-9]*"
																	className="small"
																	placeholder="6.2"
																	onChange={(e) => this.updateData(e, 'ph')}/></p>
							</SwipePanelContent>

						  </React.Fragment>
						  :
						  (seedling.category === 'potted') ?
								  <React.Fragment>
									<SwipePanelContent icon="soilRecipe">
									  <p className="modern-input">
										<label>soil recipe</label>
										<input type="text"
											   onChange={(e) => this.updateData(e, 'soilRecipe')}
											   value={seedling.soilRecipe || ''}/></p>
									</SwipePanelContent>

									<SwipePanelContent icon="soilMoisture">
									  <p className="modern-input">Moisture Level <input type="number"
																						min="0"
																						inputMode="numeric"
																						pattern="[0-9]*"
																						className="small"
																						placeholder="40"
																						onChange={(e) => this.updateData(e, 'moisture')}/>%
									  </p>
									</SwipePanelContent>
								  </React.Fragment>
								  :
								  seedling.category === 'in-ground' ?
										  <React.Fragment>
											<SwipePanelContent icon="ph">
											  <p className="modern-input">pH <input type="number"
																					min="0"
																					inputMode="numeric"
																					pattern="[0-9]*"
																					className="small"
																					placeholder="6.2"
																					onChange={(e) => this.updateData(e, 'ph')}/>
											  </p>
											</SwipePanelContent>


											<SwipePanelContent icon="soilMoisture">
											  <p className="modern-input">Moisture Level <input type="number"
																								min="0"
																								inputMode="numeric"
																								pattern="[0-9]*"
																								className="small"
																								placeholder="40"
																								onChange={(e) => this.updateData(e, 'moisture')}/>%
											  </p>
											</SwipePanelContent>
										  </React.Fragment>
										  :
										  <p>Please select a category on the first panel.</p>
				  }


				</div>

				{/* location/date bought */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">Location & Date Bought</p>

				  <SwipePanelContent icon="locationBought">
					<p className="modern-input">
					  <label>location bought</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'locationBought')}
							 value={seedling.locationBought || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>date bought</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'dateBought')}
							 defaultValue={seedling.dateBought || ''}/></p>
				  </SwipePanelContent>

				</div>


			  </SwipeableViews>


			  <div className="add-data flex-around bottom-nav">

				<FontAwesomeIcon icon={faTimes}
								 className="plant-condition-icon"
								 alt="times"
								 title="cancel"
								 onClick={() => this.setState({swipeViewIndex: this.state.swipeViewIndex - 1})}/>

				<FontAwesomeIcon icon={faSave}
								 className="plant-condition-icon"
								 alt="floppy disk"
								 title="save"
								 onClick={this.addNewProfile}/>
			  </div>


			  <Modal show={this.state.showDiaryModal}
					 onHide={() => this.setState({showDiaryModal: false})}
					 className="seedling-view-data-modal">
				<Modal.Header closeButton>

				</Modal.Header>

				<Modal.Body>
				  Save new plant seedling?
				</Modal.Body>

				<Modal.Footer>
				  <button onClick={() => this.setState({showDiaryModal: false})}
						  className="flat">
					Cancel
				  </button>

				  <button onClick={() => this.setState({showDiaryModal: false})}
						  className="flat">
					Save
				  </button>
				</Modal.Footer>
			  </Modal>
			</div>
	)
  }
}

export default SeedlingAdd
