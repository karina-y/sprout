import React from "react";
import PropTypes from "prop-types";
import "./SwipePanelContent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactSVG } from "react-svg";
import { Icons } from "@constant";

const SwipePanelContent = (props) => {
  const { icon, iconTitle, children } = props;

  return (
    <div className="SwipePanelContent">
      <div className="icon-side">
        {!Icons[icon] ? (
          `COULD NOT FIND ${icon}`
        ) : Icons[icon].isCustom ? (
          <ReactSVG
            src={Icons[icon].icon}
            className="plant-condition-icon custom-icon warning"
            alt={Icons[icon].alt}
            title={iconTitle || Icons[icon].title}
          />
        ) : (
          <FontAwesomeIcon
            icon={Icons[icon].icon}
            className="plant-condition-icon"
            alt={Icons[icon].alt}
            title={iconTitle || Icons[icon].title}
          />
        )}
        {/*<span className="separator">|</span>*/}
      </div>

      <div className="info-side">{children}</div>
    </div>
  );
};

SwipePanelContent.propTypes = {
  icon: PropTypes.string.isRequired,
  iconTitle: PropTypes.string,
};

export default SwipePanelContent;
