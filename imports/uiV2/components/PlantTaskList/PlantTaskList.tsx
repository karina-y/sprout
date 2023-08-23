import React from "react";
import PropTypes from "prop-types";
import "./PlantTaskList.scss";
import { ShadowBox } from "@componentV2";
import { ReactSVG } from "react-svg";
import { Icons } from "@constantV2";

function PlantTaskList(props) {
  const plant = props.plant;

  return (
    <button
      className="PlantTaskList naked"
      onClick={() => props.history.push(`/plant/${plant._id}`)}
    >
      <ShadowBox
        additionalOuterClasses={plant.condition}
        hoverAction={false}
        popoutHover={false}
        shadowLevel={2}
      >
        <img
          src={plant.image}
          alt={plant.latinName || plant.commonName}
          title={plant.latinName || plant.commonName}
        />

        <div className="quick-details">
          <p>{plant.latinName || plant.commonName}</p>

          <div
            className="flex-evenly"
            style={{ position: "relative", padding: "10px 0" }}
          >
            {plant.attentionNeeded.water && (
              <ReactSVG
                src={Icons.water.icon}
                className="plant-condition-icon info"
                alt={Icons.water.alt}
                title="water needed"
              />
            )}

            {plant.attentionNeeded.fertilizer && (
              <ReactSVG
                src={Icons.fertilizer.icon}
                className="plant-condition-icon warning"
                alt={Icons.fertilizer.alt}
                title="fertilizer needed"
              />
            )}

            {plant.attentionNeeded.pruning && (
              <ReactSVG
                src={Icons.pruning.icon}
                className="plant-condition-icon success"
                alt={Icons.pruning.alt}
                title="pruning needed"
              />
            )}

            {plant.attentionNeeded.deadheading && (
              <ReactSVG
                src={Icons.deadheading.icon}
                className="plant-condition-icon danger"
                alt={Icons.deadheading.alt}
                title="deadheading needed"
              />
            )}
          </div>
        </div>
      </ShadowBox>
    </button>
  );
}

PlantTaskList.propTypes = {
  plant: PropTypes.object.isRequired,
};

export default PlantTaskList;
