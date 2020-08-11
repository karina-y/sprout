import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent'
import SoilTypes from '../../../utils/soilTypes'

const ReadEdit = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Soil Composition
		  </p>

		  <SwipePanelContent icon="schedule"
							 iconTitle="last checked soil composition">
			<p>{props.soilCompLastChecked}</p>
		  </SwipePanelContent>

		  {props.item.category === 'in-ground' ?
				  props.editing === 'soilCompositionTracker' ?
						  <React.Fragment>

							<SwipePanelContent icon="tilling">
							  <p className="modern-input">
								<label>tilled</label>
								<select onChange={(e) => props.updateData(e, 'tilled')}
										defaultValue={props.item.tilled || ''}>
								  <option value='' disabled={true}>- Is the soil tilled? -</option>
								  <option value={false}>No</option>
								  <option value={true}>Yes</option>
								</select>
							  </p>
							</SwipePanelContent>

							<SwipePanelContent icon="soilType">
							  <p className="modern-input">
								<label>soil type</label>
								<select onChange={(e) => props.updateData(e, 'soilType')}
										defaultValue={props.item.soilType || ''}>
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
									   defaultValue={props.item.soilAmendment || ''}/></p>
							</SwipePanelContent>

						  </React.Fragment>
						  :
						  <React.Fragment>
							<SwipePanelContent icon="tilling">
							  <p>Tilled: {props.item.tilled ? 'Yes' : 'No'}</p>
							</SwipePanelContent>

							{props.item.soilType &&
							<SwipePanelContent icon="soilType">
							  <p>Soil Type: {props.item.soilType}</p>
							</SwipePanelContent>
							}

							{props.item.soilAmendment &&
							<SwipePanelContent icon="soilAmendment">
							  <p>Soil Amendment: {props.item.soilAmendment}</p>
							</SwipePanelContent>
							}

							{props.soilPh &&
							<SwipePanelContent icon="ph">
							  <p>pH {props.soilPh}</p>
							</SwipePanelContent>
							}
						  </React.Fragment>
				  :
				  ''
		  }

		  {props.item.category === 'potted' ?
				  props.editing === 'soilCompositionTracker' ?
						  <SwipePanelContent icon="soilRecipe">
							<p className="modern-input">
							  <label>soil recipe</label>
							  <input type="text"
									 onChange={(e) => props.updateData(e, 'soilRecipe')}
									 defaultValue={props.item.soilRecipe || ''}/></p>
						  </SwipePanelContent>
						  :
						  <React.Fragment>
							{props.item.soilRecipe &&
							<SwipePanelContent icon="soilRecipe">
							  <p>{props.item.soilRecipe}</p>
							</SwipePanelContent>
							}

							{props.soilMoisture &&
							<SwipePanelContent icon="soilMoisture">
							  <p>Moisture Level {props.soilMoisture}</p>
							</SwipePanelContent>
							}

							{(!props.item.soilRecipe && !props.soilMoisture) &&
							<SwipePanelContent icon="info">
							  <p>No records available</p>
							</SwipePanelContent>
							}
						  </React.Fragment>
				  :
				  ''
		  }


		</div>
)



ReadEdit.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  soilCompLastChecked: PropTypes.string.isRequired,
  soilMoisture: PropTypes.string,
  soilPh: PropTypes.number
};

export default ReadEdit;
