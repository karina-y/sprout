import React from 'react'
import PropTypes from 'prop-types'
import './PlantTaskList.scss'
import ShadowBox from '../ShadowBox/ShadowBox'
import { ReactSVG } from 'react-svg'
import IconList from '/imports/utils/iconList'

function PlantTaskList (props) {
  const plant = props.plant

  return (
		  <button className="PlantTaskList naked"
				  onClick={() => props.history.push(`/catalogue/${plant._id}`)}>
			<ShadowBox additionalOuterClasses={plant.condition}
					   hoverAction={false}
					   popoutHover={false}
					   shadowLevel={2}>
			  <img src={plant.image}
				   alt={plant.latinName || plant.commonName}
				   title={plant.latinName || plant.commonName}/>

			  <div className="quick-details">
				<p>{plant.latinName || plant.commonName}</p>

				<div className="flex-evenly" style={{position: 'relative', padding: '10px 0'}}>

				  {plant.attentionNeeded.water &&
				  <ReactSVG src={IconList.water.icon}
							className="plant-condition-icon info"
							alt={IconList.water.alt}
							title="water needed"/>
				  }

				  {plant.attentionNeeded.fertilizer &&
				  <ReactSVG src={IconList.fertilizer.icon}
							className="plant-condition-icon warning"
							alt={IconList.fertilizer.alt}
							title="fertilizer needed"/>
				  }

				  {plant.attentionNeeded.pruning &&
				  <ReactSVG src={IconList.pruning.icon}
							className="plant-condition-icon success"
							alt={IconList.pruning.alt}
							title="pruning needed"/>
				  }

				  {plant.attentionNeeded.deadheading &&
				  <ReactSVG src={IconList.deadheading.icon}
							className="plant-condition-icon danger"
							alt={IconList.deadheading.alt}
							title="deadheading needed"/>
				  }
				</div>

			  </div>
			</ShadowBox>
		  </button>
  )
}

PlantTaskList.propTypes = {
  plant: PropTypes.object.isRequired
}

export default PlantTaskList
