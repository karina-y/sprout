import React, { useEffect } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import { getHighlightDates, sortByLastDate } from "@helper";
import { toast } from "react-toastify";
import {
  PruningDeadheadingModals,
  PruningDeadheadingReadEditPro,
} from "@component";
import { useNewData, usePruneType } from "@hook";
import { UpdateTypes } from "@constant";
import { PruningDeadheading } from "@api";

const PruningDeadheadingSwipePanel = (props) => {
  const pruningDeadheading = props.pruningDeadheading;
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
    const oldPlantData = pruningDeadheading;

    //todo these are actually stored separately in the db, but for ease for the user they're in one view
    /*if (type === "pruningDeadheadingTracker") {
      type = pruneType;
    }*/

    if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
      toast.error("No data entered.");
      return;
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
      <PruningDeadheadingReadEditPro
        plant={pruningDeadheading}
        updateData={changeNewData}
      />

      {/* pruning */}
      <PruningDeadheadingModals
        addTrackerDate={addTrackerDate}
        addTrackerDetails={addTrackerDetails}
        save={updatePlant}
        resetModal={resetData}
        newDataTracker={newData.pruningDeadheadingTracker}
        tracker={pruningDeadheading.pruningDeadheadingTracker}
        highlightDates={pruningDeadheading.highlightDates}
        pruneType={pruneType}
        setPruneType={(val) => setPruneType(val)}
      />
      {/* TODO setPruneType above*/}
    </div>
  );
};

PruningDeadheadingSwipePanel.propTypes = {
  pruningDeadheading: PropTypes.object.isRequired,
  exitEditMode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  savingType: PropTypes.string,
};

export default withTracker((props) => {
  const savingType = Session.get("savingType");
  let pruningDeadheading =
    PruningDeadheading.findOne({ plantId: props.id }) || {};

  if (
    pruningDeadheading.pruningTracker ||
    pruningDeadheading.deadheadingTracker
  ) {
    const pruning = pruningDeadheading.pruningTracker || [];
    const deadheading = pruningDeadheading.deadheadingTracker || [];

    for (let i = 0; i < pruning.length; i++) {
      pruning[i].action = "Pruned";
    }

    for (let i = 0; i < deadheading.length; i++) {
      deadheading[i].action = "Deadheaded";
    }

    pruningDeadheading.pruningDeadheadingTracker = sortByLastDate(
      pruning.concat(deadheading)
    );

    pruningDeadheading.highlightDates = getHighlightDates(
      pruningDeadheading.pruningDeadheadingTracker
    );
  } else {
    pruningDeadheading.pruningDeadheadingTracker = null;
  }

  return {
    pruningDeadheading,
    savingType,
  };
})(PruningDeadheadingSwipePanel);
