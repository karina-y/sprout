import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { RouteComponentPropsCustom } from "@type";
import { Categories } from "@enum";

interface ISoilCompReadEditProps extends RouteComponentPropsCustom {
  soilCompLastChecked: string;
  soilMoisture?: string;
  soilPh?: number;
  category: Categories;
}

//TODO the non-pro version shouldn't get an edit button in the bottom nav bar
const SoilCompReadEdit = (props: ISoilCompReadEditProps) => {
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
          {soilPh ? <p>Soil pH {soilPh}</p> : <p>No records available.</p>}
        </SwipePanelContent>
      )}
    </div>
  );
};

SoilCompReadEdit.propTypes = {
  soilCompLastChecked: PropTypes.string.isRequired,
  soilMoisture: PropTypes.string,
  soilPh: PropTypes.number,
  category: PropTypes.string.isRequired, //TODO is this required correct?
};

export default SoilCompReadEdit;
