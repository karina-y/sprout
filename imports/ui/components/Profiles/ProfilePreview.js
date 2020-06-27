import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import "./ProfilePreview.scss";
import ShadowBox from '../ShadowBox/ShadowBox';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFish } from '@fortawesome/free-solid-svg-icons/faFish';
import { faTint } from '@fortawesome/free-solid-svg-icons/faTint';
import { getDaysSinceAction, getPlantCondition, getSoilCondition } from '../../../utils/plantData';


function ProfilePreview (props) {
  const profile = props.profile;
  const waterProgress = (profile.daysSinceWatered / profile.waterSchedule) > 1 ? 5 : ((1 - (profile.daysSinceWatered / profile.waterSchedule)) * 100) || 5;
  const fertilizerProgress = (profile.daysSinceFertilized / profile.fertilizerSchedule) > 1 ? 5 : ((1 - (profile.daysSinceFertilized / profile.fertilizerSchedule)) * 100) || 5;

  return (
		  <button onClick={() => props.history.push(`/catalogue/${props.profile._id}`)} className="ProfilePreview naked">
			<ShadowBox additionalOuterClasses={profile.condition}
					   hoverAction={false}
					   popoutHover={false}
					   shadowLevel={2}>
			  <img src={profile.image}
				   alt={profile.latinName}
				   title={profile.latinName} />

			  <div className="quick-details">
				<p>{profile.latinName}</p>

				<div style={{position: 'relative', padding: '10px 0'}}>
				  {/*<img className="plant-condition-icon" src="/images/icons/lovely-garden/watering-can.png" />*/}
				  <FontAwesomeIcon icon={faTint}
								   className="plant-condition-icon"
								   title="water level"
								   alt="water drop"/>
				  <ProgressBar now={waterProgress === 0 ? 5 : waterProgress} className={`water ${profile.waterCondition}`} />
				</div>

				<div style={{position: 'relative', padding: '10px 0'}}>
				  {/*<img className="plant-condition-icon" src="/images/icons/lovely-garden/fertilizer.png" />*/}
				  <FontAwesomeIcon icon={faFish}
								   className="plant-condition-icon"
								   title="fertilizer level"
								   alt="fish"/>
				  <ProgressBar now={fertilizerProgress} className={`fertilizer ${profile.fertilizerCondition}`} />
				</div>

			  </div>
			</ShadowBox>
		  </button>
  )
}


ProfilePreview.propTypes = {
  profile: PropTypes.object.isRequired
};

export default withTracker((props) => {
  let profile = props.profile;

  if (profile.fertilizerTracker && profile.fertilizerTracker.length > 0) {
	profile.daysSinceFertilized = getDaysSinceAction(profile.fertilizerTracker);
	profile.fertilizerCondition = getPlantCondition(profile.daysSinceFertilized, profile.fertilizerSchedule);
  }

  if (profile.waterTracker && profile.waterTracker.length > 0) {
	profile.daysSinceWatered = getDaysSinceAction(profile.waterTracker);
	profile.waterCondition = getPlantCondition(profile.daysSinceWatered, profile.waterSchedule);
  }

  if (profile.soilCompositionTracker && profile.soilCompositionTracker.length > 0) {
	profile.soilCondition = getSoilCondition(profile.soilCompositionTracker[profile.soilCompositionTracker.length-1])
  }


  return {
	profile: profile
  };
})(ProfilePreview);
