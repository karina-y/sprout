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

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/


class SoilCompSwipePanel extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  newData: {}
	}

	autobind(this)
  }

  //TODO this is heavy! simplify this and break it out into diff functions (one separate for tracker for sure)
  //tracker should be able to be simplified
  //this updates the plant's data in my state before it gets sent out to the backend
  updateData (e, type) {
	//this is any new data that's been entered, updating it as new inputs are entered
	let newPlantData = this.state.newData
	newPlantData[type] = e.target.value

	this.setState({
	  newData: newPlantData
	})
  }

  //this only adds new dates to trackers, ie adding date fertilizer was used
  addTrackerDate (e, trackerType) {
	let newPlantData = this.state.newData;

	if (newPlantData[trackerType]) {
	  newPlantData[trackerType].date = new Date(e)
	} else {
	  newPlantData[trackerType] = {
		date: new Date(e)
	  }
	}

	this.setState({
	  newData: newPlantData
	})
  }

  //this adds additional details to trackers, ie fertilizer type used
  addTrackerDetails (e, trackerType, detailType) {
	let newPlantData = this.state.newData;

	if (type === 'ph' || type === 'moisture') {
	  let phVal = parseFloat(e.target.value)
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (newPlantData.soilCompositionTracker) {
		newPlantData.soilCompositionTracker[type] = type === 'ph' ? phVal : moistureVal
	  } else {
		newPlantData.soilCompositionTracker = {
		  [type]: type === 'ph' ? phVal : moistureVal
		}
	  }

	} else if (newPlantData[trackerType]) {
	  newPlantData[trackerType][detailType] = e.target.value;
	} else {
	  newPlantData[trackerType] = {
		[detailType]: e.target.value
	  }
	}

	this.setState({
	  newData: newPlantData
	})
  }

  updatePlant(type) {
	console.log("profile", type);

	const newPlantData = this.state.newData;
	const oldPlantData = this.props.plant;

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
			this.resetData();
		  }
		});
	  } else {
		toast.error("No data entered.");
	  }
	}
  }

  resetData() {
	this.setState({
	  newData: {},
	});

	this.props.exitEditMode();
  }

  render () {
	const plant = this.props.plant
	let soilCompLastChecked = lastChecked(plant.soilCompositionTracker)
	let soilPh = getLastSoilPh(plant.soilCompositionTracker)
	let soilMoisture = getLastSoilMoisture(plant.soilCompositionTracker)

	return (
			<div className="PlantSeedlingViewEdit">

			  {/* soil comp */}
			  {Meteor.isPro ?
					  <SoilCompReadEditPro item={plant}
										   updateData={this.updateData}
										   soilCompLastChecked={soilCompLastChecked}
										   soilMoisture={soilMoisture}
										   soilPh={soilPh}
										   editing={this.props.editing}/>
					  :
					  <SoilCompReadEdit item={plant}
										updateData={this.updateData}
										soilCompLastChecked={soilCompLastChecked}
										soilMoisture={soilMoisture}
										soilPh={soilPh}
										editing={this.props.editing}/>
			  }


			  {/* soil comp */}
			  <SoilCompModals updateData={this.updateData}
							  addTrackerDate={this.addTrackerDate}
							  save={this.updatePlant}
							  resetModal={this.resetData}
							  modalOpen={this.props.modalOpen}
							  newDataTracker={this.state.newData.soilCompositionTracker}
							  tracker={plant.soilCompositionTracker}
							  category={plant.category}
							  highlightDates={plant.highlightDates}/>

			</div>
	)
  }
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

