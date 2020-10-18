import React, { Component, useEffect } from 'react'
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import autobind from "react-autobind";
import "../PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getHighlightDates,
  getLastSoilMoisture,
  getLastSoilPh,
  lastChecked,
  sortByLastDate,
} from "../../../utils/helpers/plantData";
import { toast } from "react-toastify";
import SoilCompModals from "./SoilCompModals";
import SoilCompReadEdit from "./SoilCompReadEdit";
import SoilCompReadEditPro from "./SoilCompReadEditPro";
import useNewData from "../../hooks/useNewData";
import UpdateTypes from '../../../utils/constants/updateTypes'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/

const SoilCompSwipePanel = (props) => {
  const plant = props.plant;
  const soilCompLastChecked = lastChecked(plant.soilCompositionTracker);
  const soilPh = getLastSoilPh(plant.soilCompositionTracker);
  const soilMoisture = getLastSoilMoisture(plant.soilCompositionTracker);
  const { newData, setNewData, changeNewData, addTrackerDate, addTrackerDetails } = useNewData({});

  useEffect(() => {
    if (props.saving === `${UpdateTypes.soilComp.soilCompEditModal}-edit`) {
      updatePlant(`${UpdateTypes.soilComp.soilCompEditModal}-edit`);
    }
  }, [props]);

  const updatePlant = (type) => {
    const newPlantData = newData;
    const oldPlantData = props.plant;

    console.log("type", type)
    console.log("newPlantData", newPlantData)

    if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
      toast.error("No data entered.");
    } else {
      let data;

      if (type === UpdateTypes.soilComp.soilCompEditModal) {
        data = newPlantData;
      } else {
        if (props.category === "in-ground") {
          data = {
            soilAmendment: newPlantData.soilAmendment,
            soilType: newPlantData.soilType,
            tilled: newPlantData.tilled === "true",
          };
        } else {
          data = {
            soilRecipe: newPlantData.soilRecipe,
          };
        }
      }

      if (data) {
        data._id = oldPlantData._id;

        Meteor.call("soilComposition.update", type, data, props.category, (err, response) => {
          if (err) {
            toast.error(err.message);
          } else {
            toast.success("Successfully saved new entry.");

            //reset the data
            resetData();
          }
        });
      } else {
        toast.error("No data entered.");
      }
    }
  };

  const resetData = () => {
    setNewData({});
    props.exitEditMode();
  };

  return (
          <div className="PlantSeedlingViewEdit">
            {/* soil comp */}
            {Meteor.isPro ? (
                    <SoilCompReadEditPro
                            item={plant}
                            updateData={changeNewData}
                            soilCompLastChecked={soilCompLastChecked}
                            soilMoisture={soilMoisture}
                            soilPh={soilPh}
                            editing={props.editing}
                            category={props.category}
                    />
            ) : (
                    <SoilCompReadEdit
                            item={plant}
                            updateData={changeNewData}
                            soilCompLastChecked={soilCompLastChecked}
                            soilMoisture={soilMoisture}
                            soilPh={soilPh}
                            editing={props.editing}
                            category={props.category}
                    />
            )}

            {/* soil comp */}
            <SoilCompModals
                    addTrackerDetails={addTrackerDetails}
                    addTrackerDate={addTrackerDate}
                    save={updatePlant}
                    resetModal={resetData}
                    modalOpen={props.modalOpen}
                    newDataTracker={newData.soilCompositionTracker}
                    tracker={plant.soilCompositionTracker}
                    category={props.category}
                    highlightDates={plant.highlightDates}
            />
          </div>
  );
};

SoilCompSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  editing: PropTypes.string,
  modalOpen: PropTypes.string,
  exitEditMode: PropTypes.func.isRequired,
};

export default withTracker((props) => {
  let plant = props.plant;

  //sort the data
  if (plant) {
    plant.soilCompositionTracker = sortByLastDate(plant.soilCompositionTracker);
    plant.highlightDates = getHighlightDates(plant.soilCompositionTracker);

    if (props.category === 'potted') {
      plant.soilCompositionTracker = plant.soilCompositionTracker.filter(function( obj ) {
        return obj.moisture;
      });
    } else {
      plant.soilCompositionTracker = plant.soilCompositionTracker.filter(function( obj ) {
        return obj.ph;
      });
    }
  } else {
    plant = {
      soilCompositionTracker: null,
      highlightDates: null,
    };
  }

  return {
    plant
  };
})(SoilCompSwipePanel);
