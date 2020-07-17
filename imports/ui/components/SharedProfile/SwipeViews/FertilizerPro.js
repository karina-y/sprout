import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSadTear } from '@fortawesome/free-solid-svg-icons/faSadTear'
import { faMeh } from '@fortawesome/free-solid-svg-icons/faMeh'
import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile'
import SwipePanelContent from '../../Shared/SwipePanelContent'


const FertilizerPro = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Fertilizer - Nutrients <FontAwesomeIcon
				  icon={props.profile.fertilizerCondition === 'needs-attn' ? faSadTear : props.profile.fertilizerCondition === 'neutral' ? faMeh : faSmile}
				  className="plant-condition-icon"
				  title="fertilizer condition"
				  alt={props.profile.fertilizerCondition === 'needs-attn' ? 'sad face with tear' : props.profile.fertilizerCondition === 'neutral' ? 'neutral face' : props.profile.fertilizerCondition === 'unsure' ? 'question mark' : 'smiling face'}/>
		  </p>

		  {props.editing === 'fertilizerTracker' ?
				  <React.Fragment>
					<SwipePanelContent icon="schedule"
									   iconTitle="fertilizer schedule">
					  <p className="modern-input">
						Feed every <input type="number"
										  placeholder="30"
										  className="small"
										  onChange={(e) => props.updateData(e, 'fertilizerSchedule')}
										  defaultValue={props.profile.fertilizerSchedule || ''}/> days
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="fertilizer">
					  <p className="modern-input">
						<label>preferred fertilizer</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'fertilizer')}
							   defaultValue={props.profile.fertilizer || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="compost">
					  <p className="modern-input">
						<label>compost</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'compost')}
							   defaultValue={props.profile.compost || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="nutrients">
					  <p className="modern-input">
						<label>other nutrient amendment</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'nutrient')}
							   defaultValue={props.profile.nutrient || ''}/></p>
					</SwipePanelContent>
				  </React.Fragment>
				  :
				  <React.Fragment>
					<SwipePanelContent icon="schedule"
									   iconTitle="fertilizer schedule"
									   additionalOuterClasses="top-align">
					  <p>Feed every {props.profile.fertilizerSchedule} days</p>
					  <p>Due in {props.profile.fertilizerSchedule - props.profile.daysSinceFertilized - 1} days</p>
					</SwipePanelContent>

					<React.Fragment>
					  {(props.profile.fertilizer || props.fertilizerContent) &&
					  <SwipePanelContent icon="fertilizer">
						<p>{props.profile.fertilizer || props.fertilizerContent}</p>
					  </SwipePanelContent>
					  }

					  {props.profile.compost &&
					  <SwipePanelContent icon="compost">
						<p>{props.profile.compost}</p>
					  </SwipePanelContent>
					  }

					  {props.profile.nutrient &&
					  <SwipePanelContent icon="nutrients">
						<p>{props.profile.nutrient}</p>
					  </SwipePanelContent>
					  }
					</React.Fragment>

				  </React.Fragment>
		  }

		</div>
)



FertilizerPro.propTypes = {
  profile: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string
};

export default FertilizerPro;
