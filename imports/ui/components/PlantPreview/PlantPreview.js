import React from 'react'
import PropTypes from 'prop-types'
import { withTracker } from 'meteor/react-meteor-data'
import './PlantPreview.scss'
import ShadowBox from '../ShadowBox/ShadowBox'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { getDaysSinceAction, getPlantCondition } from '/imports/utils/plantData'
import IconList from '/imports/utils/iconList'
import { ReactSVG } from 'react-svg'

const PlantPreview = (props) => (
		<button onClick={() => props.history.push(`/catalogue/${props.plant._id}`)} className="PlantPreview naked">
		  <ShadowBox additionalOuterClasses={props.plant.condition}
					 hoverAction={false}
					 popoutHover={false}
					 shadowLevel={2}>
			<img src={props.plant.image}
				 alt={props.plant.latinName || props.plant.commonName}
				 title={props.plant.latinName || props.plant.commonName}/>

			<div className="quick-details">
			  <p>{props.plant.latinName || props.plant.commonName}</p>

			  <div>
				<ReactSVG src={IconList.water.icon}
						  className="plant-condition-icon"
						  alt={IconList.water.alt}
						  title={IconList.water.title}/>

				<ProgressBar now={props.plant.waterProgress === 0 ? 5 : props.plant.waterProgress}
							 className={`water ${props.plant.waterCondition}`}/>
			  </div>

			  <div>
				<ReactSVG src={IconList.fertilizer.icon}
						  className="plant-condition-icon fertilizer"
						  alt={IconList.fertilizer.alt}
						  title={IconList.fertilizer.title}/>
				<ProgressBar now={props.plant.fertilizerProgress === 0 ? 5 : props.plant.fertilizerProgress}
							 className={`fertilizer ${props.plant.fertilizerCondition}`}/>
			  </div>

			</div>
		  </ShadowBox>
		</button>
)

PlantPreview.propTypes = {
  plant: PropTypes.object.isRequired
}

export default withTracker((props) => {
  let plant = props.plant

  //TODO turn these into a hook
  if (plant.fertilizerTracker && plant.fertilizerTracker.length > 0) {
	plant.daysSinceFertilized = getDaysSinceAction(plant.fertilizerTracker)
	plant.fertilizerCondition = getPlantCondition(plant.fertilizerTracker, plant.daysSinceFertilized, plant.fertilizerSchedule)
	plant.fertilizerProgress = (plant.daysSinceFertilized / plant.fertilizerSchedule) > 1 ? 5 : ((1 - (plant.daysSinceFertilized / plant.fertilizerSchedule)) * 100) || 5
  } else {
	plant.fertilizerCondition = 'happy'
	plant.fertilizerProgress = 100
  }

  if (plant.waterTracker && plant.waterTracker.length > 0) {
	plant.daysSinceWatered = getDaysSinceAction(plant.waterTracker)
	plant.waterCondition = plant.waterScheduleAuto ? 'happy' : getPlantCondition(plant.waterTracker, plant.daysSinceWatered, plant.waterSchedule)
	plant.waterProgress = plant.waterScheduleAuto ? 100 : (plant.daysSinceWatered / plant.waterSchedule) > 1 ? 5 : ((1 - (plant.daysSinceWatered / plant.waterSchedule)) * 100) || 5
  } else {
	plant.waterCondition = 'happy'
	plant.waterProgress = 100
  }

  return {
	plant
  }
})(PlantPreview)
