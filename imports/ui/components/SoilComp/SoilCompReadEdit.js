import React from "react";
import PropTypes from "prop-types";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";

const SoilCompReadEdit = (props) => {
  const { soilCompLastChecked, soilMoisture, soilPh, category } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Soil Composition</p>

      <SwipePanelContent
        icon="schedule"
        iconTitle="last checked soil composition"
      >
        <p>{soilCompLastChecked}</p>
      </SwipePanelContent>

      {category === "in-ground" ? (
        <SwipePanelContent icon="soilMoisture">
          {soilMoisture ? (
            <p>Moisture Level {soilMoisture}</p>
          ) : (
            <p>No records available.</p>
          )}
        </SwipePanelContent>
      ) : (
        <SwipePanelContent icon="soilMoisture">
          {soilPh ? (
            <p>Soil pH {soilPh}</p>
          ) : (
            <p>No records available.</p>
          )}
        </SwipePanelContent>
      )}
    </div>
  );
};

SoilCompReadEdit.propTypes = {
  soilCompLastChecked: PropTypes.string.isRequired,
  soilMoisture: PropTypes.string.isRequired,
  soilPh: PropTypes.number.isRequired,
};

export default SoilCompReadEdit;
