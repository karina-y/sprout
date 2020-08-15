import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import '../PlantViewEdit/PlantSeedlingViewEdit.scss'
import 'react-datepicker/dist/react-datepicker.css'
import {
  sortByLastDate
} from '../../../utils/helpers/plantData'
import { toast } from 'react-toastify'
import DiaryModals from './DiaryModals'
import DiaryReadEdit from './DiaryReadEdit'
import useNewData from '../../hooks/useNewData'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/


const DiarySwipePanel = (props) => {
  const plant = props.plant;
  const { newData, setNewData, changeNewData } = useNewData({})

  const updatePlant = (type) => {
	console.log("profile", type);

	const newPlantData = newData;
	const oldPlantData = plant;

	if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
	  toast.error("No data entered.");
	} else {
	  //TODO abstract each of these cases out
	  let data = {
		[type]: newPlantData[type]
	  };

	  if (data) {
		data._id = oldPlantData._id;

		Meteor.call("diary.update", type, data, (err, response) => {
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

			{/* diary */}
			<DiaryReadEdit item={plant} updateData={changeNewData}/>

			{/* diary */}
			<DiaryModals updateData={changeNewData}
						 save={updatePlant}
						 resetModal={resetData}
						 modalOpen={props.modalOpen}
						 diary={plant.diary}/>

		  </div>
  )

}

DiarySwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  editing: PropTypes.string,
  modalOpen: PropTypes.string,
  exitEditMode: PropTypes.func.isRequired,
}

export default withTracker((props) => {
  // const id = props.match.params.id
  // const plant = Plant.findOne({_id: id})
  // const categories = Category.find({}).fetch()
  let plant = props.plant;

  //sort the data
  plant.diary = sortByLastDate(plant.diary)

  return {
	plant
  }
})(DiarySwipePanel)

