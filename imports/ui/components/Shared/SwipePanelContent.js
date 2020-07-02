import React from 'react'
import PropTypes from 'prop-types'
import './SwipePanelContent.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SwipePanelContent = (props) => (
		<div className="SwipePanelContent">
		  <div className="icon-side">
			<FontAwesomeIcon icon={props.icon}
							 className="plant-condition-icon"
							 alt={props.iconAlt}
							 title={props.iconTitle}/>
			<span className="separator">|</span>
		  </div>

		  <div className="info-side">
			{props.children}
		  </div>
		</div>
)

SwipePanelContent.propTypes = {
  icon: PropTypes.object.isRequired,
  iconAlt: PropTypes.string.isRequired,
  iconTitle: PropTypes.string.isRequired,
}

export default SwipePanelContent
