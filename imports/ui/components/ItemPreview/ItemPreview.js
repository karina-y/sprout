import React from 'react'
import PropTypes from 'prop-types'
import { withTracker } from 'meteor/react-meteor-data'
import './ItemPreview.scss'
import ShadowBox from '../ShadowBox/ShadowBox'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { getDaysSinceAction, getPlantCondition } from '/imports/utils/plantData'
import IconList from '/imports/utils/iconList'
import { ReactSVG } from 'react-svg'

const ItemPreview = (props) => (
		<button onClick={() => props.history.push(`/${props.type}/${props.item._id}`)} className="ItemPreview naked">
		  <ShadowBox additionalOuterClasses={props.item.condition}
					 hoverAction={false}
					 popoutHover={false}
					 shadowLevel={2}>
			<img src={props.item.image}
				 alt={props.item.latinName || props.item.commonName}
				 title={props.item.latinName || props.item.commonName}/>

			<div className="quick-details">
			  <p>{props.item.latinName || props.item.commonName}</p>

			  <div>
				<ReactSVG src={IconList.water.icon}
						  className="plant-condition-icon"
						  alt={IconList.water.alt}
						  title={IconList.water.title}/>

				<ProgressBar now={props.item.waterProgress === 0 ? 5 : props.item.waterProgress}
							 className={`water ${props.item.waterCondition}`}/>
			  </div>

			  <div>
				<ReactSVG src={IconList.fertilizer.icon}
						  className="plant-condition-icon fertilizer"
						  alt={IconList.fertilizer.alt}
						  title={IconList.fertilizer.title}/>
				<ProgressBar now={props.item.fertilizerProgress === 0 ? 5 : props.item.fertilizerProgress}
							 className={`fertilizer ${props.item.fertilizerCondition}`}/>
			  </div>

			</div>
		  </ShadowBox>
		</button>
)

ItemPreview.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}

export default withTracker((props) => {
  const type = props.match.params.type;
  let item = props.item;

  //TODO turn these into a hook
  if (item.fertilizerTracker && item.fertilizerTracker.length > 0) {
	item.daysSinceFertilized = getDaysSinceAction(item.fertilizerTracker)
	item.fertilizerCondition = getPlantCondition(item.fertilizerTracker, item.daysSinceFertilized, item.fertilizerSchedule)
	item.fertilizerProgress = (item.daysSinceFertilized / item.fertilizerSchedule) > 1 ? 5 : ((1 - (item.daysSinceFertilized / item.fertilizerSchedule)) * 100) || 5
  } else {
	item.fertilizerCondition = 'happy'
	item.fertilizerProgress = 100
  }

	if (item.waterTracker && item.waterTracker.length > 0) {
	  item.daysSinceWatered = getDaysSinceAction(item.waterTracker)
	  item.waterCondition = item.waterScheduleAuto ? 'happy' : getPlantCondition(item.waterTracker, item.daysSinceWatered, item.waterSchedule)
	  item.waterProgress = item.waterScheduleAuto ? 100 : (item.daysSinceWatered / item.waterSchedule) > 1 ? 5 : ((1 - (item.daysSinceWatered / item.waterSchedule)) * 100) || 5
	} else {
	  item.waterCondition = 'happy'
	  item.waterProgress = 100
	}


  return {
	item,
	type
  }
})(ItemPreview)
