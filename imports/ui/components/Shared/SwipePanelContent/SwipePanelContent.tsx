import React, { ReactElement } from "react";
import PropTypes from "prop-types";
import "./SwipePanelContent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactSVG } from "react-svg";
import { Icons } from "@constant";

interface ISwipePanelContentProps {
  icon: string;
  iconTitle?: string;
  children: ReactElement | Array<ReactElement>; // TODO confirm this is right or ReactNode?
}

const SwipePanelContent = (props: ISwipePanelContentProps) => {
  const { icon, iconTitle, children } = props;

  return (
    <div className="SwipePanelContent">
      <div className="icon-side">
        {!Icons[icon] ? (
          `COULD NOT FIND ${icon}`
        ) : Icons[icon].isCustom ? (
          <ReactSVG
            /*
            // @ts-ignore */
            src={Icons[icon].icon}
            className="plant-condition-icon custom-icon warning"
            alt={Icons[icon].alt}
            title={iconTitle || Icons[icon].title}
          />
        ) : (
          <FontAwesomeIcon
            /*
            // @ts-ignore */
            icon={Icons[icon].icon}
            className="plant-condition-icon"
            /*
            // @ts-ignore */
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
