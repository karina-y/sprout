import React from "react";
import PropTypes from "prop-types";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";

const PestReadEdit = (props) => {
  const { item, updateData, pestLastChecked, pestName, pestTreatment } = props;

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
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  pestLastChecked: PropTypes.string.isRequired,
  pestName: PropTypes.string.isRequired,
  pestTreatment: PropTypes.string.isRequired,
};

export default PestReadEdit;
