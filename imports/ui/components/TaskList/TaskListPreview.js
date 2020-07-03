import React from 'react'
import PropTypes from 'prop-types'
import './TaskListPreview.scss'
import ShadowBox from '../ShadowBox/ShadowBox'
import { ReactSVG } from 'react-svg'
import IconList from '../../../utils/iconList'

function TaskListPreview (props) {
  const profile = props.profile

  return (
		  <button className="TaskListPreview naked"
				  onClick={() => props.history.push(`/catalogue/${props.profile._id}`)}>
			<ShadowBox additionalOuterClasses={profile.condition}
					   hoverAction={false}
					   popoutHover={false}
					   shadowLevel={2}>
			  <img src={profile.image}
				   alt={profile.latinName || profile.commonName}
				   title={profile.latinName || profile.commonName}/>

			  <div className="quick-details">
				<p>{profile.latinName || profile.commonName}</p>

				<div className="flex-evenly" style={{position: 'relative', padding: '10px 0'}}>

				  {profile.attentionNeeded.water &&
				  <ReactSVG src={IconList.water.icon}
							className="plant-condition-icon info"
							alt={IconList.water.alt}
							title="water needed"/>
				  }

				  {profile.attentionNeeded.fertilizer &&
				  <ReactSVG src={IconList.fertilizer.icon}
							className="plant-condition-icon warning"
							alt={IconList.fertilizer.alt}
							title="fertilizer needed"/>
				  }

				  {profile.attentionNeeded.pruning &&
				  <ReactSVG src={IconList.pruning.icon}
							className="plant-condition-icon success"
							alt={IconList.pruning.alt}
							title="pruning needed"/>
				  }

				  {profile.attentionNeeded.deadheading &&
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

TaskListPreview.propTypes = {
  profile: PropTypes.object.isRequired
}

export default TaskListPreview
