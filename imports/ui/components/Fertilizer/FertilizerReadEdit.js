import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent'
import UpdateTypes from '../../../utils/constants/updateTypes'


const FertilizerReadEdit = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Fertilizer
		  </p>


		  <SwipePanelContent icon="schedule"
							 iconTitle="fertilizer schedule"
							 additionalOuterClasses={props.state.editing !== 'fertilizerTracker' ? 'top-align' : ''}>

			{props.editing === UpdateTypes.fertilizer.fertilizerEditModal ?
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

		  {props.editing === UpdateTypes.fertilizer.fertilizerEditModal ?
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



FertilizerReadEdit.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string.isRequired,
};

export default FertilizerReadEdit;
