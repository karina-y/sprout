import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent'
import SoilTypes from '../../../utils/constants/soilTypes'


const SoilCompAddPro = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Soil Composition
		  </p>

		  {props.item.category === 'in-ground' ?
				  <React.Fragment>

					<SwipePanelContent icon="tilling">
					  <p className="modern-input">
						<label>is the soil tilled</label>
						<select onChange={(e) => props.updateData(e, 'tilled')}
								value={props.item.tilled || ''}>
						  <option value='' disabled={true}>- Is the soil tilled? -</option>
						  <option value={false}>No</option>
						  <option value={true}>Yes</option>
						</select>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="soilType">
					  <p className="modern-input">
						<label>ground soil type</label>
						<select onChange={(e) => props.updateData(e, 'soilType')}
								value={props.item.soilType || ''}>
						  <option value='' disabled={true}>- Select a ground soil type -</option>
						  {SoilTypes.map((item, index) => {
							return <option value={item.type} key={index}>{item.displayName}</option>
						  })}
						</select>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="soilAmendment">
					  <p className="modern-input">
						<label>soil amendment</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'soilAmendment')}
							   value={props.item.soilAmendment || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="ph">
					  <p className="modern-input">pH <input type="number"
															min="0"
															inputMode="numeric"
															pattern="[0-9]*"
															className="small"
															placeholder="6.2"
															onChange={(e) => props.updateData(e, 'ph')}/></p>
					</SwipePanelContent>

				  </React.Fragment>
				  :
				  props.item.category === 'potted' ?
						  <React.Fragment>
							<SwipePanelContent icon="soilRecipe">
							  <p className="modern-input">
								<label>soil recipe</label>
								<input type="text"
									   onChange={(e) => props.updateData(e, 'soilRecipe')}
									   value={props.item.soilRecipe || ''}/></p>
							</SwipePanelContent>

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



SoilCompAddPro.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired
};

export default SoilCompAddPro;
