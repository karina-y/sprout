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
																	 placeholder="4"
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

					{props.type === "plant" ?
							<SwipePanelContent icon="lightPreference">
							  <p className="modern-input">
								<label>light preferences *</label>
								<input type="text"
									   onChange={(e) => props.updateData(e, 'lightPreference')}
									   defaultValue={props.item.lightPreference || ''}/></p>
							</SwipePanelContent>
							:
							<SwipePanelContent icon="lightPreference">
							  <p className="modern-input">
								<label>sun light or grow light *</label>
								<select onChange={(e) => props.updateData(e, 'lightPreference')}
										defaultValue={props.item.lightPreference || ''}>
								  <option value='' disabled={true}>- What lighting is being used? -</option>
								  <option value="grow light">Grow Light</option>
								  <option value="sun light">Sun Light</option>
								</select>
							  </p>
							</SwipePanelContent>
					}
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

					<SwipePanelContent icon="lightPreference">
					  <p>{props.item.lightPreference}</p>
					</SwipePanelContent>
				  </React.Fragment>
		  }

		</div>
)



Water.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default Water;
