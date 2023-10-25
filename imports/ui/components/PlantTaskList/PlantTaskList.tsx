import React from "react";
import PropTypes from "prop-types";
import "./PlantTaskList.scss";
import { ShadowBox } from "@component";
import { ReactSVG } from "react-svg";
import { Icons } from "@constant";
import { RouteComponentPropsCustom } from "@type";
import { IPlantSchema, IPlantStats } from "@model";
import { useNavigate } from "react-router";

interface IPlantTaskListProps extends RouteComponentPropsCustom {
  plant: IPlantSchema;
  plantStats: IPlantStats; //TODO do i need this?
  attentionNeeded: {
    water: boolean;
    fertilizer: boolean;
    pruning: boolean;
    deadheading: boolean;
  }; //TODO type
}

function PlantTaskList(props: IPlantTaskListProps) {
  const navigate = useNavigate();
  const { plant, plantStats, attentionNeeded } = props;

  return (
    <button
      className="PlantTaskList naked"
      /*
      //@ts-ignore */
      onClick={() => navigate(`/plant/${plant._id}`)}
    >
      <ShadowBox
        additionalOuterClasses={plantStats.condition}
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
            {attentionNeeded?.water && (
              <ReactSVG
                /*
                //@ts-ignore */
                src={Icons.water.icon}
                className="plant-condition-icon info"
                alt={Icons.water.alt}
                title="water needed"
              />
            )}

            {attentionNeeded?.fertilizer && (
              <ReactSVG
                /*
                //@ts-ignore */
                src={Icons.fertilizer.icon}
                className="plant-condition-icon warning"
                alt={Icons.fertilizer.alt}
                title="fertilizer needed"
              />
            )}

            {attentionNeeded?.pruning && (
              <ReactSVG
                /*
                //@ts-ignore */
                src={Icons.pruning.icon}
                className="plant-condition-icon success"
                alt={Icons.pruning.alt}
                title="pruning needed"
              />
            )}

            {attentionNeeded?.deadheading && (
              <ReactSVG
                /*
                //@ts-ignore */
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
