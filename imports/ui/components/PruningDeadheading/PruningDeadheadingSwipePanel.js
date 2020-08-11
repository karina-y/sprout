import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import '../PlantViewEdit/PlantSeedlingViewEdit.scss'
import 'react-datepicker/dist/react-datepicker.css'
import {
  getHighlightDates, sortByLastDate
} from '../../../utils/plantData'
import { toast } from 'react-toastify'
import PruningDeadheadingModals from './PruningDeadheadingModals'
import PruningDeadheadingReadEditPro from './PruningDeadheadingReadEditPro'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/


class PruningDeadheadingSwipePanel extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  newData: {},
	  pruneType: null
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

	//these are actually stored separately in the db, but for ease for the user they're in one view
	if (type === 'pruningDeadheadingTracker') {
	  type = this.state.pruneType
	}

	if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
	  toast.error("No data entered.");
	} else {
	  let data;

	  if (type === 'pruningDeadheadingTracker-edit') {
		data = {
		  pruningPreference: newPlantData.pruningPreference || oldPlantData.pruningPreference,
		  deadheadingPreference: newPlantData.deadheadingPreference || oldPlantData.deadheadingPreference
		}
	  } else {
		data = {
		  pruningTracker: newPlantData.pruningTracker,
		  deadheadingTracker: newPlantData.deadheadingTracker,
		}
	  }

	  if (data) {
		data._id = oldPlantData._id;

		Meteor.call("pruningDeadheading.update", type, data, (err, response) => {
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

	return (
			<div className="PlantSeedlingViewEdit">
			  <PruningDeadheadingReadEditPro plant={plant}
											 updateData={this.updateData}
											 editing={this.props.editing}/>

			  {/* pruning */}
			  <PruningDeadheadingModals addTrackerDate={this.addTrackerDate}
										addTrackerDetails={this.addTrackerDetails}
										save={this.updatePlant}
										resetModal={this.resetData}
										modalOpen={this.props.modalOpen}
										newDataTracker={this.state.newData.pruningDeadheadingTracker}
										tracker={plant.pruningDeadheadingTracker}
										highlightDates={plant.highlightDates}
										pruneType={this.state.pruneType}
										setPruneType={(val) => this.setState(val)}/>

			</div>
	)
  }
}

PruningDeadheadingSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  editing: PropTypes.string,
  modalOpen: PropTypes.string,
  exitEditMode: PropTypes.func.isRequired,
}

export default withTracker((props) => {
  // const id = props.match.params.id
  // const plant = Plant.findOne({_id: id})
  let plant = props.plant;

  if (plant.pruningTracker || plant.deadheadingTracker) {
	const pruning = plant.pruningTracker || []
	const deadheading = plant.deadheadingTracker || []

	for (let i = 0; i < pruning.length; i++) {
	  pruning[i].action = 'Pruned'
	}

	for (let i = 0; i < deadheading.length; i++) {
	  deadheading[i].action = 'Deadheaded'
	}

	plant.pruningDeadheadingTracker = sortByLastDate(pruning.concat(deadheading))
	plant.highlightDates = getHighlightDates(plant.pruningDeadheadingTracker);
  } else {
	plant.pruningDeadheadingTracker = null
  }


  return {
	plant
  }
})(PruningDeadheadingSwipePanel)

