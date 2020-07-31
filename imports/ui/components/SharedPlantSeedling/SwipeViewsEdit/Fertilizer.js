import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'


const Fertilizer = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Fertilizer
		  </p>


		  <SwipePanelContent icon="schedule"
							 iconTitle="fertilizer schedule"
							 additionalOuterClasses={props.state.editing !== 'fertilizerTracker' ? 'top-align' : ''}>
			{props.editing === 'fertilizerTracker' ?
					<p className="modern-input">Fertilize every <input type="number"
																	   min="0"
																	   inputMode="numeric"
																	   pattern="[0-9]*"
																	   className="small"
																	   onChange={(e) => props.updateData(e, 'fertilizerSchedule')}
																	   defaultValue={props.item.fertilizerSchedule || ''}/> days
					</p>
					: props.item.fertilizerSchedule && props.item.daysSinceFertilized ?
							<React.Fragment>
							  <p>Fertilize every {props.item.fertilizerSchedule} days</p>
							  <p>Due in {props.item.fertilizerSchedule - props.item.daysSinceFertilized - 1} days</p>
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
							 defaultValue={props.item.fertilizer || ''}/></p>
				  </SwipePanelContent>
				  : (props.item.fertilizer || props.fertilizerContent) &&
				  <SwipePanelContent icon="fertilizer">
					<p>{props.item.fertilizer || props.fertilizerContent}</p>
				  </SwipePanelContent>
		  }

		</div>
)



Fertilizer.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string.isRequired,
};

export default Fertilizer;
