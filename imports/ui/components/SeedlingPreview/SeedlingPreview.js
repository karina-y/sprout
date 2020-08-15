import React from 'react'
import PropTypes from 'prop-types'
import { withTracker } from 'meteor/react-meteor-data'
import './SeedlingPreview.scss'
import ShadowBox from '../ShadowBox/ShadowBox'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { getDaysSinceAction, getPlantCondition } from '/imports/utils/helpers/plantData'
import Icons from '/imports/utils/constants/icons'
import { ReactSVG } from 'react-svg'

const SeedlingPreview = (props) => (
		<button onClick={() => props.history.push(`/seedling/${props.seedling._id}`)} className="SeedlingPreview naked">
		  <ShadowBox additionalOuterClasses={props.seedling.condition}
					 hoverAction={false}
					 popoutHover={false}
					 shadowLevel={2}>
			<img src={props.seedling.image}
				 alt={props.seedling.latinName || props.seedling.commonName}
				 title={props.seedling.latinName || props.seedling.commonName}/>

			<div className="quick-details">
			  <p>{props.seedling.latinName || props.seedling.commonName}</p>

			  <div>
				<ReactSVG src={Icons.water.icon}
						  className="plant-condition-icon"
						  alt={Icons.water.alt}
						  title={Icons.water.title}/>

				<ProgressBar now={props.seedling.waterProgress === 0 ? 5 : props.seedling.waterProgress}
							 className={`water ${props.seedling.waterCondition}`}/>
			  </div>

			  <div>
				<ReactSVG src={Icons.fertilizer.icon}
						  className="plant-condition-icon fertilizer"
						  alt={Icons.fertilizer.alt}
						  title={Icons.fertilizer.title}/>
				<ProgressBar now={props.seedling.fertilizerProgress === 0 ? 5 : props.seedling.fertilizerProgress}
							 className={`fertilizer ${props.seedling.fertilizerCondition}`}/>
			  </div>

			</div>
		  </ShadowBox>
		</button>
)

SeedlingPreview.propTypes = {
  seedling: PropTypes.object.isRequired
}

export default withTracker((props) => {
  let seedling = props.seedling

  //TODO turn these into a hook
  if (seedling.fertilizerTracker && seedling.fertilizerTracker.length > 0) {
	seedling.daysSinceFertilized = getDaysSinceAction(seedling.fertilizerTracker)
	seedling.fertilizerCondition = getPlantCondition(seedling.fertilizerTracker, seedling.daysSinceFertilized, seedling.fertilizerSchedule)
	seedling.fertilizerProgress = (seedling.daysSinceFertilized / seedling.fertilizerSchedule) > 1 ? 5 : ((1 - (seedling.daysSinceFertilized / seedling.fertilizerSchedule)) * 100) || 5
  } else {
	seedling.fertilizerCondition = 'happy'
	seedling.fertilizerProgress = 100
  }

  if (seedling.waterTracker && seedling.waterTracker.length > 0) {
	seedling.daysSinceWatered = getDaysSinceAction(seedling.waterTracker)
	seedling.waterCondition = getPlantCondition(seedling.waterTracker, seedling.daysSinceWatered, seedling.waterSchedule)
	seedling.waterProgress = (seedling.daysSinceWatered / seedling.waterSchedule) > 1 ? 5 : ((1 - (seedling.daysSinceWatered / seedling.waterSchedule)) * 100) || 5
  } else {
	seedling.waterCondition = 'happy'
	seedling.waterProgress = 100
  }

  return {
	plant: seedling
  }
})(SeedlingPreview)
