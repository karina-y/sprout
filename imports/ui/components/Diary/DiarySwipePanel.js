import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import '../PlantViewEdit/PlantSeedlingViewEdit.scss'
import 'react-datepicker/dist/react-datepicker.css'
import {
  sortByLastDate
} from '../../../utils/plantData'
import { toast } from 'react-toastify'
import DiaryModals from './DiaryModals'
import DiaryReadEdit from './DiaryReadEdit'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/


class DiarySwipePanel extends Component {
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

	if (type === 'diary') {
	  if (newPlantData[type]) {
		newPlantData[type].entry = e.target.value
		newPlantData[type].date = new Date()
	  } else {
		newPlantData[type] = {
		  entry: e.target.value,
		  date: new Date()
		}
	  }
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

			  {/* diary */}
			  <DiaryReadEdit item={plant} updateData={this.updateData}/>

			  {/* diary */}
			  <DiaryModals updateData={this.updateData}
						   save={this.updatePlant}
						   resetModal={this.resetData}
						   modalOpen={this.props.modalOpen}
						   diary={plant.diary}/>

			</div>
	)
  }
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

