import React, { Component } from 'react'
import autobind from 'react-autobind'
import './ProfileAdd.scss'
import Modal from 'react-bootstrap/Modal'
import { Session } from 'meteor/session'
import SwipeableViews from 'react-swipeable-views'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun'
import { faTint } from '@fortawesome/free-solid-svg-icons/faTint'
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons/faSkullCrossbones'
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter'
import { faLeaf } from '@fortawesome/free-solid-svg-icons/faLeaf'
import { faMortarPestle } from '@fortawesome/free-solid-svg-icons/faMortarPestle'
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt'
// import { faBug } from '@fortawesome/free-solid-svg-icons/faBug'
// import { faSprayCan } from '@fortawesome/free-solid-svg-icons/faSprayCan'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons/faMapMarker'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends'
import { selectRandomPlantPicture } from '/imports/utils/selectRandomPlantPicture'
import { toast } from 'react-toastify'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import { faTree } from '@fortawesome/free-solid-svg-icons/faTree'
import Category from '/imports/api/Category/Category'
import SoilTypes from '../../../utils/soilTypes'
import SwipePanelContent from '../Shared/SwipePanelContent'

// import DatePicker from "react-datepicker";

class ProfileAdd extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  profile: {image: selectRandomPlantPicture()},
	  swipeViewIndex: 0,
	  showDiaryModal: false,
	  currentDateSelection: null,
	  categories: null
	}

	autobind(this)
  }

  componentDidMount () {
	Session.set('pageTitle', this.state.profile.commonName)
	const categories = Category.find().fetch()

	this.setState({
	  categories
	})
  }

  addNewProfile () {
	let profile = this.state.profile
	profile.waterSchedule = parseInt(profile.waterSchedule)
	profile.fertilizerSchedule = parseInt(profile.fertilizerSchedule)

	if (profile.pruningSchedule) {
	  profile.pruningSchedule = parseInt(profile.pruningSchedule)
	}

	if (profile.deadheadingSchedule) {
	  profile.deadheadingSchedule = parseInt(profile.deadheadingSchedule)
	}

	if (profile.soilCompositionTracker && !Array.isArray(profile.soilCompositionTracker)) {
	  profile.soilCompositionTracker = [profile.soilCompositionTracker]
	}

	/*if (profile.pestTracker && !Array.isArray(profile.pestTracker)) {
	  profile.pestTracker = [profile.pestTracker]
	}*/

	let errMsg

	if ((!profile.commonName) && (!profile.latinName)) {
	  errMsg = 'Please enter either a common or latin name (eg. Swiss Cheese Plant or Monstera adansonii).'
	} else if (!profile.waterSchedule) {
	  errMsg = 'Please enter a watering schedule (eg. 7).'
	} else if (!profile.fertilizerSchedule) {
	  errMsg = 'Please enter a fertilizer schedule (eg. 30).'
	} else if (!profile.waterPreference) {
	  errMsg = 'Please enter a watering preference (eg. Keep soil moist but not soggy, humidity tray helpful).'
	} else if (!profile.lightPreference) {
	  errMsg = 'Please enter a lighting preference (eg. Bright indirect light).'
	} else if (!profile.location) {
	  errMsg = 'Please enter where this plant lives in/around your home (eg. Living Room or Back Patio).'
	} else if (Meteor.isPro && !profile.category) {
	  errMsg = 'Please select a category.'
	}

	if (errMsg) {
	  toast.error(errMsg)
	} else {
	  Meteor.call('profile.insert', profile, (err, response) => {
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
	const profile = this.state.profile

	if (type === 'companions') {
	  if (e.target.value === '') {
		delete profile[type]
	  } else {
		const stripped = e.target.value.replace(/\s*,\s*/g, ',')
		profile[type] = stripped.split(',')
	  }
	} else if (type === 'ph' || type === 'moisture') {
	  let phVal = parseFloat(e.target.value)
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (profile.soilCompositionTracker) {
		profile.soilCompositionTracker[type] = (type === 'moisture' ? moistureVal : phVal)
	  } else {
		profile.soilCompositionTracker = {
		  date: new Date(),
		  [type]: type === 'moisture' ? moistureVal : phVal
		}
	  }

	} /*else if (type === 'pest' || type === 'treatment') {
	  if (profile.pestTracker) {
		profile.pestTracker[type] = e.target.value
	  } else {
		profile.pestTracker = {
		  date: new Date(),
		  [type]: e.target.value
		}
	  }

	}*/ else if (type === 'dateBought' || type === 'datePlanted') {
	  profile[type] = new Date(e)
	} /*else if (type === 'diary') {
	  profile[type] = {
		entry: e.target.value,
		date: new Date()
	  }
	}*/ else if (type === 'tilled') {
	  profile[type] = e.target.value === 'true' ? true : false
	} else {
	  profile[type] = e.target.value
	}

	this.setState({
	  profile
	})
  }

  render () {
	const profile = this.state.profile
	//TODO add ability to set plant photo and photo history eventually

	return (
			<div className="ProfileAdd">
			  <img src={profile.image}
				   alt={profile.commonName}
				   title={profile.commonName}
				   className="hero-img"/>


			  <SwipeableViews className="swipe-view"
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e})}>

				{/* plant info */}
				<div className="swipe-slide">

				  <p className="swipe-title title-ming">
					Plant {Meteor.isPro ? 'Details' : 'Name'}
				  </p>

				  <SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="common name">
					<p>* <input type="text"
								placeholder="Common Name"
								onChange={(e) => this.updateData(e, 'commonName')}
								value={profile.commonName || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="latin name">
					<p>* <input type="text"
								placeholder="Latin Name"
								onChange={(e) => this.updateData(e, 'latinName')}
								value={profile.latinName || ''}/></p>
				  </SwipePanelContent>

				  {Meteor.isPro &&
				  <React.Fragment>
					<SwipePanelContent icon={faFilter} iconAlt="filter" iconTitle="category">
					  <p>* <select placeholder="Category"
								   onChange={(e) => this.updateData(e, 'category')}
								   value={profile.category || ''}>
						<option value='' disabled={true}>- Select a category -</option>
						{this.state.categories && this.state.categories.map((item, index) => {
						  return <option value={item.category} key={index}>{item.displayName}</option>
						})}
					  </select>
					  </p>
					</SwipePanelContent>
				  </React.Fragment>
				  }

				  <SwipePanelContent icon={faSkullCrossbones} iconAlt="skull and crossbones" iconTitle="toxicity">
					<p><input type="text"
							  className="not-required"
							  placeholder="Toxicity (ie poisonous to dogs if leaves are consumed)"
							  onChange={(e) => this.updateData(e, 'toxicity')}
							  value={profile.toxicity || ''}/></p>
				  </SwipePanelContent>

				</div>


				{/* water */}
				<div className="swipe-slide">

				  <p className="swipe-title title-ming">
					Water - Light
				  </p>

				  <SwipePanelContent icon={faCalendarAlt} iconAlt="calendar" iconTitle="water schedule">
					<p>* Water every <input type="number"
											placeholder="4"
											className="small"
											onChange={(e) => this.updateData(e, 'waterSchedule')}
											value={profile.waterSchedule || ''}/> days</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faTint} iconAlt="water drop" iconTitle="water preference">
					<p>* <input type="text"
								placeholder="Watering Preferences"
								onChange={(e) => this.updateData(e, 'waterPreference')}
								value={profile.waterPreference || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faSun} iconAlt="sun" iconTitle="light preference">
					<p>* <input type="text"
								placeholder="Light Preferences"
								onChange={(e) => this.updateData(e, 'lightPreference')}
								value={profile.lightPreference || ''}/></p>
				  </SwipePanelContent>

				</div>


				{/* fertilizer */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">
					{Meteor.isPro ? 'Fertilizer / Nutrients' : 'Fertilizer'}
				  </p>

				  <SwipePanelContent icon={faCalendarAlt} iconAlt="calendar"
									 iconTitle={Meteor.isPro ? 'feeding schedule' : 'fertilizer schedule'}>
					<p>* {Meteor.isPro ? 'Feed' : 'Fertilize'} every <input type="number"
																			placeholder="30"
																			className="small"
																			onChange={(e) => this.updateData(e, 'fertilizerSchedule')}/> days
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="preferred fertilizer">
					<p><input type="text"
							  className="not-required"
							  placeholder="Preferred Fertilizer"
							  onChange={(e) => this.updateData(e, 'fertilizer')}
							  value={profile.fertilizer || ''}/></p>
				  </SwipePanelContent>


				  {Meteor.isPro &&
				  <React.Fragment>
					<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="compost">
					  <p><input type="text"
								className="not-required"
								placeholder="Compost"
								onChange={(e) => this.updateData(e, 'compost')}
								value={profile.compost || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon={faLeaf} iconAlt="leaf" iconTitle="other nutrient amendment">
					  <p><input type="text"
								className="not-required"
								placeholder="Other Nutrient Amendment"
								onChange={(e) => this.updateData(e, 'nutrient')}
								value={profile.nutrient || ''}/></p>
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

				  <SwipePanelContent icon={faTree}
									 iconAlt="tree"
									 iconTitle="pruning schedule">
					<p>Prune every <input type="number"
										  className="small not-required"
										  placeholder="30"
										  onChange={(e) => this.updateData(e, 'pruningSchedule')}/> days
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faTree}
									 iconAlt="tree"
									 iconTitle="pruning schedule">
					<p>Deadhead every <input type="number"
										  className="small not-required"
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

				  {Meteor.isPro && profile.category === 'in-ground' ?
						  <React.Fragment>

							<SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="tilled">
							  <p><select placeholder="Tilled"
										 className="not-required"
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
										 className="not-required"
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
										className="not-required"
										placeholder="Soil Amendment"
										onChange={(e) => this.updateData(e, 'soilAmendment')}
										value={profile.soilAmendment || ''}/></p>
							</SwipePanelContent>

							<SwipePanelContent icon={faTachometerAlt} iconAlt="tachometer" iconTitle="pH level">
							  <p>pH <input type="number"
										   className="not-required"
										   placeholder="6.2"
										   className="small"
										   onChange={(e) => this.updateData(e, 'ph')}/></p>
							</SwipePanelContent>

						  </React.Fragment>
						  :
						  (Meteor.isPro && profile.category === 'potted') ?
								  <React.Fragment>
									<SwipePanelContent icon={faMortarPestle} iconAlt="mortar and pestle"
													   iconTitle="soil recipe">
									  <p><input type="text"
												className="not-required"
												placeholder="Soil Recipe"
												onChange={(e) => this.updateData(e, 'soilRecipe')}
												value={profile.soilRecipe || ''}/></p>
									</SwipePanelContent>

									<SwipePanelContent icon={faTint} iconAlt="water drop" iconTitle="soil moisture">
									  <p>Moisture Level <input type="number"
															   className="not-required"
															   placeholder="40"
															   className="small"
															   onChange={(e) => this.updateData(e, 'moisture')}/>%</p>
									</SwipePanelContent>
								  </React.Fragment>
								  :
								  profile.category === 'in-ground' ?
										  <React.Fragment>
											<SwipePanelContent icon={faTachometerAlt} iconAlt="tachometer"
															   iconTitle="pH level">
											  <p>pH <input type="number"
														   className="not-required"
														   placeholder="6.2"
														   className="small"
														   onChange={(e) => this.updateData(e, 'ph')}/></p>
											</SwipePanelContent>


											<SwipePanelContent icon={faTint} iconAlt="water drop"
															   iconTitle="soil moisture">
											  <p>Moisture Level <input type="number"
																	   className="not-required"
																	   placeholder="40"
																	   className="small"
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

				  <SwipePanelContent icon={faMapMarker} iconAlt="map marker" iconTitle="location bought">
					<p><input type="text"
							  className="not-required"
							  placeholder="Location Bought"
							  onChange={(e) => this.updateData(e, 'locationBought')}
							  value={profile.locationBought || ''}/></p>
				  </SwipePanelContent>

				  {/*need to make this swipepanelcontent with the cusom style*/}
				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faCalendarAlt}
									   className="plant-condition-icon"
									   alt="calendar"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p><input type="date"
								className="not-required"
								placeholder="Date Bought"
								onBlur={(e) => this.updateData(e, 'dateBought')}
								defaultValue={profile.dateBought || ''}/></p>

					  {/*TODO get datepicker to open over image*/}
					  {/*<p>* Date Bought</p>
					  <DatePicker selected={profile.dateBought || Date.now()}
								  className="react-datepicker-wrapper"
								  dateFormat="dd-MMMM-yyyy"
								  popperPlacement="bottom"
								  onSelect={(e) => this.updateData(e, 'dateBought')}
								  highlightDates={ProfileAdd.getHighlightDates(profile.dateBought, 'dateBought')} />*/}
					</div>
				  </div>

				</div>


				{/* etc */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">Etc</p>
				  <SwipePanelContent icon={faCalendarAlt} iconAlt="calendar"
									 iconTitle={profile.category === 'potted' ? 'Date Potted' : 'Date Planted'}>
					<p>
					  <i className="not-required">{profile.category === 'potted' ? 'Date Potted' : 'Date Planted'}</i>

					  <input type="date"
							 className="not-required"
							 placeholder={profile.category === 'potted' ? 'Date Potted' : 'Date Planted'}
							 onBlur={(e) => this.updateData(e, 'datePlanted')}
							 defaultValue={profile.datePlanted || ''}/>
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faHome} iconAlt="house" iconTitle="plant location">
					<p>* <input type="text"
								placeholder="Plant location"
								onChange={(e) => this.updateData(e, 'location')}
								value={profile.location || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faUserFriends} iconAlt="people" iconTitle="companion plants">
					<p><input type="text"
							  className="not-required"
							  placeholder="Companion plants"
							  onChange={(e) => this.updateData(e, 'companions')}
							  value={profile.companions || ''}/></p>
				  </SwipePanelContent>

				  {/* <SwipePanelContent icon={faInfoCircle} iconAlt="info" iconTitle="diary and notes">
					<p><textarea rows="3"
								 placeholder="Diary / Notes"
								 onChange={(e) => this.updateData(e, 'diary')}
								 value={profile.diary || ''}/></p>
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
					 className="profile-view-data-modal">
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

export default ProfileAdd
