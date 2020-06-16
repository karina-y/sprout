import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import autobind from 'react-autobind';
import "./ProfileViewEdit.scss";
import { Session } from 'meteor/session';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SwipeableViews from 'react-swipeable-views';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { faTint } from '@fortawesome/free-solid-svg-icons/faTint';
import { faBug } from '@fortawesome/free-solid-svg-icons/faBug';
import { faSprayCan } from '@fortawesome/free-solid-svg-icons/faSprayCan';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faMeh } from '@fortawesome/free-solid-svg-icons/faMeh';
import { faSadTear } from '@fortawesome/free-solid-svg-icons/faSadTear';
import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons/faMapMarker';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import {
  getDaysSinceAction, getLastPestName, getLastPestTreatment, getLastSoilMoisture, getLastSoilPh,
  getPlantCondition, getSoilCondition, lastChecked
} from '../../../utils/plantData'
import Profile from '/imports/api/Profile/Profile';
import { toast } from 'react-toastify';
import SwipePanelContent from '../Shared/SwipePanelContent';
import ProfileViewEditModal from '../Shared/ProfileViewEditModal';

class ProfileViewEdit extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  newData: {},
	  swipeViewIndex: 0,
	  currentDateSelection: null,
	  modalOpen: null
	};

	autobind(this)
  }

  componentDidMount() {
	Session.set('pageTitle', this.props.profile.latinName);

	//this is to disable keyboard from popping up on android, sometimes you just need good ol vanilla js
	const inputs = document.getElementsByTagName('input');

	for (let i = 0; i < inputs.length; i++) {
	  inputs[i].disabled = true;
	}
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

  updateData(e, type) {

	const newProfileData = this.state.newData;

	if (type === "companions") {

	  const stripped = e.target.value.replace(/\s*,\s*/g, ",");
	  newProfileData[type] = stripped.split(',');

	} else if (type === "waterDate") {

	  if (newProfileData.waterTracker) {
		newProfileData.waterTracker.date = new Date(e);
	  } else {
		newProfileData.waterTracker = {
		  date: new Date(e)
		}
	  }

	} else if (type === "fertilizerDate") {

	  if (newProfileData.fertilizerTracker) {
		newProfileData.fertilizerTracker.date = new Date(e);
	  } else {
		newProfileData.fertilizerTracker = {
		  date: new Date(e)
		}
	  }

	} else if (type === "soilDate") {

	  if (newProfileData.soilCompositionTracker) {
		newProfileData.soilCompositionTracker.date = new Date(e);
	  } else {
		newProfileData.soilCompositionTracker = {
		  date: new Date(e)
		}
	  }

	} else if (type === "pestDate") {

	  if (newProfileData.pestTracker) {
		newProfileData.pestTracker.date = new Date(e);
	  } else {
		newProfileData.pestTracker = {
		  date: new Date(e)
		}
	  }

	} else if (type === "fertilizer") {

	  if (newProfileData.fertilizerTracker) {
		newProfileData.fertilizerTracker[type] = e.target.value;
	  } else {
		newProfileData.fertilizerTracker = {
		  [type]: e.target.value
		}
	  }

	} else if (type === "ph" || type === "moisture") {
	  let phVal = parseFloat(e.target.value);
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (newProfileData.soilCompositionTracker) {
		newProfileData.soilCompositionTracker[type] = type === "ph" ? phVal : moistureVal;
	  } else {
		newProfileData.soilCompositionTracker = {
		  [type]: type === "ph" ? phVal : moistureVal
		}
	  }

	} else if (type === "pest" || type === "treatment") {

	  if (newProfileData.pestTracker) {
		newProfileData.pestTracker[type] = e.target.value;
	  } else {
		newProfileData.pestTracker = {
		  [type]: e.target.value
		}
	  }

	} else if (type === "dateBought") {
	  newProfileData[type] = new Date(e);
	} else {
	  newProfileData[type] = e.target.value;
	}

	this.setState({
	  newData: newProfileData
	});
  }

  updateProfile(type) {

	const newProfileData = this.state.newData;
	const oldProfileData = this.props.profile;
	let data;

	if (type === "water") {
	  data = {
		waterPreference: newProfileData.waterPreference || oldProfileData.waterPreference,
		lightPreference: newProfileData.lightPreference || oldProfileData.lightPreference,
		waterTracker: newProfileData.waterTracker
	  }
	} else if (type === "fertilizer") {
	  data = {
		fertilizerTracker: newProfileData.fertilizerTracker
	  }
	} else if (type === "soil composition") {
	  data = {
		soilCompositionTracker: newProfileData.soilCompositionTracker
	  }
	} else if (type === "pest") {
	  data = {
		pestTracker: newProfileData.pestTracker
	  }
	} else if (type === "notes") {
	  data = {
		notes: newProfileData.notes
	  }
	} else if (type === "etc") {
	  data = {
		location: newProfileData.location || oldProfileData.location,
		locationBought: newProfileData.locationBought || oldProfileData.locationBought,
		dateBought: newProfileData.dateBought || oldProfileData.dateBought,
		companions: newProfileData.companions || oldProfileData.companions
	  }
	}

	if (data) {
	  data._id = oldProfileData._id;

	  console.log("updating", type, "data is:", data);

	  Meteor.call('profile.update', type, data, (err, response) => {
		if (err) {
		  toast.error(err.message);
		} else {
		  toast.success("Successfully saved new entry.")

		  //reset the data
		  this.setState({
			modalOpen: false,
			newData: {}
		  })
		}
	  });
	} else {
	  toast.error("No data entered.")
	}
  }

  resetModal() {
	this.setState({
	  newData: {},
	  modalOpen: null
	})
  }

  openModal() {
	let modalOpen;

	switch (this.state.swipeViewIndex) {
	  case 0:
		modalOpen = "water";
		break;
	  case 1:
		modalOpen = "fertilizer";
		break;
	  case 2:
		modalOpen = "soil composition";
		break;
	  case 3:
		modalOpen = "pest";
		break;
	  case 4:
		modalOpen = "notes";
		break;
	  case 5:
		modalOpen = "etc";
		break;
	}

	this.setState({
	  modalOpen
	});
  }

  deleteProfile() {

	Meteor.call('profile.delete', this.props.profile._id, (err, response) => {
	  if (err) {
		toast.error(err.message);
	  } else {
		this.setState({
		  modalOpen: false
		})

		this.props.history.push('/catalogue');
	  }
	});

  }

  render() {
	const profile = this.props.profile;
	const fertilizerContent = profile.fertilizerTracker && profile.fertilizerTracker.length > 0 ? profile.fertilizerTracker[profile.fertilizerTracker.length-1].fertilizer : 'N/A';
	let soilCompLastChecked = lastChecked(profile.soilCompositionTracker);
	let soilPh = getLastSoilPh(profile.soilCompositionTracker);
	let soilMoisture = getLastSoilMoisture(profile.soilCompositionTracker);
	let pestLastChecked = lastChecked(profile.pestTracker);
	let pestName = getLastPestName(profile.pestTracker);
	let pestTreatment = getLastPestTreatment(profile.pestTracker);

	//TODO add ability to add more plant photos and view calendar with details for each view (ie fertilizerTracker with date and fertilizer used)

	return (
			<div className="ProfileViewEdit">
			  <img src={profile.image}
				   alt={profile.commonName}
				   title={profile.commonName}
				   className="hero-img" />


			  <SwipeableViews className="swipe-view"
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e})}>

				<div className="swipe-slide slide-one">

				  <p className="swipe-title title-ming">
					Water - Light <FontAwesomeIcon icon={profile.waterCondition === "needs-attn" ? faSadTear : profile.waterCondition === "neutral" ? faMeh : profile.waterCondition === "unsure" ? faQuestionCircle : faSmile}
												   className="plant-condition-icon"
												   title="water condition"
												   alt={profile.waterCondition === "needs-attn" ? "sad face with tear" : profile.waterCondition === "neutral" ? "neutral face" : profile.waterCondition === "unsure" ? "question mark" : "smiling face"} />
				  </p>

				  <SwipePanelContent icon={faCalendarAlt}>
					<p>Water every {profile.waterSchedule} days</p>
					<p>Due in {profile.waterSchedule - profile.daysSinceWatered} days</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faTint}>
					<p>{profile.waterPreference}</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faSun}>
					<p>{profile.lightPreference}</p>
				  </SwipePanelContent>

				</div>

				<div className="swipe-slide slide-two">
				  <p className="swipe-title title-ming">
					Fertilizer <FontAwesomeIcon icon={profile.fertilizerCondition === "needs-attn" ? faSadTear : profile.fertilizerCondition === "neutral" ? faMeh : faSmile}
												className="plant-condition-icon"
												title="fertilizer condition"
												alt={profile.fertilizerCondition === "needs-attn" ? "sad face with tear" : profile.fertilizerCondition === "neutral" ? "neutral face" : profile.fertilizerCondition === "unsure" ? "question mark" : "smiling face"} />
				  </p>

				  <SwipePanelContent icon={faCalendarAlt}>
					<p>Fertilize every {profile.fertilizerSchedule} days</p>
					<p>Due in {profile.fertilizerSchedule - profile.daysSinceFertilized} days</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faInfoCircle}>
					<p>{fertilizerContent}</p>
				  </SwipePanelContent>

				</div>

				<div className="swipe-slide slide-three">
				  <p className="swipe-title title-ming">
					Soil Composition <FontAwesomeIcon icon={profile.soilCondition === "needs-attn" ? faSadTear : profile.soilCondition === "neutral" ? faMeh : faSmile}
													  className="plant-condition-icon"
													  title="soil condition"
													  alt={profile.soilCondition === "needs-attn" ? "sad face with tear" : profile.soilCondition === "neutral" ? "neutral face" : profile.soilCondition === "unsure" ? "question mark" : "smiling face"} />
				  </p>

				  <SwipePanelContent icon={faCalendarAlt}>
					<p>Last checked {soilCompLastChecked}</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faInfoCircle}>
					<p>pH {soilPh}</p>
					<p>Moisture Level {soilMoisture}</p>
				  </SwipePanelContent>

				</div>

				<div className="swipe-slide slide-four">
				  <p className="swipe-title title-ming">Pests</p>

				  <SwipePanelContent icon={faCalendarAlt}>
					<p>Last checked {pestLastChecked}</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faBug}>
					<p>{pestName}</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faSprayCan}>
					<p>{pestTreatment}</p>
				  </SwipePanelContent>

				</div>

				<div className="swipe-slide slide-five">
				  <p className="swipe-title title-ming">Notes</p>

				  <SwipePanelContent icon={faInfoCircle}>
					<p>{profile.notes || 'N/A'}</p>
				  </SwipePanelContent>
				</div>


				<div className="swipe-slide slide-six">
				  <p className="swipe-title title-ming">Etc</p>

				  <SwipePanelContent icon={faMapMarker}>
					<p>{profile.locationBought || 'N/A'}</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faCalendarAlt}>
					<p>{profile.dateBought ? new Date(profile.dateBought).toLocaleDateString() : 'N/A'}</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faHome}>
					<p>{profile.location || 'N/A'}</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon={faUserFriends}>
					<p>{profile.companions && profile.companions.length > 0 ? profile.companions.join(", ") : 'N/A'}</p>
				  </SwipePanelContent>
				</div>
			  </SwipeableViews>

			  <div className="add-data flex-around">
				<FontAwesomeIcon icon={faTrash}
								 className="plant-condition-icon"
								 size='3x'
								 alt="trash"
								 title="delete"
								 onClick={() => this.setState({modalOpen: "delete"})}/>

				<FontAwesomeIcon icon={this.state.swipeViewIndex === 5 ? faPencilAlt : faPlus}
								 className="plant-condition-icon"
								 size='3x'
								 alt={this.state.swipeViewIndex === 5 ? "pencil" : "plus"}
								 title="edit"
								 onClick={this.openModal}/>

			  </div>


			  {/* water */}
			  <ProfileViewEditModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="water"
									header="New water entry">
				<DatePicker selected={this.state.newData.waterTracker ? this.state.newData.waterTracker.date : Date.now()}
							className="react-datepicker-wrapper"
							dateFormat="dd-MMMM-yyyy"
							popperPlacement="bottom"
							inline
							onSelect={(e) => this.updateData(e, 'waterDate')}
							highlightDates={ProfileViewEdit.getHighlightDates(profile.waterTracker)} />
			  </ProfileViewEditModal>


			  {/* fertilizer */}
			  <ProfileViewEditModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="fertilizer"
									header="New fertilizer entry">

				<DatePicker selected={this.state.newData.fertilizerTracker ? this.state.newData.fertilizerTracker.date : Date.now()}
							className="react-datepicker-wrapper"
							dateFormat="dd-MMMM-yyyy"
							popperPlacement="bottom"
							inline
							onSelect={(e) => this.updateData(e, 'fertilizerDate')}
							highlightDates={ProfileViewEdit.getHighlightDates(profile.fertilizerTracker, 'fertilizer')} />

				<input type="text"
					   placeholder="Fertilizer"
					   onChange={(e) => this.updateData(e, 'fertilizer')} />
			  </ProfileViewEditModal>


			  {/* soil comp */}
			  <ProfileViewEditModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="soil composition"
									header="New soil composition entry">

				<DatePicker selected={this.state.newData.soilCompositionTracker ? this.state.newData.soilCompositionTracker.date : Date.now()}
							className="react-datepicker-wrapper"
							dateFormat="dd-MMMM-yyyy"
							popperPlacement="bottom"
							inline
							onSelect={(e) => this.updateData(e, 'soilDate')}
							highlightDates={ProfileViewEdit.getHighlightDates(profile.soilCompositionTracker)} />

				<input type="number"
					   placeholder="pH Reading"
					   onChange={(e) => this.updateData(e, 'ph')}/>

				<input type="number"
					   placeholder="Soil Moisture %"
					   onChange={(e) => this.updateData(e, 'moisture')}/>
			  </ProfileViewEditModal>


			  {/* pests */}
			  <ProfileViewEditModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="pest"
									header="New pest entry">

				<DatePicker selected={this.state.newData.pestTracker ? this.state.newData.pestTracker.date : Date.now()}
							className="react-datepicker-wrapper"
							dateFormat="dd-MMMM-yyyy"
							popperPlacement="bottom"
							inline
							onSelect={(e) => this.updateData(e, 'pestDate')}
							highlightDates={ProfileViewEdit.getHighlightDates(profile.pestTracker)} />

				<input type="text"
					   placeholder="Pest"
					   onChange={(e) => this.updateData(e, 'pest')}/>

				<input type="text"
					   placeholder="Treatment Method"
					   onChange={(e) => this.updateData(e, 'treatment')}/>
			  </ProfileViewEditModal>


			  {/* notes */}
			  <ProfileViewEditModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="notes"
									header="Edit notes">

			  <textarea rows="3"
						placeholder="Notes"
						onChange={(e) => this.updateData(e, 'notes')}
						defaultValue={profile.notes}/>
			  </ProfileViewEditModal>


			  {/* the rest */}
			  <ProfileViewEditModal save={this.updateProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="etc"
									header="Edit other details">

				<input type="text"
					   placeholder="Location Bought"
					   onChange={(e) => this.updateData(e, 'locationBought')}
					   defaultValue={profile.locationBought} />

				<DatePicker selected={this.state.newData.dateBought || Date.now()}
							className="react-datepicker-wrapper"
							dateFormat="dd-MMMM-yyyy"
							popperPlacement="bottom"
							onSelect={(e) => this.updateData(e, 'dateBought')}
							highlightDates={ProfileViewEdit.getHighlightDates(profile.dateBought, 'dateBought')} />

				<input type="text"
					   placeholder="Location In Home"
					   onChange={(e) => this.updateData(e, 'location')}
					   defaultValue={profile.location} />

				<input type="text"
					   placeholder="Companions"
					   onChange={(e) => this.updateData(e, 'companions')}
					   defaultValue={profile.companions ? profile.companions.join(", ") : null} />
			  </ProfileViewEditModal>


			  <ProfileViewEditModal save={this.deleteProfile}
									cancel={this.resetModal}
									show={this.state.modalOpen}
									type="delete"
									header="Are you sure you want to delete this profile?">

			  </ProfileViewEditModal>
			</div>
	);
  }
}

ProfileViewEdit.propTypes = {
  profile: PropTypes.object.isRequired
};

export default withTracker((props) => {
  const id = props.match.params.id;
  const profile = Profile.findOne({_id: id});

  profile.daysSinceFertilized = getDaysSinceAction(profile.fertilizerTracker);
  profile.fertilizerCondition = getPlantCondition(profile.fertilizerTracker, profile.daysSinceFertilized, profile.fertilizerSchedule);

  profile.daysSinceWatered = getDaysSinceAction(profile.waterTracker);
  profile.waterCondition = getPlantCondition(profile.waterTracker, profile.daysSinceWatered, profile.waterSchedule);

  profile.soilCondition = getSoilCondition(profile.soilCompositionTracker);

  return {
	profile: profile
  };
})(ProfileViewEdit);

