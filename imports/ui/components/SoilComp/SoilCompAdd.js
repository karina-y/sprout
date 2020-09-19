import React from 'react'
import PropTypes from 'prop-types'
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent'

const SoilCompAdd = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Soil Composition
		  </p>

		  {props.category === 'in-ground' ?
				  <SwipePanelContent icon="ph">
					<p className="modern-input">pH <input type="number"
														  min="0"
														  inputMode="numeric"
														  pattern="[0-9]*"
														  className="small"
														  placeholder="6.2"
														  onChange={(e) => props.updateData(e, 'ph')}/>
					</p>
				  </SwipePanelContent>
				  : props.category === 'potted' ?
						  <React.Fragment>
							<SwipePanelContent icon="soilMoisture">
							  <p className="modern-input">Moisture Level <input type="number"
																				min="0"
																				inputMode="numeric"
																				pattern="[0-9]*"
																				className="small"
																				placeholder="40"
																				onChange={(e) => props.updateData(e, 'moisture')}/>%
							  </p>
							</SwipePanelContent>
						  </React.Fragment>
						  :
						  <p>Please select a category on the first panel.</p>
		  }


		</div>
)

SoilCompAdd.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  category: PropTypes.string
}

export default SoilCompAdd
