import React, { useEffect } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getHighlightDates,
  getLastSoilMoisture,
  getLastSoilPh,
  lastChecked,
  sortByLastDate,
} from "@helper";
import { toast } from "react-toastify";
import {
  SoilCompModals,
  SoilCompReadEdit,
  SoilCompReadEditPro,
} from "@component";
import { useNewData } from "@hook";
import { UpdateTypes } from "@constant";
import { SoilComposition } from "@api";

const SoilCompSwipePanel = (props) => {
  const soilComp = props.soilComp;
  const soilCompLastChecked = lastChecked(soilComp.soilCompositionTracker);
  const soilPh = getLastSoilPh(soilComp.soilCompositionTracker);
  const soilMoisture = getLastSoilMoisture(soilComp.soilCompositionTracker);
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
    const oldPlantData = soilComp;

    if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
      toast.error("No data entered.");
      return;
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
        //todo no id
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
          item={soilComp}
          updateData={changeNewData}
          soilCompLastChecked={soilCompLastChecked}
          soilMoisture={soilMoisture}
          soilPh={soilPh}
          category={props.category}
        />
      ) : (
        <SoilCompReadEdit
          item={soilComp}
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
        tracker={soilComp.soilCompositionTracker}
        category={props.category}
        highlightDates={soilComp.highlightDates}
      />
    </div>
  );
};

SoilCompSwipePanel.propTypes = {
  soilComp: PropTypes.object.isRequired,
  exitEditMode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  savingType: PropTypes.string,
};

export default withTracker((props) => {
  const savingType = Session.get("savingType");
  let soilComp = SoilComposition.findOne({ plantId: props.id }) || {};

  //sort the data
  if (soilComp) {
    soilComp.soilCompositionTracker = sortByLastDate(
      soilComp.soilCompositionTracker
    );
    soilComp.highlightDates = getHighlightDates(
      soilComp.soilCompositionTracker
    );

    //filtering so we only show the values necessary on the calendar (just in case the user changes the category)
    if (props.category === "potted") {
      soilComp.soilCompositionTracker = soilComp.soilCompositionTracker.filter(
        function (obj) {
          return obj.moisture;
        }
      );
    } else {
      soilComp.soilCompositionTracker = soilComp.soilCompositionTracker.filter(
        function (obj) {
          return obj.ph;
        }
      );
    }
  } else {
    soilComp = {
      soilCompositionTracker: null,
      highlightDates: null,
    };
  }

  return {
    soilComp,
    savingType,
  };
})(SoilCompSwipePanel);
