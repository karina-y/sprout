import React from 'react'
import PropTypes from 'prop-types'
import './SwipePanelContent.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactSVG } from 'react-svg'
import IconList from '../../../utils/iconList'

const SwipePanelContent = (props) => (
		<div className="SwipePanelContent">
		  <div className="icon-side">
			{!IconList[props.icon] ? `COULD NOT FIND ${props.icon}` :
			  IconList[props.icon].isCustom ?
					<ReactSVG src={IconList[props.icon].icon}
							  className="plant-condition-icon custom-icon warning"
							  alt={IconList[props.icon].alt}
							  title={props.iconTitle || IconList[props.icon].title}/>
					:
					<FontAwesomeIcon icon={IconList[props.icon].icon}
									 className="plant-condition-icon"
									 alt={IconList[props.icon].alt}
									 title={props.iconTitle || IconList[props.icon].title}/>
			}
			{/*<span className="separator">|</span>*/}
		  </div>

		  <div className="info-side">
			{props.children}
		  </div>
		</div>
)

SwipePanelContent.propTypes = {
  icon: PropTypes.string.isRequired
}

export default SwipePanelContent
