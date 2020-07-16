import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import "./ProfilePreview.scss";
import ShadowBox from '../ShadowBox/ShadowBox';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { getDaysSinceAction, getPlantCondition } from '../../../utils/plantData';
import IconList from '../../../utils/iconList'
import { ReactSVG } from 'react-svg'


function ProfilePreview (props) {
  const profile = props.profile;

  return (
		  <button onClick={() => props.history.push(`/catalogue/${props.profile._id}`)} className="ProfilePreview naked">
			<ShadowBox additionalOuterClasses={profile.condition}
					   hoverAction={false}
					   popoutHover={false}
					   shadowLevel={2}>
			  <img src={profile.image}
				   alt={profile.latinName || profile.commonName}
				   title={profile.latinName || profile.commonName} />

			  <div className="quick-details">
				<p>{profile.latinName || profile.commonName}</p>

				<div>
				  <ReactSVG src={IconList.water.icon}
							className="plant-condition-icon"
							alt={IconList.water.alt}
							title={IconList.water.title}/>

				  <ProgressBar now={profile.waterProgress === 0 ? 5 : profile.waterProgress}
							   className={`water ${profile.waterCondition}`} />
				</div>

				<div>
				  <ReactSVG src={IconList.fertilizer.icon}
							className="plant-condition-icon fertilizer"
							alt={IconList.fertilizer.alt}
							title={IconList.fertilizer.title}/>
				  <ProgressBar now={profile.fertilizerProgress === 0 ? 5 : profile.fertilizerProgress}
							   className={`fertilizer ${profile.fertilizerCondition}`} />
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

  //TODO turn these into a hook
  if (profile.fertilizerTracker && profile.fertilizerTracker.length > 0) {
	profile.daysSinceFertilized = getDaysSinceAction(profile.fertilizerTracker);
	profile.fertilizerCondition = getPlantCondition(profile.fertilizerTracker, profile.daysSinceFertilized, profile.fertilizerSchedule)
	profile.fertilizerProgress = (profile.daysSinceFertilized / profile.fertilizerSchedule) > 1 ? 5 : ((1 - (profile.daysSinceFertilized / profile.fertilizerSchedule)) * 100) || 5;
  } else {
	profile.fertilizerCondition = "happy";
	profile.fertilizerProgress = 100;
  }

  if (profile.waterTracker && profile.waterTracker.length > 0) {
	profile.daysSinceWatered = getDaysSinceAction(profile.waterTracker);
	profile.waterCondition = profile.waterScheduleAuto ? "happy" : getPlantCondition(profile.waterTracker, profile.daysSinceWatered, profile.waterSchedule)
	profile.waterProgress = profile.waterScheduleAuto ? 100 : (profile.daysSinceWatered / profile.waterSchedule) > 1 ? 5 : ((1 - (profile.daysSinceWatered / profile.waterSchedule)) * 100) || 5;
  } else {
	profile.waterCondition = "happy";
	profile.waterProgress = 100;
  }


  return {
	profile
  };
})(ProfilePreview);
