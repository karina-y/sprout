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
import PruningDeadheadingModals from "./PruningDeadheadingModals";
import PruningDeadheadingReadEditPro from "./PruningDeadheadingReadEditPro";
import useNewData from "../../hooks/useNewData";
import usePruneType from "../../hooks/usePruneType";
import UpdateTypes from "/imports/utils/constants/updateTypes";

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/

const PruningDeadheadingSwipePanel = (props) => {
  const plant = props.plant;
  const {
    newData,
    setNewData,
    changeNewData,
    addTrackerDate,
    addTrackerDetails,
  } = useNewData({});
  const { pruneType, setPruneType } = usePruneType(null);

  useEffect(() => {
    if (
      props.savingType ===
      `${UpdateTypes.pruningDeadheading.pruningDeadheadingEditModal}-edit`
    ) {
      updatePlant(
        `${UpdateTypes.pruningDeadheading.pruningDeadheadingEditModal}-edit`
      );
    }
  }, [props]);

  const updatePlant = (type) => {
    const newPlantData = newData;
    const oldPlantData = props.plant;

    //these are actually stored separately in the db, but for ease for the user they're in one view
    /*if (type === "pruningDeadheadingTracker") {
      type = pruneType;
    }*/

    if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
      toast.error("No data entered.");
    } else {
      let data;

      if (type === UpdateTypes.pruningDeadheading.pruningDeadheadingEditModal) {
        data = {
          pruningTracker: newPlantData.pruningTracker,
          deadheadingTracker: newPlantData.deadheadingTracker,
        };
      } else {
        data = {
          pruningPreference:
            newPlantData.pruningPreference || oldPlantData.pruningPreference,
          deadheadingPreference:
            newPlantData.deadheadingPreference ||
            oldPlantData.deadheadingPreference,
        };
      }

      if (data) {
        data._id = oldPlantData._id;

        Meteor.call(
          "pruningDeadheading.update",
          type,
          data,
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
    setPruneType(null);
    props.exitEditMode();
  };

  return (
    <div className="PlantSeedlingViewEdit">
      <PruningDeadheadingReadEditPro plant={plant} updateData={changeNewData} />

      {/* pruning */}
      <PruningDeadheadingModals
        addTrackerDate={addTrackerDate}
        addTrackerDetails={addTrackerDetails}
        save={updatePlant}
        resetModal={resetData}
        newDataTracker={newData.pruningDeadheadingTracker}
        tracker={plant.pruningDeadheadingTracker}
        highlightDates={plant.highlightDates}
        pruneType={pruneType}
        setPruneType={(val) => setPruneType(val)}
      />
      {/* TODO setPruneType above*/}
    </div>
  );
};

PruningDeadheadingSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  exitEditMode: PropTypes.func.isRequired,
  savingType: PropTypes.string
};

export default withTracker((props) => {
  const savingType = Session.get("savingType");

  // const id = props.match.params.id
  // const plant = Plant.findOne({_id: id})
  let plant = props.plant;

  if (plant.pruningTracker || plant.deadheadingTracker) {
    const pruning = plant.pruningTracker || [];
    const deadheading = plant.deadheadingTracker || [];

    for (let i = 0; i < pruning.length; i++) {
      pruning[i].action = "Pruned";
    }

    for (let i = 0; i < deadheading.length; i++) {
      deadheading[i].action = "Deadheaded";
    }

    plant.pruningDeadheadingTracker = sortByLastDate(
      pruning.concat(deadheading)
    );
    plant.highlightDates = getHighlightDates(plant.pruningDeadheadingTracker);
  } else {
    plant.pruningDeadheadingTracker = null;
  }

  return {
    plant,
    savingType,
  };
})(PruningDeadheadingSwipePanel);
