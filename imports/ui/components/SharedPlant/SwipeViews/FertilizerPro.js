import React from 'react';
import PropTypes from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSadTear } from '@fortawesome/free-solid-svg-icons/faSadTear'
// import { faMeh } from '@fortawesome/free-solid-svg-icons/faMeh'
// import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile'
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'


const FertilizerPro = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Fertilizer - Nutrients
			{/*<FontAwesomeIcon
				  icon={props.plant.fertilizerCondition === 'needs-attn' ? faSadTear : props.plant.fertilizerCondition === 'neutral' ? faMeh : faSmile}
				  className="plant-condition-icon"
				  title="fertilizer condition"
				  alt={props.plant.fertilizerCondition === 'needs-attn' ? 'sad face with tear' : props.plant.fertilizerCondition === 'neutral' ? 'neutral face' : props.plant.fertilizerCondition === 'unsure' ? 'question mark' : 'smiling face'}/>*/}
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
										  defaultValue={props.plant.fertilizerSchedule || ''}/> days
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="fertilizer">
					  <p className="modern-input">
						<label>preferred fertilizer</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'fertilizer')}
							   defaultValue={props.plant.fertilizer || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="compost">
					  <p className="modern-input">
						<label>compost</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'compost')}
							   defaultValue={props.plant.compost || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="nutrients">
					  <p className="modern-input">
						<label>other nutrient amendment</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'nutrient')}
							   defaultValue={props.plant.nutrient || ''}/></p>
					</SwipePanelContent>
				  </React.Fragment>
				  :
				  <React.Fragment>

					<SwipePanelContent icon="schedule"
									   iconTitle="fertilizer schedule"
									   additionalOuterClasses="top-align">
					  <p>{props.plant.fertilizerSchedule != null ? `Feed every ${props.plant.fertilizerSchedule} days` : 'No schedule set'}</p>
					  {!props.plant.waterScheduleAuto && props.plant.fertilizerSchedule != null && props.plant.daysSinceFertilized != null ?
							  <p>Due in {props.plant.fertilizerSchedule - props.plant.daysSinceFertilized - 1} days</p>
							  : ''
					  }
					</SwipePanelContent>

					<React.Fragment>
					  {(props.plant.fertilizer || props.fertilizerContent) &&
					  <SwipePanelContent icon="fertilizer">
						<p>{props.plant.fertilizer || props.fertilizerContent}</p>
					  </SwipePanelContent>
					  }

					  {props.plant.compost &&
					  <SwipePanelContent icon="compost">
						<p>{props.plant.compost}</p>
					  </SwipePanelContent>
					  }

					  {props.plant.nutrient &&
					  <SwipePanelContent icon="nutrients">
						<p>{props.plant.nutrient}</p>
					  </SwipePanelContent>
					  }
					</React.Fragment>

				  </React.Fragment>
		  }

		</div>
)



FertilizerPro.propTypes = {
  plant: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string
};

export default FertilizerPro;
