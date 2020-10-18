import React from "react";
import PropTypes from "prop-types";
import "./SwipePanelContent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactSVG } from "react-svg";
import Icons from "/imports/utils/constants/icons";

const SwipePanelContent = (props) => (
  <div className="SwipePanelContent">
    <div className="icon-side">
      {!Icons[props.icon] ? (
        `COULD NOT FIND ${props.icon}`
      ) : Icons[props.icon].isCustom ? (
        <ReactSVG
          src={Icons[props.icon].icon}
          className="plant-condition-icon custom-icon warning"
          alt={Icons[props.icon].alt}
          title={props.iconTitle || Icons[props.icon].title}
        />
      ) : (
        <FontAwesomeIcon
          icon={Icons[props.icon].icon}
          className="plant-condition-icon"
          alt={Icons[props.icon].alt}
          title={props.iconTitle || Icons[props.icon].title}
        />
      )}
      {/*<span className="separator">|</span>*/}
    </div>

    <div className="info-side">{props.children}</div>
  </div>
);

SwipePanelContent.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default SwipePanelContent;
