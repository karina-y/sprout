import React, { useEffect } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "../PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getDaysSinceAction,
  getHighlightDates,
  getPlantCondition,
  lastFertilizerUsed,
  sortByLastDate,
} from "/imports/utils/helpers/plantData";
import { toast } from "react-toastify";
import FertilizerModals from "./FertilizerModals";
import FertilizerReadEdit from "./FertilizerReadEdit";
import FertilizerReadEditPro from "./FertilizerReadEditPro";
import useNewData from "../../hooks/useNewData";
import UpdateTypes from "/imports/utils/constants/updateTypes";

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/

const FertilizerSwipePanel = (props) => {
  const plant = props.plant;
  const fertilizerContent = lastFertilizerUsed(plant.fertilizerTracker);
  const {
    newData,
    setNewData,
    changeNewData,
    addTrackerDate,
    addTrackerDetails,
  } = useNewData({});

  useEffect(() => {
    if (props.savingType === `${UpdateTypes.fertilizer.fertilizerEditModal}-edit`) {
      updatePlant(`${UpdateTypes.fertilizer.fertilizerEditModal}-edit`);
    }
  }, [props]);

  const updatePlant = (type) => {
    const newPlantData = newData;
    const oldPlantData = props.plant;
    let data;

    console.log("newPlantData", newPlantData);

    if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
      toast.error("No data entered.");
    } else if (type === UpdateTypes.fertilizer.fertilizerEditModal) {
      data = {
        fertilizerTracker: newPlantData.fertilizerTracker,
      };
    } else {
      //TODO abstract each of these cases out
      data = {
        fertilizerSchedule:
          newPlantData.fertilizerSchedule === "" &&
          oldPlantData.fertilizerSchedule > 0
            ? null
            : newPlantData.fertilizerSchedule || oldPlantData.fertilizerSchedule
            ? parseInt(
                newPlantData.fertilizerSchedule ||
                  oldPlantData.fertilizerSchedule
              )
            : newPlantData.fertilizerSchedule ||
              oldPlantData.fertilizerSchedule,
        preferredFertilizer: newPlantData.preferredFertilizer,
        compost: newPlantData.compost,
        nutrient: newPlantData.nutrient,
      };
    }

    if (data) {
      data._id = oldPlantData._id;

      Meteor.call("fertilizer.update", type, data, (err, response) => {
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
  };

  const resetData = () => {
    setNewData({});

    props.exitEditMode();
  };

  return (
    <div className="PlantSeedlingViewEdit">
      {Meteor.isPro ? (
        <FertilizerReadEditPro
          item={plant}
          updateData={changeNewData}
          fertilizerContent={fertilizerContent}
        />
      ) : (
        <FertilizerReadEdit
          item={plant}
          updateData={changeNewData}
          fertilizerContent={fertilizerContent}
        />
      )}

      {/* modals */}
      <FertilizerModals
        addTrackerDate={addTrackerDate}
        addTrackerDetails={addTrackerDetails}
        save={updatePlant}
        resetModal={resetData}
        newDataTracker={newData.fertilizerTracker}
        tracker={plant.fertilizerTracker}
        highlightDates={plant.highlightDates}
      />
    </div>
  );
};

FertilizerSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  exitEditMode: PropTypes.func.isRequired,
  savingType: PropTypes.string
};

export default withTracker((props) => {
  const savingType = Session.get("savingType");

  // const id = props.match.params.id;
  // let plant = Plant.findOne({ _id: id });
  let plant = props.plant;

  //sort the data
  plant.fertilizerTracker = sortByLastDate(plant.fertilizerTracker);

  plant.daysSinceFertilized = getDaysSinceAction(plant.fertilizerTracker);
  plant.fertilizerCondition = getPlantCondition(
    plant.fertilizerTracker,
    plant.daysSinceFertilized,
    plant.fertilizerSchedule
  );
  plant.highlightDates = getHighlightDates(plant.fertilizerTracker);

  return {
    plant,
    savingType
  };
})(FertilizerSwipePanel);
