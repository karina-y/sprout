import React, { Component } from 'react'
import autobind from 'react-autobind'
import './PlantAdd.scss'
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
import SwipePanelContent from '/imports/ui/components/Shared/SwipePanelContent/SwipePanelContent'

class PlantAdd extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  plant: {
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
	Session.set('pageTitle', this.state.plant.commonName)
	const categories = Category.find().fetch()

	this.setState({
	  categories
	})
  }

  addNewPlant () {
	let plant = this.state.plant
	// plant.waterSchedule = parseInt(plant.waterSchedule)
	// plant.fertilizerSchedule = parseInt(plant.fertilizerSchedule)

	if (plant.waterSchedule) {
	  plant.waterSchedule = parseInt(plant.waterSchedule)
	}

	if (plant.fertilizerSchedule) {
	  plant.fertilizerSchedule = parseInt(plant.fertilizerSchedule)
	}

	if (plant.pruningSchedule) {
	  plant.pruningSchedule = parseInt(plant.pruningSchedule)
	}

	if (plant.deadheadingSchedule) {
	  plant.deadheadingSchedule = parseInt(plant.deadheadingSchedule)
	}

	if (plant.soilCompositionTracker && !Array.isArray(plant.soilCompositionTracker)) {
	  plant.soilCompositionTracker = [plant.soilCompositionTracker]
	}

	/*if (plant.pestTracker && !Array.isArray(plant.pestTracker)) {
	  plant.pestTracker = [plant.pestTracker]
	}*/

	let errMsg

	if (!plant.commonName && !plant.latinName) {
	  errMsg = 'Please enter either a common or latin name (eg. Swiss Cheese Plant or Monstera adansonii).'
	} /*else if (!plant.waterSchedule) {
	  errMsg = 'Please enter a watering schedule (eg. 7).'
	} else if (!plant.fertilizerSchedule) {
	  errMsg = 'Please enter a fertilizer schedule (eg. 30).'
	}*/ else if (!plant.waterPreference) {
	  errMsg = 'Please enter a watering preference (eg. Keep soil moist but not soggy, humidity tray helpful).'
	} else if (!plant.lightPreference) {
	  errMsg = 'Please enter a lighting preference (eg. Bright indirect light).'
	} else if (!plant.location) {
	  errMsg = 'Please enter where this plant lives in/around your home (eg. Living Room or Back Patio).'
	} else if (Meteor.isPro && !plant.category) {
	  errMsg = 'Please select a category.'
	}

	if (errMsg) {
	  toast.error(errMsg)
	} else {
	  Meteor.call('plant.insert', plant, (err, response) => {
		if (err) {
		  toast.error(err.message)
		} else {
		  toast.success('Plant added!')
		  this.props.history.push('/catalogue')
		}
	  })
	}
  }

  updateData (e, type) {
	const plant = this.state.plant

	if (type === 'companions') {
	  if (e.target.value === '') {
		delete plant[type]
	  } else {
		const stripped = e.target.value.replace(/\s*,\s*/g, ',')
		plant[type] = stripped.split(',')
	  }
	} else if (type === 'ph' || type === 'moisture') {
	  let phVal = parseFloat(e.target.value)
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (plant.soilCompositionTracker) {
		plant.soilCompositionTracker[type] = (type === 'moisture' ? moistureVal : phVal)
	  } else {
		plant.soilCompositionTracker = {
		  date: new Date(),
		  [type]: type === 'moisture' ? moistureVal : phVal
		}
	  }

	} /*else if (type === 'pest' || type === 'treatment') {
	  if (plant.pestTracker) {
		plant.pestTracker[type] = e.target.value
	  } else {
		plant.pestTracker = {
		  date: new Date(),
		  [type]: e.target.value
		}
	  }

	}*/ else if (type === 'dateBought' || type === 'datePlanted') {
	  plant[type] = new Date(e)
	} /*else if (type === 'diary') {
	  plant[type] = {
		entry: e.target.value,
		date: new Date()
	  }
	}*/ else if (type === 'tilled') {
	  plant[type] = e.target.value === 'true' ? true : false
	} else if (type === 'waterScheduleAuto') {
	  plant[type] = !plant[type]
	} else {
	  plant[type] = e.target.value
	}

	this.setState({
	  plant: plant
	})
  }

  render () {
	const plant = this.state.plant
	//TODO add ability to set plant photo and photo history eventually

	return (
			<div className="PlantAdd">
			  <img src={plant.image}
				   alt={plant.commonName}
				   title={plant.commonName}
				   className="hero-img"/>


			  <SwipeableViews className="swipe-view"
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e})}>

				{/* plant info */}
				<div className="swipe-slide">

				  <p className="swipe-title title-ming">
					Plant {Meteor.isPro ? 'Details' : 'Name'}
				  </p>

				  <SwipePanelContent icon="info" iconTitle="common name">
					<p className="modern-input">
					  <label>common name *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'commonName')}
							 value={plant.commonName || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="info" iconTitle="latin name">
					<p className="modern-input">
					  <label>latin name *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'latinName')}
							 value={plant.latinName || ''}/></p>
				  </SwipePanelContent>

				  {Meteor.isPro &&
				  <React.Fragment>
					<SwipePanelContent icon="category">
					  <p className="modern-input">
						<label>category *</label>
						<select onChange={(e) => this.updateData(e, 'category')}
								value={plant.category || ''}>
						  <option value='' disabled={true}>- Select a category -</option>
						  {this.state.categories && this.state.categories.map((item, index) => {
							return <option value={item.category} key={index}>{item.displayName}</option>
						  })}
						</select>
					  </p>
					</SwipePanelContent>
				  </React.Fragment>
				  }

				  <SwipePanelContent icon="toxicity">
					<p className="modern-input">
					  <label>toxicity</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'toxicity')}
							 value={plant.toxicity || ''}/></p>
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
																   value={plant.waterSchedule || ''}/> days</p>
				  </SwipePanelContent>

				  {Meteor.isPro &&
				  <SwipePanelContent icon="waterAuto"
									 iconTitle="automatic water schedule">
					<p>
					  <label>
						<input type="checkbox"
							   className="small-checkbox"
							   onChange={(e) => this.updateData(e, 'waterScheduleAuto')}/>

						Automatic watering
					  </label>
					</p>
				  </SwipePanelContent>
				  }

				  <SwipePanelContent icon="water">
					<p className="modern-input">
					  <label>watering preferences *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'waterPreference')}
							 value={plant.waterPreference || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="lightPreference">
					<p className="modern-input">
					  <label>light preferences *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'lightPreference')}
							 value={plant.lightPreference || ''}/></p>
				  </SwipePanelContent>

				</div>


				{/* fertilizer */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">
					{Meteor.isPro ? 'Fertilizer / Nutrients' : 'Fertilizer'}
				  </p>

				  <SwipePanelContent icon="schedule" iconTitle={`${Meteor.isPro ? 'feeding' : 'fertilizer'} schedule`}>
					<p className="modern-input">{Meteor.isPro ? 'Feed' : 'Fertilize'} every <input type="number"
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
							 value={plant.fertilizer || ''}/></p>
				  </SwipePanelContent>


				  {Meteor.isPro &&
				  <React.Fragment>
					<SwipePanelContent icon="compost">
					  <p className="modern-input">
						<label>compost</label>
						<input type="text"
							   onChange={(e) => this.updateData(e, 'compost')}
							   value={plant.compost || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="nutrients">
					  <p className="modern-input">
						<label>other nutrient amendment</label>
						<input type="text"
							   onChange={(e) => this.updateData(e, 'nutrient')}
							   value={plant.nutrient || ''}/></p>
					</SwipePanelContent>
				  </React.Fragment>
				  }

				</div>


				{/* pruning/deadheading schedule */}
				{Meteor.isPro &&
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">
					Pruning - Deadheading
				  </p>

				  <SwipePanelContent icon="schedule" iconTitle="pruning schedule">
					<p className="modern-input">Prune every <input type="number"
																   min="0"
																   inputMode="numeric"
																   pattern="[0-9]*"
																   className="small"
																   placeholder="30"
																   onChange={(e) => this.updateData(e, 'pruningSchedule')}/> days
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="schedule" iconTitle="deadheading schedule">
					<p className="modern-input">Deadhead every <input type="number"
																	  min="0"
																	  inputMode="numeric"
																	  pattern="[0-9]*"
																	  className="small"
																	  placeholder="30"
																	  onChange={(e) => this.updateData(e, 'deadheadingSchedule')}/> days
					</p>
				  </SwipePanelContent>

				</div>
				}


				{/* soil comp */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">
					Soil Composition
				  </p>

				  {Meteor.isPro && plant.category === 'in-ground' ?
						  <React.Fragment>

							<SwipePanelContent icon="tilling">
							  <p className="modern-input">
								<label>is the soil tilled</label>
								<select onChange={(e) => this.updateData(e, 'tilled')}
										value={plant.tilled || ''}>
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
										value={plant.soilType || ''}>
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
									   value={plant.soilAmendment || ''}/></p>
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
						  (Meteor.isPro && plant.category === 'potted') ?
								  <React.Fragment>
									<SwipePanelContent icon="soilRecipe">
									  <p className="modern-input">
										<label>soil recipe</label>
										<input type="text"
											   onChange={(e) => this.updateData(e, 'soilRecipe')}
											   value={plant.soilRecipe || ''}/></p>
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
								  plant.category === 'in-ground' ?
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


				{/* pests */}
				{/*<div className="swipe-slide slide-four">
				  <p className="swipe-title title-ming">Pests</p>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faBug}
									   className="plant-condition-icon"
									   alt="bug"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p><input type="text"
								placeholder="Name of pest"
								onChange={(e) => this.updateData(e, 'pest')}/></p>
					</div>
				  </div>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faSprayCan}
									   className="plant-condition-icon"
									   alt="spray can"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p><input type="text"
								placeholder="Pest Treatment"
								onChange={(e) => this.updateData(e, 'treatment')}/></p>
					</div>
				  </div>

				</div>*/}


				{/* location/date bought */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">Location & Date Bought</p>

				  <SwipePanelContent icon="locationBought">
					<p className="modern-input">
					  <label>location bought</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'locationBought')}
							 value={plant.locationBought || ''}/></p>
				  </SwipePanelContent>

				  {/*need to make this swipepanelcontent with the custom style*/}
				  <SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>date bought</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'dateBought')}
							 defaultValue={plant.dateBought || ''}/></p>
				  </SwipePanelContent>

				</div>


				{/* etc */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">Etc</p>
				  <SwipePanelContent icon="category"
									 iconTitle={plant.category === 'potted' ? 'Date Potted' : 'Date Planted'}>
					<p className="modern-input">
					  <label>{plant.category === 'potted' ? 'date potted' : 'date planted'}</label>

					  <input type="date"
							 placeholder={plant.category === 'potted' ? 'Date Potted' : 'Date Planted'}
							 onBlur={(e) => this.updateData(e, 'datePlanted')}
							 defaultValue={plant.datePlanted || ''}/>
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="plantLocation">
					<p className="modern-input">
					  <label>plant location *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'location')}
							 value={plant.location || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="companions">
					<p className="modern-input">
					  <label>companion plants</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'companions')}
							 value={plant.companions || ''}/></p>
				  </SwipePanelContent>

				  {/* <SwipePanelContent icon={IconList.info.icon} iconAlt={IconList.info.alt} customIcon={IconList.info.isCustom} iconTitle="diary and notes">
					<p><textarea rows="3"
								 placeholder="Diary / Notes"
								 onChange={(e) => this.updateData(e, 'diary')}
								 value={plant.diary || ''}/></p>
				  </SwipePanelContent>*/}
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
								 onClick={this.addNewPlant}/>
			  </div>


			  <Modal show={this.state.showDiaryModal}
					 onHide={() => this.setState({showDiaryModal: false})}
					 className="plant-view-data-modal">
				<Modal.Header closeButton>

				</Modal.Header>

				<Modal.Body>
				  Save new plant profile?
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

export default PlantAdd
