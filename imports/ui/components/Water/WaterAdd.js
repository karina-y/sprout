import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent'


const WaterAdd = (props) => (
		<div className="swipe-slide">

		  <p className="swipe-title title-ming">
			Water
		  </p>


		  <SwipePanelContent icon="schedule" iconTitle="watering schedule">
			<p className="modern-input">Water every <input type="number"
														   min="0"
														   inputMode="numeric"
														   pattern="[0-9]*"
														   className="small"
														   onChange={(e) => props.updateData(e, 'waterSchedule')}
														   value={props.item.waterSchedule || ''}/> days</p>
		  </SwipePanelContent>

		  <SwipePanelContent icon="water">
			<p className="modern-input">
			  <label>watering preferences *</label>
			  <input type="text"
					 onChange={(e) => props.updateData(e, 'waterPreference')}
					 value={props.item.waterPreference || ''}/></p>
		  </SwipePanelContent>

		</div>
)



WaterAdd.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default WaterAdd;
