import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import '../PlantViewEdit/PlantSeedlingViewEdit.scss'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import EtcPlantReadEdit from './EtcPlantReadEdit'
import useNewData from '../../hooks/useNewData'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/


const EtcSwipePanel = (props) => {
  const plant = props.plant;
  const { newData, setNewData, changeNewData } = useNewData({})

  const updatePlant = (type) => {
	console.log("profile", type);

	const newPlantData = newData;
	const oldPlantData = plant;
	let changeTitle = false;

	if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
	  toast.error("No data entered.");
	} else {
	  //TODO abstract each of these cases out
	  let data = {
		commonName: newPlantData.commonName || oldPlantData.commonName,
		latinName: newPlantData.latinName || oldPlantData.latinName,
		toxicity: newPlantData.toxicity || oldPlantData.toxicity,
		category: newPlantData.category || oldPlantData.category,
		location: newPlantData.location || oldPlantData.location,
		locationBought: newPlantData.locationBought || oldPlantData.locationBought,
		dateBought: new Date(newPlantData.dateBought || oldPlantData.dateBought),
		datePlanted: new Date(newPlantData.datePlanted || oldPlantData.datePlanted),
		companions: newPlantData.companions || oldPlantData.companions,
		lightPreference: newPlantData.lightPreference || oldPlantData.lightPreference
	  }

	  if (newPlantData.latinName !== oldPlantData.latinName || newPlantData.commonName !== oldPlantData.commonName) {
		changeTitle = true
	  }

	  if (data) {
		data._id = oldPlantData._id;

		Meteor.call("etc.update", type, data, changeTitle, (err, response) => {
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
	setNewData({})
	props.exitEditMode();
  }

  return (
		  <div className="PlantSeedlingViewEdit">

			<EtcPlantReadEdit plant={plant}
							  updateData={changeNewData}
							  editing={props.editing}/>

		  </div>
  )

}

EtcSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  editing: PropTypes.string,
  exitEditMode: PropTypes.func.isRequired,
}

export default EtcSwipePanel;
