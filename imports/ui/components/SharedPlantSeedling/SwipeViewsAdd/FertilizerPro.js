import React from 'react'
import PropTypes from 'prop-types'
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'

const FertilizerPro = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Fertilizer / Nutrients
		  </p>

		  <SwipePanelContent icon="schedule" iconTitle="feeding schedule">
			<p className="modern-input">Feed every <input type="number"
														  min="0"
														  inputMode="numeric"
														  pattern="[0-9]*"
														  placeholder="30"
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

		  <React.Fragment>
			<SwipePanelContent icon="compost">
			  <p className="modern-input">
				<label>compost</label>
				<input type="text"
					   onChange={(e) => props.updateData(e, 'compost')}
					   value={props.item.compost || ''}/></p>
			</SwipePanelContent>

			<SwipePanelContent icon="nutrients">
			  <p className="modern-input">
				<label>other nutrient amendment</label>
				<input type="text"
					   onChange={(e) => props.updateData(e, 'nutrient')}
					   value={props.item.nutrient || ''}/></p>
			</SwipePanelContent>
		  </React.Fragment>

		</div>
)

FertilizerPro.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired
}

export default FertilizerPro
