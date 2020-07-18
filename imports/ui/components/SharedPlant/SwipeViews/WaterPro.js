import React from 'react';
import PropTypes from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSadTear } from '@fortawesome/free-solid-svg-icons/faSadTear'
// import { faMeh } from '@fortawesome/free-solid-svg-icons/faMeh'
// import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle'
// import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile'
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'


const WaterPro = (props) => (
		<div className="swipe-slide">

		  <p className="swipe-title title-ming">
			Water - Light
			{/*<FontAwesomeIcon
				  icon={props.plant.waterCondition === 'needs-attn' ? faSadTear : props.plant.waterCondition === 'neutral' ? faMeh : props.plant.waterCondition === 'unsure' ? faQuestionCircle : faSmile}
				  className="plant-condition-icon"
				  title="water condition"
				  alt={props.plant.waterCondition === 'needs-attn' ? 'sad face with tear' : props.plant.waterCondition === 'neutral' ? 'neutral face' : props.plant.waterCondition === 'unsure' ? 'question mark' : 'smiling face'}/>*/}
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
										   defaultValue={props.plant.waterSchedule || ''}/> days</p>
					</SwipePanelContent>

					<SwipePanelContent icon="waterAuto"
									   iconTitle="automatic water schedule">
					  <p>
						<label>
						  <input type="checkbox"
								 className="small-checkbox"
								 onChange={(e) => props.updateData(e, 'waterScheduleAuto')}
								 defaultChecked={props.plant.waterScheduleAuto || false}/>

						  Automatic watering
						</label>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="water">
					  <p className="modern-input">
						<label>watering preferences</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'waterPreference')}
							   defaultValue={props.plant.waterPreference || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="lightPreference">
					  <p className="modern-input">
						<label>light preferences</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'lightPreference')}
							   defaultValue={props.plant.lightPreference || ''}/></p>
					</SwipePanelContent>
				  </React.Fragment>
				  :
				  <React.Fragment>
					<SwipePanelContent icon="schedule"
									   iconTitle="water schedule"
									   additionalOuterClasses={!props.plant.waterScheduleAuto ? 'top-align' : ''}>
					  <p>{props.plant.waterSchedule != null ? `Water every ${props.plant.waterSchedule} days` : 'No schedule set'}</p>
					  {!props.plant.waterScheduleAuto && props.plant.waterSchedule != null && rops.plant.daysSinceWatered != null ?
					  <p>Due in {props.plant.waterSchedule - props.plant.daysSinceWatered - 1} days</p>
							  : ''
					  }
					</SwipePanelContent>

					{props.plant.waterScheduleAuto &&
					<SwipePanelContent icon="waterAuto"
									   iconTitle="automatic water schedule">
					  <p>Watering is automated</p>
					</SwipePanelContent>
					}

					<SwipePanelContent icon="water"
									   iconTitle="water preference">
					  <p>{props.plant.waterPreference}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="lightPreference">
					  <p>{props.plant.lightPreference}</p>
					</SwipePanelContent>
				  </React.Fragment>
		  }

		</div>
)



WaterPro.propTypes = {
  plant: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.string
};

export default WaterPro;
