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
  const waterProgress = profile.waterScheduleAuto ? 100 : (profile.daysSinceWatered / profile.waterSchedule) > 1 ? 5 : ((1 - (profile.daysSinceWatered / profile.waterSchedule)) * 100) || 5;
  const fertilizerProgress = (profile.daysSinceFertilized / profile.fertilizerSchedule) > 1 ? 5 : ((1 - (profile.daysSinceFertilized / profile.fertilizerSchedule)) * 100) || 5;

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

				  <ProgressBar now={waterProgress === 0 ? 5 : waterProgress}
							   className={`water ${profile.waterCondition}`} />
				</div>

				<div>
				  <ReactSVG src={IconList.fertilizer.icon}
							className="plant-condition-icon fertilizer"
							alt={IconList.fertilizer.alt}
							title={IconList.fertilizer.title}/>
				  <ProgressBar now={fertilizerProgress}
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
  }

  if (profile.waterTracker && profile.waterTracker.length > 0) {
	profile.daysSinceWatered = getDaysSinceAction(profile.waterTracker);
	profile.waterCondition = getPlantCondition(profile.waterTracker, profile.daysSinceWatered, profile.waterSchedule)
  }


  return {
	profile: profile
  };
})(ProfilePreview);
