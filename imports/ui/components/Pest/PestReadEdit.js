import React from "react";
import PropTypes from "prop-types";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";

//todo change this name? it's read only
const PestReadEdit = (props) => {
  const { pestLastChecked, pestName, pestTreatment } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Pests</p>

      <SwipePanelContent icon="schedule" iconTitle="last checked for pests">
        <p>{pestLastChecked}</p>
      </SwipePanelContent>

      {pestName && (
        <SwipePanelContent icon="pest">
          <p>{pestName}</p>
        </SwipePanelContent>
      )}

      {pestTreatment && (
        <SwipePanelContent icon="pestTreatment">
          <p>{pestTreatment}</p>
        </SwipePanelContent>
      )}
    </div>
  );
};

PestReadEdit.propTypes = {
  pestLastChecked: PropTypes.string.isRequired,
  pestName: PropTypes.string.isRequired,
  pestTreatment: PropTypes.string.isRequired,
};

export default PestReadEdit;
