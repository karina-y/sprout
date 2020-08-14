import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import '../PlantViewEdit/PlantSeedlingViewEdit.scss'
import 'react-datepicker/dist/react-datepicker.css'
import {
  getHighlightDates, getLastSoilMoisture, getLastSoilPh,
  lastChecked, sortByLastDate
} from '../../../utils/plantData'
import { toast } from 'react-toastify'
import SoilCompModals from './SoilCompModals'
import SoilCompReadEdit from './SoilCompReadEdit'
import SoilCompReadEditPro from './SoilCompReadEditPro'
import useNewData from '../../hooks/useNewData'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/


const SoilCompSwipePanel = (props) => {
  const plant = props.plant;
  const soilCompLastChecked = lastChecked(plant.soilCompositionTracker)
  const soilPh = getLastSoilPh(plant.soilCompositionTracker)
  const soilMoisture = getLastSoilMoisture(plant.soilCompositionTracker)
  const { newData, changeNewData, addTrackerDate } = useNewData({})

  const updatePlant = (type) => {
	console.log("profile", type);

	const newPlantData = newData;
	const oldPlantData = props.plant;

	if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
	  toast.error("No data entered.");
	} else {
	  let data;

	  //TODO abstract each of these cases out
	  if (newPlantData.category === 'in-ground' || (!newPlantData.category && oldPlantData.category === 'in-ground')) {
		data = {
		  soilAmendment: newPlantData.soilAmendment,
		  soilType: newPlantData.soilType,
		  tilled: newPlantData.tilled === 'true'
		}
	  } else {
		data = {
		  soilRecipe: newPlantData.soilRecipe
		}
	  }

	  if (data) {
		data._id = oldPlantData._id;

		Meteor.call("soilComp.update", type, data, (err, response) => {
		  if (err) {
			toast.error(err.message);
		  } else {
			toast.success("Successfully saved new entry.");

			//reset the data
			resetData();
		  }
		});
	  } else {
		toast.error("No data entered.");
	  }
	}
  }

  const resetData = () => {
	useNewData({})

	props.exitEditMode();
  }

  return (
		  <div className="PlantSeedlingViewEdit">

			{/* soil comp */}
			{Meteor.isPro ?
					<SoilCompReadEditPro item={plant}
										 updateData={changeNewData}
										 soilCompLastChecked={soilCompLastChecked}
										 soilMoisture={soilMoisture}
										 soilPh={soilPh}
										 editing={props.editing}/>
					:
					<SoilCompReadEdit item={plant}
									  updateData={changeNewData}
									  soilCompLastChecked={soilCompLastChecked}
									  soilMoisture={soilMoisture}
									  soilPh={soilPh}
									  editing={props.editing}/>
			}


			{/* soil comp */}
			<SoilCompModals updateData={changeNewData}
							addTrackerDate={addTrackerDate}
							save={updatePlant}
							resetModal={resetData}
							modalOpen={props.modalOpen}
							newDataTracker={newData.soilCompositionTracker}
							tracker={plant.soilCompositionTracker}
							category={plant.category}
							highlightDates={plant.highlightDates}/>

		  </div>
  )

}

SoilCompSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  editing: PropTypes.string,
  modalOpen: PropTypes.string,
  exitEditMode: PropTypes.func.isRequired,
}

export default withTracker((props) => {
  // const id = props.match.params.id
  // let plant = Plant.findOne({_id: id})
  let plant = props.plant;

  //sort the data
  plant.soilCompositionTracker = sortByLastDate(plant.soilCompositionTracker)

  plant.highlightDates = getHighlightDates(plant.soilCompositionTracker);

  return {
	plant
  };
})(SoilCompSwipePanel);

