import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getHighlightDates,
  getLastPestName,
  getLastPestTreatment,
  lastChecked,
  sortByLastDate,
} from "@helper";
import { toast } from "react-toastify";
import { PestModals, PestReadEdit } from "@component";
import { useNewData } from "@hook";
import { Pest } from "@api";

const PestSwipePanel = (props) => {
  const pest = props.pest;
  const {
    newData,
    setNewData,
    changeNewData,
    addTrackerDate,
    addTrackerDetails,
  } = useNewData({});
  let pestLastChecked = lastChecked(pest.pestTracker);
  let pestName = getLastPestName(pest.pestTracker);
  let pestTreatment = getLastPestTreatment(pest.pestTracker);

  const updatePlant = (type) => {
    const newPlantData = newData;
    const oldPlantData = pest;

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
        newDataTracker={newData.pestTracker}
        tracker={pest.pestTracker}
        highlightDates={pest.highlightDates}
      />
    </div>
  );
};

PestSwipePanel.propTypes = {
  pest: PropTypes.object.isRequired,
};

export default withTracker((props) => {
  let pest = Pest.findOne({ plantId: props.id }) || {};

  //sort the data
  if (pest) {
    pest.pestTracker = sortByLastDate(pest.pestTracker);
    pest.highlightDates = getHighlightDates(pest.pestTracker);
  } else {
    pest = {
      pestTracker: null,
      highlightDates: null,
    };
  }

  return {
    pest,
  };
})(PestSwipePanel);
