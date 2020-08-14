import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import './PlantSeedlingViewEdit.scss'
import { Session } from 'meteor/session'
import 'react-datepicker/dist/react-datepicker.css'
import SwipeableViews from 'react-swipeable-views'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar'
import Plant from '/imports/api/Plant/Plant'
import { toast } from 'react-toastify'
import ItemAddEntryModal from '../Shared/ItemAddEntryModal'
import FertilizerSwipePanel from '../Fertilizer/FertilizerSwipePanel'
import WaterSwipePanel from '../Water/WaterSwipePanel'
import SoilCompSwipePanel from '../SoilComp/SoilCompSwipePanel'
import PruningDeadheadingSwipePanel from '../PruningDeadheading/PruningDeadheadingSwipePanel'
import PestSwipePanel from '../Pest/PestSwipePanel'
import DiarySwipePanel from '../Diary/DiarySwipePanel'
import EtcSwipePanel from '../Etc/EtcSwipePanel'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/


class PlantViewEdit extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  newData: {},
	  swipeViewIndex: 0,
	  currentDateSelection: null,
	  modalOpen: null,
	  editing: null,
	  pruneType: null
	}

	autobind(this)
  }

  componentDidMount () {
	Session.set('pageTitle', this.props.plant.latinName || this.props.plant.commonName)

	//this is to disable keyboard from popping up on android, sometimes you just need good ol vanilla js
	const inputs = document.getElementsByTagName('input')

	for (let i = 0; i < inputs.length; i++) {
	  inputs[i].disabled = true
	}
  }

  //TODO
  updatePhoto (e) {
	let files = e.target.files
	let file = files[0]
	let fileReader = new FileReader()

	if (files.length === 0) {
	  return
	}

	fileReader.onload = function (event) {
	  let dataUrl = event.target.result
	  template.dataUrl.set(dataUrl)
	}

	fileReader.readAsDataURL(file)
  }


  exitEditMode () {
	this.setState({
	  modalOpen: null,
	  editing: null
	})
  }

  handleEdit () {
	let editing

	//selecting which swipe view to edit
	switch (this.state.swipeViewIndex) {
	  case 0:
		editing = 'waterTracker'
		break
	  case 1:
		editing = 'fertilizerTracker'
		break
	  case 2:
		editing = 'pruningDeadheadingTracker'
		break
	  case 3:
		editing = 'soilCompositionTracker'
		break
	  case 6:
		editing = 'etc'
		break
	}

	this.setState({
	  editing
	})
  }

  openModal (isHistoryModal) {
	let modalOpen

	//selecting which modal to open
	switch (this.state.swipeViewIndex) {
	  case 0:
		modalOpen = 'waterTracker'
		break
	  case 1:
		modalOpen = 'fertilizerTracker'
		break
	  case 2:
		modalOpen = 'pruningDeadheadingTracker'
		break
	  case 3:
		modalOpen = 'soilCompositionTracker'
		break
	  case 4:
		modalOpen = 'pestTracker'
		break
	  case 5:
		modalOpen = 'diary'
		break
	}

	if (isHistoryModal) {
	  modalOpen+= "-history"
	}

	this.setState({
	  modalOpen
	})
  }

  deletePlant () {

	Meteor.call('plant.delete', this.props.plant._id, (err, response) => {
	  if (err) {
		toast.error(err.message)
	  } else {
		this.setState({
		  modalOpen: null
		})

		this.props.history.push('/catalogue/plant')
	  }
	})

  }

  render () {
	const plant = this.props.plant

	return (
			<div className="PlantSeedlingViewEdit">
			  {this.state.editing === 'etc' ?
					  <div className="plant-photo editing">
						<img src={plant.image}
							 alt={plant.commonName}
							 title={plant.commonName}/>

						{/*<FontAwesomeIcon icon={faCamera}
										 size="3x"
										 className="plant-condition-icon"
										 alt="camera"
										 title="update photo"/>

						<input type="file" name="plant photo" onChange={this.updatePhoto}/>*/}
					  </div>
					  :
					  <div className="plant-photo">
						<img src={plant.image}
							 alt={plant.commonName}
							 title={plant.commonName}/>
					  </div>
			  }

			  <SwipeableViews className={`swipe-view ${this.state.editing && 'editing'}`}
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e, editing: null})}>

				<WaterSwipePanel modalOpen={this.state.modalOpen}
								 editing={this.state.editing}
								 exitEditMode={this.exitEditMode}
								 plant={plant}/>

				<FertilizerSwipePanel modalOpen={this.state.modalOpen}
									  editing={this.state.editing}
									  exitEditMode={this.exitEditMode}
									  plant={plant}/>

				<PruningDeadheadingSwipePanel modalOpen={this.state.modalOpen}
											  editing={this.state.editing}
											  exitEditMode={this.exitEditMode}
											  plant={plant}/>

				<SoilCompSwipePanel modalOpen={this.state.modalOpen}
									editing={this.state.editing}
									exitEditMode={this.exitEditMode}
									plant={plant}/>

				<PestSwipePanel modalOpen={this.state.modalOpen}
								editing={this.state.editing}
								exitEditMode={this.exitEditMode}
								plant={plant}/>

				<DiarySwipePanel modalOpen={this.state.modalOpen}
								 editing={this.state.editing}
								 exitEditMode={this.exitEditMode}
								 plant={plant}/>

				<EtcSwipePanel modalOpen={this.state.modalOpen}
							   editing={this.state.editing}
							   exitEditMode={this.exitEditMode}
							   plant={plant}/>

			  </SwipeableViews>

			  {/* buttons */}
			  <div className="add-data flex-around bottom-nav">
				<FontAwesomeIcon icon={faTrash}
								 className="plant-condition-icon"
								 alt="trash"
								 title="delete"
								 onClick={() => this.setState({modalOpen: 'delete'})}/>

				{this.state.swipeViewIndex < 6 &&
				<React.Fragment>
				  <FontAwesomeIcon icon={faPlus}
								   className="plant-condition-icon"
								   alt='plus'
								   title="add"
								   onClick={() => this.openModal(false)}/>

				  {!this.state.editing &&
				  <FontAwesomeIcon icon={faCalendar}
								   className="plant-condition-icon"
								   alt={'calendar'}
								   title="view history"
								   onClick={() => this.openModal(true)}/>
				  }
				</React.Fragment>
				}

				{(this.state.swipeViewIndex < 4 || this.state.swipeViewIndex > 5) ?
						<React.Fragment>
						  <FontAwesomeIcon icon={this.state.editing ? faTimes : faPencilAlt}
										   className="plant-condition-icon"
										   alt={this.state.editing ? 'times' : 'pencil'}
										   title={this.state.editing ? 'cancel' : 'edit'}
										   onClick={() => this.state.editing ? this.exitEditMode() : this.handleEdit()}/>

						  {this.state.editing &&
						  <FontAwesomeIcon icon={faSave}
										   className="plant-condition-icon"
										   alt="floppy disk"
										   title="save"
										   onClick={() => this.updatePlant(`${this.state.editing}-edit`)}/>
						  }
						</React.Fragment>
						: ''
				}

			  </div>


			  <ItemAddEntryModal save={this.deletePlant}
								 cancel={this.exitEditMode}
								 show={this.state.modalOpen}
								 type="delete"
								 header="Are you sure you want to delete this plant's entire profile?" />
			</div>
	)
  }
}

PlantViewEdit.propTypes = {
  plant: PropTypes.object.isRequired
}

export default withTracker((props) => {
  const id = props.match.params.id
  const plant = Plant.findOne({_id: id})

  return {
	plant
  }
})(PlantViewEdit)

