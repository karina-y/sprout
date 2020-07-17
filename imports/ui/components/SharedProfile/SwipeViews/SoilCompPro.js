import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../../Shared/SwipePanelContent'
import SoilTypes from '../../../../utils/soilTypes'


const SoilCompPro = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Soil Composition
		  </p>

		  <SwipePanelContent icon="schedule"
							 iconTitle="last checked soil composition">
			<p>{props.soilCompLastChecked}</p>
		  </SwipePanelContent>

		  {props.profile.category === 'in-ground' ?
				  props.editing === 'soilCompositionTracker' ?
						  <React.Fragment>

							<SwipePanelContent icon="tilling">
							  <p className="modern-input">
								<label>tilled</label>
								<select onChange={(e) => props.updateData(e, 'tilled')}
										defaultValue={props.profile.tilled || ''}>
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
										defaultValue={props.profile.soilType || ''}>
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
									   defaultValue={props.profile.soilAmendment || ''}/></p>
							</SwipePanelContent>

						  </React.Fragment>
						  :
						  <React.Fragment>
							<SwipePanelContent icon="tilling">
							  <p>Tilled: {props.profile.tilled ? 'Yes' : 'No'}</p>
							</SwipePanelContent>

							{props.profile.soilType &&
							<SwipePanelContent icon="soilType">
							  <p>Soil Type: {props.profile.soilType}</p>
							</SwipePanelContent>
							}

							{props.profile.soilAmendment &&
							<SwipePanelContent icon="soilAmendment">
							  <p>Soil Amendment: {props.profile.soilAmendment}</p>
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

		  {props.profile.category === 'potted' ?
				  props.editing === 'soilCompositionTracker' ?
						  <SwipePanelContent icon="soilRecipe">
							<p className="modern-input">
							  <label>soil recipe</label>
							  <input type="text"
									 onChange={(e) => props.updateData(e, 'soilRecipe')}
									 defaultValue={props.profile.soilRecipe || ''}/></p>
						  </SwipePanelContent>
						  :
						  <React.Fragment>
							{props.profile.soilRecipe &&
							<SwipePanelContent icon="soilRecipe">
							  <p>{props.profile.soilRecipe}</p>
							</SwipePanelContent>
							}

							{props.soilMoisture &&
							<SwipePanelContent icon="props.soilMoisture">
							  <p>Moisture Level {props.soilMoisture}</p>
							</SwipePanelContent>
							}

							{(!props.profile.soilRecipe && !props.soilMoisture) &&
							<p>No records available</p>
							}
						  </React.Fragment>
				  :
				  ''
		  }


		</div>
)



SoilCompPro.propTypes = {
  profile: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  soilCompLastChecked: PropTypes.string.isRequired,
  soilMoisture: PropTypes.string.isRequired,
  soilPh: PropTypes.number
};

export default SoilCompPro;
