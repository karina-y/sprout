import React, { Component, useEffect } from "react";
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
} from "/imports/utils/helpers/plantData";
import { toast } from "react-toastify";
import SoilCompModals from "./SoilCompModals";
import SoilCompReadEdit from "./SoilCompReadEdit";
import SoilCompReadEditPro from "./SoilCompReadEditPro";
import useNewData from "../../hooks/useNewData";
import UpdateTypes from "/imports/utils/constants/updateTypes";

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
  const {
    newData,
    setNewData,
    changeNewData,
    addTrackerDate,
    addTrackerDetails,
  } = useNewData({});

  useEffect(() => {
    if (props.savingType === `${UpdateTypes.soilComp.soilCompEditModal}-edit`) {
      updatePlant(`${UpdateTypes.soilComp.soilCompEditModal}-edit`);
    }
  }, [props]);

  const updatePlant = (type) => {
    const newPlantData = newData;
    const oldPlantData = props.plant;

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

        Meteor.call(
          "soilComposition.update",
          type,
          data,
          props.category,
          (err, response) => {
            if (err) {
              toast.error(err.message);
            } else {
              toast.success("Successfully saved new entry.");

              //reset the data
              resetData();
            }
          }
        );
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
          category={props.category}
        />
      ) : (
        <SoilCompReadEdit
          item={plant}
          updateData={changeNewData}
          soilCompLastChecked={soilCompLastChecked}
          soilMoisture={soilMoisture}
          soilPh={soilPh}
          category={props.category}
        />
      )}

      {/* soil comp */}
      <SoilCompModals
        addTrackerDetails={addTrackerDetails}
        addTrackerDate={addTrackerDate}
        save={updatePlant}
        resetModal={resetData}
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
  exitEditMode: PropTypes.func.isRequired,
  savingType: PropTypes.string
};

export default withTracker((props) => {
  const savingType = Session.get("savingType");
  let plant = props.plant;

  //sort the data
  if (plant) {
    plant.soilCompositionTracker = sortByLastDate(plant.soilCompositionTracker);
    plant.highlightDates = getHighlightDates(plant.soilCompositionTracker);

    //filtering so we only show the values necessary on the calendar (just in case the user changes the category)
    if (props.category === "potted") {
      plant.soilCompositionTracker = plant.soilCompositionTracker.filter(
        function (obj) {
          return obj.moisture;
        }
      );
    } else {
      plant.soilCompositionTracker = plant.soilCompositionTracker.filter(
        function (obj) {
          return obj.ph;
        }
      );
    }
  } else {
    plant = {
      soilCompositionTracker: null,
      highlightDates: null,
    };
  }

  return {
    plant,
    savingType,
  };
})(SoilCompSwipePanel);
