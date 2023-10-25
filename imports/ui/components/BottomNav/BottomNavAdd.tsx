import React from "react";
import PropTypes from "prop-types";
import "./BottomNav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { faSave } from "@fortawesome/free-solid-svg-icons/faSave";
import { RouteComponentPropsCustom } from "@type";

interface IBottomNavAddProps extends RouteComponentPropsCustom {
  cancel: () => void;
  add: () => void;
}

const BottomNavAdd = (props: IBottomNavAddProps) => {
  const { cancel, add } = props;

  return (
    <div className="BottomNav add-data flex-around">
      <FontAwesomeIcon
        icon={faTimes}
        className="plant-condition-icon"
        title="cancel"
        onClick={cancel}
      />

      <FontAwesomeIcon
        icon={faSave}
        className="plant-condition-icon"
        title="save"
        onClick={add}
      />
    </div>
  );
};

BottomNavAdd.propTypes = {
  cancel: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
};

export default BottomNavAdd;
