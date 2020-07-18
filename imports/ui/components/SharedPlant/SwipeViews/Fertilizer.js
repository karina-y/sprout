import React from 'react';
import PropTypes from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSadTear } from '@fortawesome/free-solid-svg-icons/faSadTear'
// import { faMeh } from '@fortawesome/free-solid-svg-icons/faMeh'
// import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile'
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'


const Fertilizer = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Fertilizer
			{/*<FontAwesomeIcon
				  icon={props.plant.fertilizerCondition === 'needs-attn' ? faSadTear : props.plant.fertilizerCondition === 'neutral' ? faMeh : faSmile}
				  className="plant-condition-icon"
				  title="fertilizer condition"
				  alt={props.plant.fertilizerCondition === 'needs-attn' ? 'sad face with tear' : props.plant.fertilizerCondition === 'neutral' ? 'neutral face' : props.plant.fertilizerCondition === 'unsure' ? 'question mark' : 'smiling face'}/>*/}
		  </p>


		  <SwipePanelContent icon="schedule"
							 iconTitle="fertilizer schedule"
							 additionalOuterClasses={props.state.editing !== 'fertilizerTracker' ? 'top-align' : ''}>
			{props.editing === 'fertilizerTracker' ?
					<p className="modern-input">Fertilize every <input type="number"
																	   placeholder="30"
																	   className="small"
																	   onChange={(e) => props.updateData(e, 'fertilizerSchedule')}
																	   defaultValue={props.plant.fertilizerSchedule || ''}/> days
					</p>
					: props.plant.fertilizerSchedule ?
							<React.Fragment>
							  <p>Fertilize every {props.plant.fertilizerSchedule} days</p>
							  <p>Due in {props.plant.fertilizerSchedule - props.plant.daysSinceFertilized - 1} days</p>
							</React.Fragment>
							:
							<p>No schedule set</p>
			}
		  </SwipePanelContent>

		  {props.editing === 'fertilizerTracker' ?
				  <SwipePanelContent icon="fertilizer">
					<p className="modern-input">
					  <label>preferred fertilizer</label>
					  <input type="text"
							 onChange={(e) => props.updateData(e, 'fertilizer')}
							 defaultValue={props.plant.fertilizer || ''}/></p>
				  </SwipePanelContent>
				  : (props.plant.fertilizer || props.fertilizerContent) &&
				  <SwipePanelContent icon="fertilizer">
					<p>{props.plant.fertilizer || props.fertilizerContent}</p>
				  </SwipePanelContent>
		  }

		</div>
)



Fertilizer.propTypes = {
  plant: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string.isRequired,
};

export default Fertilizer;
