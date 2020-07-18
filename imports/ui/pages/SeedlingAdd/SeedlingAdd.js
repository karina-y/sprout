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
	// seedling.waterSchedule = parseInt(seedling.waterSchedule)
	// seedling.fertilizerSchedule = parseInt(seedling.fertilizerSchedule)

	if (seedling.waterSchedule) {
	  seedling.waterSchedule = parseInt(seedling.waterSchedule)
	}

	if (seedling.fertilizerSchedule) {
	  seedling.fertilizerSchedule = parseInt(seedling.fertilizerSchedule)
	}

	if (seedling.pruningSchedule) {
	  seedling.pruningSchedule = parseInt(seedling.pruningSchedule)
	}

	if (seedling.deadheadingSchedule) {
	  seedling.deadheadingSchedule = parseInt(seedling.deadheadingSchedule)
	}

	if (seedling.soilCompositionTracker && !Array.isArray(seedling.soilCompositionTracker)) {
	  seedling.soilCompositionTracker = [seedling.soilCompositionTracker]
	}

	/*if (seedling.pestTracker && !Array.isArray(seedling.pestTracker)) {
	  seedling.pestTracker = [seedling.pestTracker]
	}*/

	let errMsg

	if ((!seedling.commonName) && (!seedling.latinName)) {
	  errMsg = 'Please enter either a common or latin name (eg. Swiss Cheese Plant or Monstera adansonii).'
	} /*else if (!seedling.waterSchedule) {
	  errMsg = 'Please enter a watering schedule (eg. 7).'
	} else if (!seedling.fertilizerSchedule) {
	  errMsg = 'Please enter a fertilizer schedule (eg. 30).'
	}*/ else if (!seedling.waterPreference) {
	  errMsg = 'Please enter a watering preference (eg. Keep soil moist but not soggy, humidity tray helpful).'
	} else if (!seedling.lightPreference) {
	  errMsg = 'Please enter a lighting preference (eg. Bright indirect light).'
	} else if (!seedling.location) {
	  errMsg = 'Please enter where this plant lives in/around your home (eg. Living Room or Back Patio).'
	} else if (Meteor.isPro && !seedling.category) {
	  errMsg = 'Please select a category.'
	}

	if (errMsg) {
	  toast.error(errMsg)
	} else {
	  Meteor.call('seedling.insert', seedling, (err, response) => {
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
	const seedling = this.state.seedling

	if (type === 'companions') {
	  if (e.target.value === '') {
		delete seedling[type]
	  } else {
		const stripped = e.target.value.replace(/\s*,\s*/g, ',')
		seedling[type] = stripped.split(',')
	  }
	} else if (type === 'ph' || type === 'moisture') {
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

	} /*else if (type === 'pest' || type === 'treatment') {
	  if (seedling.pestTracker) {
		seedling.pestTracker[type] = e.target.value
	  } else {
		seedling.pestTracker = {
		  date: new Date(),
		  [type]: e.target.value
		}
	  }

	}*/ else if (type === 'dateBought' || type === 'datePlanted') {
	  seedling[type] = new Date(e)
	} /*else if (type === 'diary') {
	  seedling[type] = {
		entry: e.target.value,
		date: new Date()
	  }
	}*/ else if (type === 'tilled') {
	  seedling[type] = e.target.value === 'true' ? true : false
	} else if (type === 'waterScheduleAuto') {
	  seedling[type] = !seedling[type]
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
			<div className="PlantAdd">
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
					Plant {Meteor.isPro ? 'Details' : 'Name'}
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

				  {Meteor.isPro &&
				  <React.Fragment>
					<SwipePanelContent icon="category">
					  <p className="modern-input">
						<label>category *</label>
						<select placeholder="Category"
								onChange={(e) => this.updateData(e, 'category')}
								value={seedling.category || ''}>
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
							 value={seedling.toxicity || ''}/></p>
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
							 value={seedling.fertilizer || ''}/></p>
				  </SwipePanelContent>


				  {Meteor.isPro &&
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

				  {Meteor.isPro && seedling.category === 'in-ground' ?
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
						  (Meteor.isPro && seedling.category === 'potted') ?
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
							 value={seedling.locationBought || ''}/></p>
				  </SwipePanelContent>

				  {/*need to make this swipepanelcontent with the custom style*/}
				  <SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>date bought</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'dateBought')}
							 defaultValue={seedling.dateBought || ''}/></p>
				  </SwipePanelContent>

				</div>


				{/* etc */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">Etc</p>
				  <SwipePanelContent icon="category"
									 iconTitle={seedling.category === 'potted' ? 'Date Potted' : 'Date Planted'}>
					<p className="modern-input">
					  <label>{seedling.category === 'potted' ? 'date potted' : 'date planted'}</label>

					  <input type="date"
							 placeholder={seedling.category === 'potted' ? 'Date Potted' : 'Date Planted'}
							 onBlur={(e) => this.updateData(e, 'datePlanted')}
							 defaultValue={seedling.datePlanted || ''}/>
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="plantLocation">
					<p className="modern-input">
					  <label>plant location *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'location')}
							 value={seedling.location || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="companions">
					<p className="modern-input">
					  <label>companion plants</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'companions')}
							 value={seedling.companions || ''}/></p>
				  </SwipePanelContent>

				  {/* <SwipePanelContent icon={IconList.info.icon} iconAlt={IconList.info.alt} customIcon={IconList.info.isCustom} iconTitle="diary and notes">
					<p><textarea rows="3"
								 placeholder="Diary / Notes"
								 onChange={(e) => this.updateData(e, 'diary')}
								 value={seedling.diary || ''}/></p>
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
