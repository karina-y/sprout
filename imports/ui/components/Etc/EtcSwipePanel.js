import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import '../PlantViewEdit/PlantSeedlingViewEdit.scss'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import EtcPlantReadEdit from './EtcPlantReadEdit'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/


class EtcSwipePanel extends Component {
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

	if (type === 'companions') {
	  const stripped = e.target.value.replace(/\s*,\s*/g, ',')
	  newPlantData[type] = stripped.split(',')

	} else if (type === 'dateBought' || type === 'datePlanted') {
	  newPlantData[type] = new Date(e.target.value)
	} else {
	  newPlantData[type] = e.target.value
	}

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
		companions: newPlantData.companions || oldPlantData.companions
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

			  <EtcPlantReadEdit plant={plant} updateData={this.updateData} editing={this.props.editing}/>

			</div>
	)
  }
}

EtcSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  editing: PropTypes.string,
  exitEditMode: PropTypes.func.isRequired,
}

export default EtcSwipePanel;

/*export default withTracker((props) => {
  // const id = props.match.params.id
  // const plant = Plant.findOne({_id: id})
  // const categories = Category.find({}).fetch()
  let plant = props.plant;


  return {
	plant
  }
})(EtcSwipeView)*/

