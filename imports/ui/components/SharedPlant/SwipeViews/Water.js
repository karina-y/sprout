import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSadTear } from '@fortawesome/free-solid-svg-icons/faSadTear'
import { faMeh } from '@fortawesome/free-solid-svg-icons/faMeh'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle'
import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile'
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'


const Water = (props) => (
		<div className="swipe-slide">

		  <p className="swipe-title title-ming">
			Water - Light <FontAwesomeIcon
				  icon={props.plant.waterCondition === 'needs-attn' ? faSadTear : props.plant.waterCondition === 'neutral' ? faMeh : props.plant.waterCondition === 'unsure' ? faQuestionCircle : faSmile}
				  className="plant-condition-icon"
				  title="water condition"
				  alt={props.plant.waterCondition === 'needs-attn' ? 'sad face with tear' : props.plant.waterCondition === 'neutral' ? 'neutral face' : props.plant.waterCondition === 'unsure' ? 'question mark' : 'smiling face'}/>
		  </p>

		  {props.state.editing === 'waterTracker' ?
				  <React.Fragment>
					<SwipePanelContent icon="schedule"
									   iconTitle="water schedule">
					  <p className="modern-input">Water every <input type="number"
																	 placeholder="4"
																	 className="small"
																	 onChange={(e) => props.updateData(e, 'waterSchedule')}
																	 defaultValue={props.plant.waterSchedule || ''}/> days
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="water">
					  <p className="modern-input">
						<label>watering preferences</label>
						<input type="text" placeholder="Watering Preferences"
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
									   iconTitle="water schedule">
					  <p>{props.plant.waterSchedule != null ? `Water every ${props.plant.waterSchedule} days` : 'No schedule set'}</p>
					</SwipePanelContent>

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



Water.propTypes = {
  plant: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default Water;
