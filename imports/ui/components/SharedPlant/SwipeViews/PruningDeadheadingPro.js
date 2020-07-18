import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'


const PruningDeadheadingPro = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Pruning - Deadheading
		  </p>

		  {props.editing === 'pruningDeadheadingTracker' ?
				  <React.Fragment>
					<SwipePanelContent icon="pruning" iconTitle="pruning schedule">
					  <p className="modern-input">
						Prune every <input type="number"
										   placeholder="30"
										   className="small"
										   onChange={(e) => props.updateData(e, 'pruningSchedule')}/> days
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="deadheading" iconTitle="deadheading schedule">
					  <p className="modern-input">
						Deadhead every <input type="number"
											  placeholder="30"
											  className="small"
											  onChange={(e) => props.updateData(e, 'deadheadingSchedule')}/> days
					  </p>
					</SwipePanelContent>

				  </React.Fragment>
				  :
				  <React.Fragment>
					<SwipePanelContent icon="pruning"
									   iconTitle="pruning schedule"
									   additionalOuterClasses="top-align">
					  <p>{props.plant.pruningSchedule ? `Prune every ${props.plant.pruningSchedule} days` : 'No pruning schedule entered'}</p>
					  {props.plant.pruningSchedule &&
					  <p>Due in {props.plant.pruningSchedule - props.plant.daysSincePruned - 1} days</p>}
					</SwipePanelContent>

					<SwipePanelContent icon="deadheading"
									   iconTitle="deadheading schedule"
									   additionalOuterClasses="top-align">
					  <p>{props.plant.deadheadingSchedule ? `Deadhead every ${props.plant.deadheadingSchedule} days` : 'No deadheading schedule entered'}</p>
					  {props.plant.deadheadingSchedule &&
					  <p>Due in {props.plant.deadheadingSchedule - props.plant.daysSinceDeadheaded - 1} days</p>}
					</SwipePanelContent>
				  </React.Fragment>
		  }


		</div>
  )



PruningDeadheadingPro.propTypes = {
  plant: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string
};

export default PruningDeadheadingPro;
