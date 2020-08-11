import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import '../PlantViewEdit/PlantSeedlingViewEdit.scss'
import 'react-datepicker/dist/react-datepicker.css'
import {
  getHighlightDates, getLastPestName, getLastPestTreatment, lastChecked, sortByLastDate
} from '../../../utils/plantData'
import { toast } from 'react-toastify'
import PestModals from './PestModals'
import PestReadEdit from './PestReadEdit'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/


class PestSwipePanel extends Component {
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

	if (newPlantData[trackerType]) {
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
	  //TODO abstract each of these cases out
	  let data = {
		[type]: newPlantData[type]
	  }

	  if (data) {
		data._id = oldPlantData._id;

		Meteor.call("water.update", type, data, (err, response) => {
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
	let pestLastChecked = lastChecked(plant.pestTracker)
	let pestName = getLastPestName(plant.pestTracker)
	let pestTreatment = getLastPestTreatment(plant.pestTracker)

	return (
			<div className="PlantSeedlingViewEdit">

			  <PestReadEdit item={plant}
							updateData={this.updateData}
							pestLastChecked={pestLastChecked}
							pestName={pestName}
							pestTreatment={pestTreatment}/>


			  {/* pests */}
			  <PestModals addTrackerDate={this.addTrackerDate}
						  addTrackerDetails={this.addTrackerDetails}
						  save={this.updatePlant}
						  resetModal={this.resetData}
						  modalOpen={this.props.modalOpen}
						  newDataTracker={this.state.newData.pestTracker}
						  tracker={plant.pestTracker}
						  highlightDates={plant.highlightDates}/>

			</div>
	)
  }
}

PestSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired
}

export default withTracker((props) => {
  // const id = props.match.params.id
  // const plant = Plant.findOne({_id: id})
  let plant = props.plant;

  //sort the data
  plant.pestTracker = sortByLastDate(plant.pestTracker)
  plant.highlightDates = getHighlightDates(plant.pestTracker)

  return {
	plant
  }
})(PestSwipePanel)

