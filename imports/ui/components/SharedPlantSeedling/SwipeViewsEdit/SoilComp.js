import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'

const SoilComp = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">
			Soil Composition
		  </p>

		  <SwipePanelContent icon="schedule"
							 iconTitle="last checked soil composition">
			<p>{props.soilCompLastChecked}</p>
		  </SwipePanelContent>


		  {props.item.category === 'in-ground' ?
				  <SwipePanelContent icon="soilMoisture">
					{props.soilMoisture ?
							<p>Moisture Level {props.soilMoisture}</p>
							:
							<p>No records available.</p>
					}
				  </SwipePanelContent>
				  :
				  <SwipePanelContent icon="soilMoisture">
					{props.soilPh ?
							<p>Soil pH {props.soilPh}</p>
							:
							<p>No records available.</p>
					}
				  </SwipePanelContent>
		  }

		</div>
)



SoilComp.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  soilCompLastChecked: PropTypes.string.isRequired,
  soilMoisture: PropTypes.string.isRequired,
  soilPh: PropTypes.number.isRequired
};

export default SoilComp;
