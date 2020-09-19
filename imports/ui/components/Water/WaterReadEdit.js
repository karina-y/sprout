import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSadTear } from '@fortawesome/free-solid-svg-icons/faSadTear'
import { faMeh } from '@fortawesome/free-solid-svg-icons/faMeh'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle'
import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile'
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent'


const WaterReadEdit = (props) => (
		<div className="swipe-slide">

		  <p className="swipe-title title-ming">
			Water <FontAwesomeIcon
				  icon={props.item.waterCondition === 'needs-attn' ? faSadTear : props.item.waterCondition === 'neutral' ? faMeh : props.item.waterCondition === 'unsure' ? faQuestionCircle : faSmile}
				  className="plant-condition-icon"
				  title="water condition"
				  alt={props.item.waterCondition === 'needs-attn' ? 'sad face with tear' : props.item.waterCondition === 'neutral' ? 'neutral face' : props.item.waterCondition === 'unsure' ? 'question mark' : 'smiling face'}/>
		  </p>

		  {props.state.editing === 'waterTracker' ?
				  <React.Fragment>
					<SwipePanelContent icon="schedule"
									   iconTitle="water schedule">
					  <p className="modern-input">Water every <input type="number"
																	 min="0"
																	 inputMode="numeric"
																	 pattern="[0-9]*"
																	 className="small"
																	 onChange={(e) => props.updateData(e, 'waterSchedule')}
																	 defaultValue={props.item.waterSchedule || ''}/> days
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="water">
					  <p className="modern-input">
						<label>watering preferences</label>
						<input type="text" placeholder="Watering Preferences"
							   onChange={(e) => props.updateData(e, 'waterPreference')}
							   defaultValue={props.item.waterPreference || ''}/></p>
					</SwipePanelContent>

				  </React.Fragment>
				  :
				  <React.Fragment>
					<SwipePanelContent icon="schedule"
									   iconTitle="water schedule">
					  <p>{props.item.waterSchedule != null ? `Water every ${props.item.waterSchedule} days` : 'No schedule set'}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="water"
									   iconTitle="water preference">
					  <p>{props.item.waterPreference}</p>
					</SwipePanelContent>
				  </React.Fragment>
		  }

		</div>
)



WaterReadEdit.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default WaterReadEdit;
