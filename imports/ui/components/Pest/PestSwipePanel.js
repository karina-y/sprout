import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import autobind from "react-autobind";
import "../PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getHighlightDates,
  getLastPestName,
  getLastPestTreatment,
  lastChecked,
  sortByLastDate,
} from "../../../utils/helpers/plantData";
import { toast } from "react-toastify";
import PestModals from "./PestModals";
import PestReadEdit from "./PestReadEdit";
import useNewData from "../../hooks/useNewData";

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/

const PestSwipePanel = (props) => {
  const plant = props.plant;
  const { newData, setNewData, changeNewData, addTrackerDate, addTrackerDetails } = useNewData({});
  let pestLastChecked = lastChecked(plant.pestTracker);
  let pestName = getLastPestName(plant.pestTracker);
  let pestTreatment = getLastPestTreatment(plant.pestTracker);

  const updatePlant = (type) => {
    console.log("profile", type);

    const newPlantData = newData;
    const oldPlantData = plant;

    if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
      toast.error("No data entered.");
    } else {
      //TODO abstract each of these cases out
      let data = {
        [type]: newPlantData[type],
      };

      if (data) {
        data._id = oldPlantData._id;

        Meteor.call("pest.update", type, data, (err, response) => {
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
      <PestReadEdit
        item={plant}
        updateData={changeNewData}
        pestLastChecked={pestLastChecked}
        pestName={pestName}
        pestTreatment={pestTreatment}
      />

      {/* pests */}
      <PestModals
        addTrackerDate={addTrackerDate}
        addTrackerDetails={addTrackerDetails}
        save={updatePlant}
        resetModal={resetData}
        modalOpen={props.modalOpen}
        newDataTracker={newData.pestTracker}
        tracker={plant.pestTracker}
        highlightDates={plant.highlightDates}
      />
    </div>
  );
};

PestSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
};

export default withTracker((props) => {
  // const id = props.match.params.id
  // const plant = Plant.findOne({_id: id})
  let plant = props.plant;

  //sort the data
  if (plant) {
    plant.pestTracker = sortByLastDate(plant.pestTracker);
    plant.highlightDates = getHighlightDates(plant.pestTracker);
  } else {
    plant = {
      pestTracker: null,
      highlightDates: null,
    };
  }

  return {
    plant,
  };
})(PestSwipePanel);
