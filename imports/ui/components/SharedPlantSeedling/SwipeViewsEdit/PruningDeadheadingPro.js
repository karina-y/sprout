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
					{/*<SwipePanelContent icon="pruning" iconTitle="pruning schedule">
					  <p className="modern-input">
						Prune every <input type="number"
										   min="0"
										   inputMode="numeric"
										   pattern="[0-9]*"
										   className="small"
										   onChange={(e) => props.updateData(e, 'pruningSchedule')}
										   value={props.plant.pruningSchedule || ''}/> days
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="deadheading" iconTitle="deadheading schedule">
					  <p className="modern-input">
						Deadhead every <input type="number"
											  min="0"
											  inputMode="numeric"
											  pattern="[0-9]*"
											  className="small"
											  onChange={(e) => props.updateData(e, 'deadheadingSchedule')}
											  value={props.plant.deadheadingSchedule || ''}/> days
					  </p>
					</SwipePanelContent>*/}

					<SwipePanelContent icon="pruning" iconTitle="pruning preference">
					  <p className="modern-input">
						<input type="text"
							   onChange={(e) => props.updateData(e, 'pruningPreference')}
							   defaultValue={props.plant.pruningPreference || ''}/>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="deadheading" iconTitle="deadheading preference">
					  <p className="modern-input">
						<input type="text"
							   onChange={(e) => props.updateData(e, 'deadheadingPreference')}
							   defaultValue={props.plant.deadheadingPreference || ''}/>
					  </p>
					</SwipePanelContent>

				  </React.Fragment>
				  :
				  <React.Fragment>
					{/*<SwipePanelContent icon="pruning"
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
					</SwipePanelContent>*/}

					<SwipePanelContent icon="pruning"
									   iconTitle="pruning preference">
					  <p>{props.plant.pruningPreference ? `${props.plant.pruningPreference}` : 'No pruning preference entered'}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="deadheading"
									   iconTitle="deadheading preference">
					  <p>{props.plant.deadheadingPreference ? `${props.plant.deadheadingPreference}` : 'No deadheading preference entered'}</p>
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
