import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent';


const NotableDatesReadEdit = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Notable Dates
		  </p>

		  <SwipePanelContent icon="schedule">
			<p className="modern-input">
			  <label>start date</label>
			  <input type="date"
					 onBlur={(e) => props.updateData(e, 'startDate')}
					 defaultValue={props.seedling.startDate || ''}/></p>
		  </SwipePanelContent>

		  <SwipePanelContent icon="schedule">
			<p className="modern-input">
			  <label>sprout date</label>
			  <input type="date"
					 onBlur={(e) => props.updateData(e, 'sproutDate')}
					 defaultValue={props.seedling.sproutDate || ''}/></p>
		  </SwipePanelContent>

		  <SwipePanelContent icon="schedule">
			<p className="modern-input">
			  <label>true leaves date</label>
			  <input type="date"
					 onBlur={(e) => props.updateData(e, 'trueLeavesDate')}
					 defaultValue={props.seedling.trueLeavesDate || ''}/></p>
		  </SwipePanelContent>

		  <SwipePanelContent icon="schedule" iconTitle="days to germinate">
			<p className="modern-input">
			  <label>days to germinate (ie 7-14 days)</label>
			  <input type="text"
					 onChange={(e) => props.updateData(e, 'daysToGerminate')}
					 defaultValue={props.seedling.daysToGerminate || ''}/>
			</p>
		  </SwipePanelContent>

		  <SwipePanelContent icon="schedule">
			<p className="modern-input">
			  <label>transplant date</label>
			  <input type="date"
					 onBlur={(e) => props.updateData(e, 'transplantDate')}
					 defaultValue={props.seedling.transplantDate || ''}/></p>
		  </SwipePanelContent>

		  <SwipePanelContent icon="schedule" iconTitle="days to germinate">
			<p className="modern-input">
			  <label>days to harvest (ie 60-90 days)</label>
			  <input type="text"
					 onChange={(e) => props.updateData(e, 'daysToHarvest')}
					 defaultValue={props.seedling.daysToHarvest || ''}/>
			</p>
		  </SwipePanelContent>

		  <SwipePanelContent icon="schedule">
			<p className="modern-input">
			  <label>estimated harvest date</label>
			  <input type="date"
					 onBlur={(e) => props.updateData(e, 'estHarvestDate')}
					 defaultValue={props.seedling.estHarvestDate || ''}/></p>
		  </SwipePanelContent>

		  <SwipePanelContent icon="schedule">
			<p className="modern-input">
			  <label>actual harvest date</label>
			  <input type="date"
					 onBlur={(e) => props.updateData(e, 'actualHarvestDate')}
					 defaultValue={props.seedling.actualHarvestDate || ''}/></p>
		  </SwipePanelContent>

		  {/*<SwipePanelContent icon="schedule">
			<p className="modern-input">
			  <label>date seed expires</label>
			  <input type="date"
					 onBlur={(e) => props.updateData(e, 'dateExpires')}
					 defaultValue={props.seedling.dateExpires || ''}/></p>
		  </SwipePanelContent>*/}
		</div>
)



NotableDatesReadEdit.propTypes = {
  seedling: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.string
};

export default NotableDatesReadEdit;
