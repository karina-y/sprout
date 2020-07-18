import React from 'react';
import PropTypes from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSadTear } from '@fortawesome/free-solid-svg-icons/faSadTear'
// import { faMeh } from '@fortawesome/free-solid-svg-icons/faMeh'
// import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle'
// import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile'
import SwipePanelContent from '../../Shared/SwipePanelContent'


const WaterPro = (props) => (
		<div className="swipe-slide">

		  <p className="swipe-title title-ming">
			Water - Light
			{/*<FontAwesomeIcon
				  icon={props.profile.waterCondition === 'needs-attn' ? faSadTear : props.profile.waterCondition === 'neutral' ? faMeh : props.profile.waterCondition === 'unsure' ? faQuestionCircle : faSmile}
				  className="plant-condition-icon"
				  title="water condition"
				  alt={props.profile.waterCondition === 'needs-attn' ? 'sad face with tear' : props.profile.waterCondition === 'neutral' ? 'neutral face' : props.profile.waterCondition === 'unsure' ? 'question mark' : 'smiling face'}/>*/}
		  </p>

		  {props.editing === 'waterTracker' ?
				  <React.Fragment>
					<SwipePanelContent icon="schedule"
									   iconTitle="water schedule">
					  <p className="modern-input">
						Water every <input type="number"
										   placeholder="4"
										   className="small"
										   onChange={(e) => props.updateData(e, 'waterSchedule')}
										   defaultValue={props.profile.waterSchedule || ''}/> days</p>
					</SwipePanelContent>

					<SwipePanelContent icon="waterAuto"
									   iconTitle="automatic water schedule">
					  <p>
						<label>
						  <input type="checkbox"
								 className="small-checkbox"
								 onChange={(e) => props.updateData(e, 'waterScheduleAuto')}
								 defaultChecked={props.profile.waterScheduleAuto || false}/>

						  Automatic watering
						</label>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="water">
					  <p className="modern-input">
						<label>watering preferences</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'waterPreference')}
							   defaultValue={props.profile.waterPreference || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="lightPreference">
					  <p className="modern-input">
						<label>light preferences</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'lightPreference')}
							   defaultValue={props.profile.lightPreference || ''}/></p>
					</SwipePanelContent>
				  </React.Fragment>
				  :
				  <React.Fragment>
					<SwipePanelContent icon="schedule"
									   iconTitle="water schedule"
									   additionalOuterClasses={!props.profile.waterScheduleAuto ? 'top-align' : ''}>
					  <p>Water every {props.profile.waterSchedule} days</p>
					  {!props.profile.waterScheduleAuto &&
					  <p>Due in {props.profile.waterSchedule - props.profile.daysSinceWatered - 1} days</p>
					  }
					</SwipePanelContent>

					{props.profile.waterScheduleAuto &&
					<SwipePanelContent icon="waterAuto"
									   iconTitle="automatic water schedule">
					  <p>Watering is automated</p>
					</SwipePanelContent>
					}

					<SwipePanelContent icon="water"
									   iconTitle="water preference">
					  <p>{props.profile.waterPreference}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="lightPreference">
					  <p>{props.profile.lightPreference}</p>
					</SwipePanelContent>
				  </React.Fragment>
		  }

		</div>
)



WaterPro.propTypes = {
  profile: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.string
};

export default WaterPro;
