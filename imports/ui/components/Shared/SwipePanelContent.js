import React from 'react';
import PropTypes from 'prop-types';
// import './SwipePanelContent.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SwipePanelContent = (props) => (
		<div className="detail-panel">
		  <div className="icon-side">
			<FontAwesomeIcon icon={props.icon}
							 className="plant-condition-icon"
							 alt={props.icon} />
			<span className="separator">|</span>
		  </div>

		  <div className="info-side">
			{props.children}
		  </div>
		</div>
);

SwipePanelContent.propTypes = {
  icon: PropTypes.object.isRequired,
}

export default SwipePanelContent;
