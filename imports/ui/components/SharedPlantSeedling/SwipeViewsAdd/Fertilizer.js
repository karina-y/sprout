import React from 'react'
import PropTypes from 'prop-types'
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'

const Fertilizer = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Fertilizer
		  </p>

		  <SwipePanelContent icon="schedule" iconTitle="fertilizer schedule">
			<p className="modern-input">Fertilize every <input type="number"
																min="0"
																inputMode="numeric"
																pattern="[0-9]*"
																className="small"
																onChange={(e) => props.updateData(e, 'fertilizerSchedule')}
																value={props.item.fertilizerSchedule || ''}/> days
			</p>
		  </SwipePanelContent>

		  <SwipePanelContent icon="fertilizer">
			<p className="modern-input">
			  <label>preferred fertilizer</label>
			  <input type="text"
					 onChange={(e) => props.updateData(e, 'fertilizer')}
					 value={props.item.fertilizer || ''}/></p>
		  </SwipePanelContent>

		</div>
)

Fertilizer.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired
}

export default Fertilizer
