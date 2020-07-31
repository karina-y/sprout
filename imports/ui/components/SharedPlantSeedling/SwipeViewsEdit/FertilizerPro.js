import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'


const FertilizerPro = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Fertilizer - Nutrients
		  </p>

		  {props.editing === 'fertilizerTracker' ?
				  <React.Fragment>
					<SwipePanelContent icon="schedule"
									   iconTitle="fertilizer schedule">
					  <p className="modern-input">
						Feed every <input type="number"
										  min="0"
										  inputMode="numeric"
										  pattern="[0-9]*"
										  className="small"
										  onChange={(e) => props.updateData(e, 'fertilizerSchedule')}
										  defaultValue={props.item.fertilizerSchedule || ''}/> days
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="fertilizer">
					  <p className="modern-input">
						<label>preferred fertilizer</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'fertilizer')}
							   defaultValue={props.item.fertilizer || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="compost">
					  <p className="modern-input">
						<label>compost</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'compost')}
							   defaultValue={props.item.compost || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="nutrients">
					  <p className="modern-input">
						<label>other nutrient amendment</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'nutrient')}
							   defaultValue={props.item.nutrient || ''}/></p>
					</SwipePanelContent>
				  </React.Fragment>
				  :
				  <React.Fragment>

					<SwipePanelContent icon="schedule"
									   iconTitle="fertilizer schedule"
									   additionalOuterClasses="top-align">
					  <p>{props.item.fertilizerSchedule != null ? `Feed every ${props.item.fertilizerSchedule} days` : 'No schedule set'}</p>
					  {props.item.fertilizerSchedule != null && props.item.daysSinceFertilized != null ?
							  <p>Due in {props.item.fertilizerSchedule - props.item.daysSinceFertilized - 1} days</p>
							  : ''
					  }
					</SwipePanelContent>

					<React.Fragment>
					  {(props.item.fertilizer || props.fertilizerContent) &&
					  <SwipePanelContent icon="fertilizer">
						<p>{props.item.fertilizer || props.fertilizerContent}</p>
					  </SwipePanelContent>
					  }

					  {props.item.compost &&
					  <SwipePanelContent icon="compost">
						<p>{props.item.compost}</p>
					  </SwipePanelContent>
					  }

					  {props.item.nutrient &&
					  <SwipePanelContent icon="nutrients">
						<p>{props.item.nutrient}</p>
					  </SwipePanelContent>
					  }
					</React.Fragment>

				  </React.Fragment>
		  }

		</div>
)



FertilizerPro.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string
};

export default FertilizerPro;
