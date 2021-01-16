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
import useNewData from "/imports/ui/hooks/useNewData";
import UpdateTypes from "/imports/utils/constants/updateTypes";
import Fertilizer from "/imports/api/Fertilizer/Fertilizer";

const FertilizerSwipePanel = (props) => {
  const fertilizer = props.fertilizer;
  const fertilizerContent = lastFertilizerUsed(fertilizer.fertilizerTracker);
  const {
    newData,
    setNewData,
    changeNewData,
    addTrackerDate,
    addTrackerDetails,
  } = useNewData({});

  useEffect(() => {
    if (
      props.savingType === `${UpdateTypes.fertilizer.fertilizerEditModal}-edit`
    ) {
      updatePlant(`${UpdateTypes.fertilizer.fertilizerEditModal}-edit`);
    }
  }, [props]);

  const updatePlant = (type) => {
    const newPlantData = newData;
    const oldPlantData = fertilizer;
    let data;

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
          item={fertilizer}
          updateData={changeNewData}
          fertilizerContent={fertilizerContent}
        />
      ) : (
        <FertilizerReadEdit
          item={fertilizer}
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
        tracker={fertilizer.fertilizerTracker}
        highlightDates={fertilizer.highlightDates}
      />
    </div>
  );
};

FertilizerSwipePanel.propTypes = {
  fertilizer: PropTypes.object.isRequired,
  exitEditMode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  savingType: PropTypes.string,
};

export default withTracker((props) => {
  const savingType = Session.get("savingType");
  let fertilizer = Fertilizer.findOne({ plantId: props.id }) || {};

  //sort the data
  fertilizer.fertilizerTracker = sortByLastDate(fertilizer.fertilizerTracker);

  fertilizer.daysSinceFertilized = getDaysSinceAction(
    fertilizer.fertilizerTracker
  );
  fertilizer.fertilizerCondition = getPlantCondition(
    fertilizer.fertilizerTracker,
    fertilizer.daysSinceFertilized,
    fertilizer.fertilizerSchedule
  );
  fertilizer.highlightDates = getHighlightDates(fertilizer.fertilizerTracker);

  return {
    fertilizer,
    savingType,
  };
})(FertilizerSwipePanel);
