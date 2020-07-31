import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'


const WaterPro = (props) => (
		<div className="swipe-slide">

		  <p className="swipe-title title-ming">
			Water - Light
			{/*<FontAwesomeIcon
				  icon={props.item.waterCondition === 'needs-attn' ? faSadTear : props.item.waterCondition === 'neutral' ? faMeh : props.item.waterCondition === 'unsure' ? faQuestionCircle : faSmile}
				  className="plant-condition-icon"
				  title="water condition"
				  alt={props.item.waterCondition === 'needs-attn' ? 'sad face with tear' : props.item.waterCondition === 'neutral' ? 'neutral face' : props.item.waterCondition === 'unsure' ? 'question mark' : 'smiling face'}/>*/}
		  </p>

		  {props.editing === 'waterTracker' ?
				  <React.Fragment>
					<SwipePanelContent icon="schedule"
									   iconTitle="water schedule">
					  <p className="modern-input">
						Water every <input type="number"
										   min="0"
										   inputMode="numeric"
										   pattern="[0-9]*"
										   className="small"
										   onChange={(e) => props.updateData(e, 'waterSchedule')}
										   defaultValue={props.item.waterSchedule || ''}/> days</p>
					</SwipePanelContent>

					<SwipePanelContent icon="waterAuto"
									   iconTitle="automatic water schedule">
					  <p>
						<label>
						  <input type="checkbox"
								 className="small-checkbox"
								 onChange={(e) => props.updateData(e, 'waterScheduleAuto')}
								 defaultChecked={props.item.waterScheduleAuto || false}/>
						  Automatic watering
						</label>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="water">
					  <p className="modern-input">
						<label>watering preferences</label>
						<input type="text"
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
									   iconTitle="water schedule"
									   additionalOuterClasses={!props.item.waterScheduleAuto ? 'top-align' : ''}>
					  <p>{props.item.waterSchedule != null ? `Water every ${props.item.waterSchedule} days` : 'No schedule set'}</p>
					  {!props.item.waterScheduleAuto && props.item.waterSchedule != null && props.item.daysSinceWatered != null ?
					  <p>Due in {props.item.waterSchedule - props.item.daysSinceWatered - 1} days</p>
							  : ''
					  }
					</SwipePanelContent>

					{props.item.waterScheduleAuto &&
					<SwipePanelContent icon="waterAuto"
									   iconTitle="automatic water schedule">
					  <p>Watering is automated</p>
					</SwipePanelContent>
					}

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



WaterPro.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.string
};

export default WaterPro;
