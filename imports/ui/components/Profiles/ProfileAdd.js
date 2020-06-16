import React, { Component } from 'react';
import autobind from 'react-autobind';
import "./ProfileAdd.scss";
import Modal from 'react-bootstrap/Modal';
import { Session } from 'meteor/session';
import SwipeableViews from 'react-swipeable-views';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { faTint } from '@fortawesome/free-solid-svg-icons/faTint';
import { faBug } from '@fortawesome/free-solid-svg-icons/faBug';
import { faSprayCan } from '@fortawesome/free-solid-svg-icons/faSprayCan';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons/faMapMarker';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { selectRandomPlantPicture } from '/imports/utils/selectRandomPlantPicture';
import { toast } from 'react-toastify';
// import DatePicker from "react-datepicker";

class ProfileAdd extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  profile: {image: selectRandomPlantPicture()},
	  swipeViewIndex: 0,
	  showNotesModal: false,
	  currentDateSelection: null
	};

	autobind(this);
  }

  componentDidMount() {
	Session.set('pageTitle', this.state.profile.commonName);
  }

  //TODO turn into hook
  static getHighlightDates(items, type) {
	let dates = [];

	if (type === "dateBought" && items) {
	  dates.push(new Date(items))
	} else if (items && items.length > 0) {
	  for (let i = 0; i < items.length; i++) {
		dates.push(new Date(items[i].date));
	  }
	}

	return dates;
  }

  addNewProfile() {
	let profile = this.state.profile;
	profile.waterSchedule = parseInt(profile.waterSchedule);
	profile.fertilizerSchedule = parseInt(profile.fertilizerSchedule);

	if (profile.soilCompositionTracker && !Array.isArray(profile.soilCompositionTracker)) {
	  profile.soilCompositionTracker = [profile.soilCompositionTracker];
	}

	if (profile.pestTracker && !Array.isArray(profile.pestTracker)) {
	  profile.pestTracker = [profile.pestTracker];
	}

	let errMsg;

	if (!profile.commonName || profile.commonName === "") {
	  errMsg = "Please enter a common name (eg. Swiss Cheese Plant)."
	} else if (!profile.latinName || profile.latinName === "") {
	  errMsg = "Please enter a latin name (eg. Monstera adansonii)."
	} else if (!profile.waterSchedule || profile.waterSchedule === "") {
	  errMsg = "Please enter a watering schedule (eg. 7)."
	} else if (!profile.fertilizerSchedule || profile.fertilizerSchedule === "") {
	  errMsg = "Please enter a fertilizer schedule (eg. 30)."
	} else if (!profile.waterPreference || profile.waterPreference === "") {
	  errMsg = "Please enter a watering preference (eg. Keep soil moist but not soggy, humidity tray helpful)."
	} else if (!profile.lightPreference || profile.lightPreference === "") {
	  errMsg = "Please enter a lighting preference (eg. Bright indirect light)."
	} else if (!profile.locationBought || profile.locationBought === "") {
	  errMsg = "Please enter a where this plant was purchased (eg. Armstrong Garden Centers)."
	} else if (!profile.dateBought || profile.dateBought === "") {
	  errMsg = "Please enter the date this plant was purchased (eg. 5/10/20)."
	} else if (!profile.location || profile.location === "") {
	  errMsg = "Please enter where this plant lives in/around your home (eg. Living Room)."
	}

	if (errMsg) {
	  toast.error(errMsg);
	} else {
	  Meteor.call('profile.insert', profile, (err, response) => {
		if (err) {
		  toast.error(err.message);
		} else {
		  toast.success("Plant added!");
		  this.props.history.push('/catalogue');
		}
	  });
	}
  }

  updateData(e, type) {
	const profile = this.state.profile;

	if (type === "companions") {
	  if (e.target.value === "") {
		delete profile[type];
	  } else {
		const stripped = e.target.value.replace(/\s*,\s*/g, ",");
		profile[type] = stripped.split(',');
	  }
	} else if (type === "ph" || type === "moisture") {
	  let phVal = parseFloat(e.target.value);
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (profile.soilCompositionTracker) {
		profile.soilCompositionTracker[type] = ( type === "moisture" ? moistureVal : phVal );
	  }
	  else {
		profile.soilCompositionTracker = {
		  date: new Date(),
		  [type]: type === "moisture" ? moistureVal : phVal
		}
	  }

	}  else if (type === "pest" || type === "treatment") {
	  if (profile.pestTracker) {
		profile.pestTracker[type] = e.target.value;
	  }
	  else {
		profile.pestTracker = {
		  date: new Date(),
		  [type]: e.target.value
		}
	  }

	} else if (type === "dateBought") {
	  profile[type] = new Date(e);
	} else {
	  profile[type] = e.target.value;
	}

	this.setState({
	  profile
	});
  }

  render() {
	const profile = this.state.profile;

	return (
			<div className="ProfileAdd">
			  <img src={profile.image}
				   alt={profile.commonName}
				   title={profile.commonName}
				   className="hero-img" />


			  <SwipeableViews className="swipe-view"
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e})}>

				{/* plant info */}
				<div className="swipe-slide slide-zero">

				  <p className="swipe-title title-ming">
					Plant Name
				  </p>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faInfoCircle}
									   className="plant-condition-icon"
									   alt="calendar"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>* <input type="text"
								  placeholder="Common Name"
								  onChange={(e) => this.updateData(e, 'commonName')}
								  value={profile.commonName || ''} /></p>
					</div>
				  </div>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faInfoCircle}
									   className="plant-condition-icon"
									   alt="info"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>* <input type="text"
								  placeholder="Latin Name"
								  onChange={(e) => this.updateData(e, 'latinName')}
								  value={profile.latinName || ''} /></p>
					</div>
				  </div>

				</div>


				{/* water */}
				<div className="swipe-slide slide-one">

				  <p className="swipe-title title-ming">
					Water - Light
				  </p>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faCalendarAlt}
									   className="plant-condition-icon"
									   alt="calendar"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>* Water every <input type="number"
											  placeholder="4"
											  className="small"
											  onChange={(e) => this.updateData(e, 'waterSchedule')}
											  value={profile.waterSchedule || ''} /> days</p>
					</div>
				  </div>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faTint}
									   className="plant-condition-icon"
									   alt="water drop"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>* <input type="text"
								  placeholder="Watering Preferences"
								  onChange={(e) => this.updateData(e, 'waterPreference')}
								  value={profile.waterPreference || ''} /></p>
					</div>
				  </div>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faSun}
									   className="plant-condition-icon"
									   alt="sun"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>* <input type="text"
								  placeholder="Light Preferences"
								  onChange={(e) => this.updateData(e, 'lightPreference')}
								  value={profile.lightPreference || ''} /></p>
					</div>
				  </div>

				</div>


				{/* fertilizer */}
				<div className="swipe-slide slide-two">
				  <p className="swipe-title title-ming">
					Fertilizer
				  </p>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faCalendarAlt}
									   className="plant-condition-icon"
									   alt="calendar"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>* Fertilize every <input type="number"
												  placeholder="30"
												  className="small"
												  onChange={(e) => this.updateData(e, 'fertilizerSchedule')} /> days</p>
					</div>
				  </div>

				</div>


				{/* soil comp */}
				<div className="swipe-slide slide-three">
				  <p className="swipe-title title-ming">
					Soil Composition
				  </p>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faInfoCircle}
									   className="plant-condition-icon"
									   alt="info"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>pH <input type="number"
								   placeholder="6.2"
								   className="small"
								   onChange={(e) => this.updateData(e, 'ph')} /></p>
					</div>
				  </div>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faInfoCircle}
									   className="plant-condition-icon"
									   alt="info"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>Moisture Level <input type="number"
											   placeholder="40"
											   className="small"
											   onChange={(e) => this.updateData(e, 'moisture')} />%</p>
					</div>
				  </div>

				</div>


				{/* pests */}
				<div className="swipe-slide slide-four">
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
								onChange={(e) => this.updateData(e, 'pest')} /></p>
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
								onChange={(e) => this.updateData(e, 'treatment')} /></p>
					</div>
				  </div>

				</div>


				{/* location/date bought */}
				<div className="swipe-slide slide-five">
				  <p className="swipe-title title-ming">Location & Date Bought</p>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faMapMarker}
									   className="plant-condition-icon"
									   alt="map marker"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>* <input type="text"
								  placeholder="Location Bought"
								  onChange={(e) => this.updateData(e, 'locationBought')}
								  value={profile.locationBought || ''} /></p>
					</div>
				  </div>

				  <div className="detail-panel">
					<div className="icon-side" style={{verticalAlign: 'top'}}>
					  <FontAwesomeIcon icon={faCalendarAlt}
									   className="plant-condition-icon"
									   alt="calendar"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>* <input type="date"
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


				{/* notes/etc */}
				<div className="swipe-slide slide-six">
				  <p className="swipe-title title-ming">Notes</p>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faHome}
									   className="plant-condition-icon"
									   alt="house"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p>* <input type="text"
								  placeholder="Location in home"
								  onChange={(e) => this.updateData(e, 'location')}
								  value={profile.location || ''} /></p>
					</div>
				  </div>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faUserFriends}
									   className="plant-condition-icon"
									   alt="people"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p><input type="text"
								placeholder="Companion plants"
								onChange={(e) => this.updateData(e, 'companions')}
								value={profile.companions || ''} /></p>
					</div>
				  </div>

				  <div className="detail-panel">
					<div className="icon-side">
					  <FontAwesomeIcon icon={faInfoCircle}
									   className="plant-condition-icon"
									   alt="info"/>
					  <span className="separator">|</span>
					</div>

					<div className="info-side">
					  <p><textarea rows="3"
								   placeholder="Notes"
								   onChange={(e) => this.updateData(e, 'notes')}
								   value={profile.notes || ''}/></p>
					</div>
				  </div>
				</div>

			  </SwipeableViews>

			  <div className="add-data flex-around">
				{this.state.swipeViewIndex === 6 ?
						<React.Fragment>
						  <FontAwesomeIcon icon={faChevronLeft}
										   className="plant-condition-icon"
										   size='3x'
										   alt="left arrow"
										   onClick={() => this.setState({swipeViewIndex: this.state.swipeViewIndex - 1})}/>

						  <FontAwesomeIcon icon={faCheck}
										   className="plant-condition-icon"
										   size='3x'
										   alt="checkmark"
										   onClick={this.addNewProfile}/>
						</React.Fragment>
						:
						<React.Fragment>
						  {this.state.swipeViewIndex !== 0 &&
						  <FontAwesomeIcon icon={faChevronLeft}
										   className="plant-condition-icon"
										   size='3x'
										   alt="left arrow"
										   onClick={() => this.setState({swipeViewIndex: this.state.swipeViewIndex - 1})}/>
						  }

						  <FontAwesomeIcon icon={faChevronRight}
										   className="plant-condition-icon"
										   size='3x'
										   alt="right arrow"
										   onClick={() => this.setState({swipeViewIndex: this.state.swipeViewIndex + 1})}/>
						</React.Fragment>
				}

			  </div>

			  <Modal show={this.state.showNotesModal}
					 onHide={() => this.setState({showNotesModal: false})}
					 className="profile-view-data-modal">
				<Modal.Header closeButton>

				</Modal.Header>

				<Modal.Body>
				  Save new plant profile?
				</Modal.Body>

				<Modal.Footer>
				  <button onClick={() => this.setState({showNotesModal: false})}
						  className="flat">
					Cancel
				  </button>

				  <button onClick={() => this.setState({showNotesModal: false})}
						  className="flat">
					Save
				  </button>
				</Modal.Footer>
			  </Modal>
			</div>
	);
  }
}

export default ProfileAdd;
