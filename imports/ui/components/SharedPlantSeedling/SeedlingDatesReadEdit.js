import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent'
import { withTracker } from 'meteor/react-meteor-data'
import Category from '../../../api/Category/Category'
import { parseDate } from '../../../utils/helpers/plantData'


const SeedlingDatesReadEdit = (props) => (
		<div className="swipe-slide adjust-icons">

		  <p className="swipe-title title-ming">
			Dates
		  </p>

		  {/*TODO - this format: {props.editing === UpdateTypes.water.waterEditModal ?*/}
		  {props.editing === 'dates' ?
				  <React.Fragment>

					<SwipePanelContent icon="sowDate">
					  <p className="modern-input">
						<label>sow date</label>
						<input type="date"
							   onBlur={(e) => props.updateData(e, 'sowDate')}
							   defaultValue={props.seedling.sowDate ? new Date(props.seedling.sowDate).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="sprout date">
					  <p className="modern-input">
						<label>sprout date</label>
						<input type="date"
							   onBlur={(e) => props.updateData(e, 'sproutDate')}
							   defaultValue={props.seedling.sproutDate ? new Date(props.seedling.sproutDate).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="trueLeavesDate">
					  <p className="modern-input">
						<label>true leaves date</label>
						<input type="date"
							   onBlur={(e) => props.updateData(e, 'trueLeavesDate')}
							   defaultValue={props.seedling.trueLeavesDate ? new Date(props.seedling.trueLeavesDate).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="info">
					  <p className="modern-input">
						<label>days to germinate (ie 7-14 days)</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'daysToGerminate')}
							   defaultValue={props.seedling.daysToGerminate || ''}/>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="days to germinate">
					  <p className="modern-input">
						<label>days to harvest (ie 60-90 days)</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'daysToHarvest')}
							   defaultValue={props.seedling.daysToHarvest || ''}/>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="estimated harvest date">
					  <p className="modern-input">
						<label>estimated harvest date</label>
						<input type="date"
							   onBlur={(e) => props.updateData(e, 'estHarvestDate')}
							   defaultValue={props.seedling.estHarvestDate ? new Date(props.seedling.estHarvestDate).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="actual harvest date">
					  <p className="modern-input">
						<label>actual harvest date</label>
						<input type="date"
							   onBlur={(e) => props.updateData(e, 'actualHarvestDate')}
							   defaultValue={props.seedling.actualHarvestDate ? new Date(props.seedling.actualHarvestDate).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>
					</SwipePanelContent>

				  </React.Fragment>
				  :
				  <React.Fragment>

					<SwipePanelContent icon="sowDate">
					  <small>sow date</small>
					  <p>{parseDate(props.seedling.sowDate)}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="sprout date">
					  <small>sprout date</small>
					  <p>{parseDate(props.seedling.sproutDate)}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="trueLeavesDate">
					  <small>true leaves date</small>
					  <p>{parseDate(props.seedling.trueLeavesDate)}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="days to germinate">
					  <small>days to germinate</small>
					  <p>{props.seedling.daysToGerminate || 'N/A'}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="transplant date">
					  <small>transplant date</small>
					  <p>{parseDate(props.seedling.transplantDate)}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="days to harvest">
					  <small>days to harvest</small>
					  <p>{props.seedling.daysToHarvest || 'N/A'}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="estimated harvest date">
					  <small>estimated harvest date</small>
					  <p>{parseDate(props.seedling.estHarvestDate)}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="actual harvest date">
					  <small>actual harvest date</small>
					  <p>{parseDate(props.seedling.actualHarvestDate)}</p>
					</SwipePanelContent>

				  </React.Fragment>
		  }
		</div>
)



SeedlingDatesReadEdit.propTypes = {
  seedling: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.string,
  categories: PropTypes.array.isRequired
};

export default withTracker((props) => {
  const categories = Category.find({}).fetch()

  return {
	categories
  }
})(SeedlingDatesReadEdit)
