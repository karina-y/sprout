import React, { Component } from 'react'
import autobind from 'react-autobind'
import './PlantAdd.scss'
import Modal from 'react-bootstrap/Modal'
import { Session } from 'meteor/session'
import SwipeableViews from 'react-swipeable-views'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { selectRandomPlantPicture } from '/imports/utils/selectRandomPlantPicture'
import { toast } from 'react-toastify'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import Category from '/imports/api/Category/Category'
import SwipePanelContent from '/imports/ui/components/Shared/SwipePanelContent/SwipePanelContent'
import WaterAdd from '../../components/SharedPlantSeedling/SwipeViewsAdd/Water'
import FertilizerAddPro from '../../components/SharedPlantSeedling/SwipeViewsAdd/FertilizerPro'
import WaterAddPro from '../../components/SharedPlantSeedling/SwipeViewsAdd/WaterPro'
import FertilizerAdd from '../../components/SharedPlantSeedling/SwipeViewsAdd/Fertilizer'
import SoilCompAddPro from '../../components/SharedPlantSeedling/SwipeViewsAdd/SoilCompPro'
import SoilCompAdd from '../../components/SharedPlantSeedling/SwipeViewsAdd/SoilComp'

class PlantAdd extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  plant: {
		image: selectRandomPlantPicture(),
		waterScheduleAuto: false
	  },
	  swipeViewIndex: 0,
	  showDiaryModal: false,
	  currentDateSelection: null,
	  categories: null
	}

	autobind(this)
  }

  componentDidMount () {
	Session.set('pageTitle', 'New Plant')
	const categories = Category.find().fetch()

	this.setState({
	  categories
	})
  }

  addNewPlant () {
	let plant = this.state.plant

	if (plant.waterSchedule) {
	  plant.waterSchedule = parseInt(plant.waterSchedule)
	}

	if (plant.fertilizerSchedule) {
	  plant.fertilizerSchedule = parseInt(plant.fertilizerSchedule)
	}

	/*if (plant.pruningSchedule) {
	  plant.pruningSchedule = parseInt(plant.pruningSchedule)
	}

	if (plant.deadheadingSchedule) {
	  plant.deadheadingSchedule = parseInt(plant.deadheadingSchedule)
	}*/

	if (plant.soilCompositionTracker && !Array.isArray(plant.soilCompositionTracker)) {
	  plant.soilCompositionTracker = [plant.soilCompositionTracker]
	}

	let errMsg;
	let swipeViewIndex = this.state.swipeViewIndex;

	if (!plant.commonName && !plant.latinName) {
	  errMsg = 'Please enter either a common or latin name (eg. Swiss Cheese Plant or Monstera adansonii).'
	  swipeViewIndex = 0;
	} else if (!plant.waterPreference) {
	  errMsg = 'Please enter a watering preference (eg. Keep soil moist but not soggy, humidity tray helpful).'
	  swipeViewIndex = 1;
	} else if (!plant.lightPreference) {
	  errMsg = 'Please enter a lighting preference (eg. Bright indirect light).'
	  swipeViewIndex = 1;
	} else if (!plant.location) {
	  errMsg = 'Please enter where this plant lives in/around your home (eg. Living Room or Back Patio).'
	  swipeViewIndex = 6;
	} else if (Meteor.isPro && !plant.category) {
	  errMsg = 'Please select a category.'
	  swipeViewIndex = 0;
	}

	if (errMsg) {
	  toast.error(errMsg)

	  this.setState({
		swipeViewIndex
	  })
	} else {
	  Meteor.call('plant.insert', plant, (err, response) => {
		if (err) {
		  toast.error(err.message)
		} else {
		  toast.success('Plant added!')
		  this.props.history.push('/catalogue/plant')
		}
	  })
	}
  }

  updateData (e, type) {
	const plant = this.state.plant

	if (type === 'companions') {
	  if (e.target.value === '') {
		delete plant[type]
	  } else {
		const stripped = e.target.value.replace(/\s*,\s*/g, ',')
		plant[type] = stripped.split(',')
	  }
	} else if (type === 'ph' || type === 'moisture') {
	  let phVal = parseFloat(e.target.value)
	  let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2))

	  if (plant.soilCompositionTracker) {
		plant.soilCompositionTracker[type] = (type === 'moisture' ? moistureVal : phVal)
	  } else {
		plant.soilCompositionTracker = {
		  date: new Date(),
		  [type]: type === 'moisture' ? moistureVal : phVal
		}
	  }

	} else if (type === 'dateBought' || type === 'datePlanted') {
	  plant[type] = new Date(e)
	} else if (type === 'tilled') {
	  plant[type] = e.target.value === 'true' ? true : false
	} else if (type === 'waterScheduleAuto') {
	  plant[type] = !plant[type]
	} else {
	  plant[type] = e.target.value
	}

	this.setState({
	  plant: plant
	})
  }

  render () {
	const plant = this.state.plant
	//TODO add ability to set plant photo and photo history eventually

	return (
			<div className="PlantAdd">
			  <img src={plant.image}
				   alt={plant.commonName}
				   title={plant.commonName}
				   className="hero-img"/>


			  <SwipeableViews className="swipe-view"
							  index={this.state.swipeViewIndex}
							  onChangeIndex={(e) => this.setState({swipeViewIndex: e})}>

				{/* plant info */}
				<div className="swipe-slide">

				  <p className="swipe-title title-ming">
					Plant {Meteor.isPro ? 'Details' : 'Name'}
				  </p>

				  <SwipePanelContent icon="info" iconTitle="common name">
					<p className="modern-input">
					  <label>common name *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'commonName')}
							 value={plant.commonName || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="info" iconTitle="latin name">
					<p className="modern-input">
					  <label>latin name *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'latinName')}
							 value={plant.latinName || ''}/></p>
				  </SwipePanelContent>

				  {Meteor.isPro &&
				  <React.Fragment>
					<SwipePanelContent icon="category">
					  <p className="modern-input">
						<label>category *</label>
						<select onChange={(e) => this.updateData(e, 'category')}
								value={plant.category || ''}>
						  <option value='' disabled={true}>- Select a category -</option>
						  {this.state.categories && this.state.categories.map((item, index) => {
							return <option value={item.category} key={index}>{item.displayName}</option>
						  })}
						</select>
					  </p>
					</SwipePanelContent>
				  </React.Fragment>
				  }

				  <SwipePanelContent icon="toxicity">
					<p className="modern-input">
					  <label>toxicity</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'toxicity')}
							 value={plant.toxicity || ''}/></p>
				  </SwipePanelContent>

				</div>


				{/* water */}
				{Meteor.isPro ?
						<WaterAddPro item={plant} updateData={this.updateData} type={'plant'}/>
						:
						<WaterAdd item={plant} updateData={this.updateData}/>
				}


				{/* fertilizer */}
				{Meteor.isPro ?
						<FertilizerAddPro item={plant} updateData={this.updateData}/>
						:
						<FertilizerAdd item={plant} updateData={this.updateData}/>
				}

				{/* pruning/deadheading schedule */}
				{Meteor.isPro &&
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">
					Pruning - Deadheading
				  </p>

				  {/*<SwipePanelContent icon="schedule" iconTitle="pruning schedule">
					<p className="modern-input">Prune every <input type="number"
																   min="0"
																   inputMode="numeric"
																   pattern="[0-9]*"
																   className="small"
																   onChange={(e) => this.updateData(e, 'pruningSchedule')}
																   value={plant.pruningSchedule || ''}/> days
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="schedule" iconTitle="deadheading schedule">
					<p className="modern-input">Deadhead every <input type="number"
																	  min="0"
																	  inputMode="numeric"
																	  pattern="[0-9]*"
																	  className="small"
																	  onChange={(e) => this.updateData(e, 'deadheadingSchedule')}
																	  value={plant.deadheadingSchedule || ''}/> days
					</p>
				  </SwipePanelContent>*/}

				  <SwipePanelContent icon="pruning" iconTitle="pruning preference">
					<p className="modern-input">
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'pruningPreference')}
							 value={plant.pruningPreference || ''}/>
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="deadheading" iconTitle="deadheading preference">
					<p className="modern-input">
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'deadheadingPreference')}
							 value={plant.deadheadingPreference || ''}/>
					</p>
				  </SwipePanelContent>
				</div>
				}


				{/* soil comp */}
				{Meteor.isPro ?
						<SoilCompAddPro item={plant} updateData={this.updateData}/>
						:
						<SoilCompAdd item={plant} updateData={this.updateData}/>
				}


				{/* location/date bought */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">Location & Date Bought</p>

				  <SwipePanelContent icon="locationBought">
					<p className="modern-input">
					  <label>location bought</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'locationBought')}
							 value={plant.locationBought || ''}/></p>
				  </SwipePanelContent>

				  {/*need to make this swipepanelcontent with the custom style*/}
				  <SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>date bought</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'dateBought')}
							 defaultValue={plant.dateBought || ''}/></p>
				  </SwipePanelContent>

				</div>


				{/* etc */}
				<div className="swipe-slide">
				  <p className="swipe-title title-ming">Etc</p>
				  <SwipePanelContent icon="category"
									 iconTitle={plant.category === 'potted' ? 'Date Potted' : 'Date Planted'}>
					<p className="modern-input">
					  <label>{plant.category === 'potted' ? 'date potted' : 'date planted'}</label>

					  <input type="date"
							 placeholder={plant.category === 'potted' ? 'Date Potted' : 'Date Planted'}
							 onBlur={(e) => this.updateData(e, 'datePlanted')}
							 defaultValue={plant.datePlanted || ''}/>
					</p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="plantLocation">
					<p className="modern-input">
					  <label>plant location *</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'location')}
							 value={plant.location || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="companions">
					<p className="modern-input">
					  <label>companion plants</label>
					  <input type="text"
							 onChange={(e) => this.updateData(e, 'companions')}
							 value={plant.companions || ''}/></p>
				  </SwipePanelContent>
				</div>

			  </SwipeableViews>


			  <div className="add-data flex-around bottom-nav">

				<FontAwesomeIcon icon={faTimes}
								 className="plant-condition-icon"
								 alt="times"
								 title="cancel"
								 onClick={() => this.setState({swipeViewIndex: this.state.swipeViewIndex - 1})}/>

				<FontAwesomeIcon icon={faSave}
								 className="plant-condition-icon"
								 alt="floppy disk"
								 title="save"
								 onClick={this.addNewPlant}/>
			  </div>


			  <Modal show={this.state.showDiaryModal}
					 onHide={() => this.setState({showDiaryModal: false})}
					 className="plant-view-data-modal">
				<Modal.Header closeButton>

				</Modal.Header>

				<Modal.Body>
				  Save new plant profile?
				</Modal.Body>

				<Modal.Footer>
				  <button onClick={() => this.setState({showDiaryModal: false})}
						  className="flat">
					Cancel
				  </button>

				  <button onClick={() => this.setState({showDiaryModal: false})}
						  className="flat">
					Save
				  </button>
				</Modal.Footer>
			  </Modal>
			</div>
	)
  }
}

export default PlantAdd;
