import React, { useEffect } from 'react'
import PropTypes from "prop-types";
import "../PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getDaysSinceAction,
  getHighlightDates,
  getPlantCondition,
  sortByLastDate,
} from "../../../utils/helpers/plantData";
import { toast } from "react-toastify";
import { withTracker } from "meteor/react-meteor-data";
import WaterModals from './WaterModals'
import WaterReadEdit from './WaterReadEdit'
import WaterReadEditPro from './WaterReadEditPro'
import useNewData from '/imports/ui/hooks/useNewData'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/

const WaterSwipePanel = (props) => {
  const plant = props.plant;
  const { newData, setNewData, changeNewData, addTrackerDate } = useNewData({})

  useEffect(() => {
    if (props.saving === "waterTracker-edit") {
      updatePlant("waterTracker-edit")
    }
  }, [props]);

  const updatePlant = () => {
    console.log("profile");

    const newPlantData = newData;
    const oldPlantData = props.plant;

    if (!newPlantData || JSON.stringify(newPlantData) === "{}") {
      toast.error("No data entered.");
    } else {
      //TODO abstract each of these cases out
      let data = {
        waterPreference:
                newPlantData.waterPreference || oldPlantData.waterPreference,
        lightPreference:
                newPlantData.lightPreference || oldPlantData.lightPreference,
        waterSchedule:
                newPlantData.waterSchedule === ""
                        ? null
                        : newPlantData.waterSchedule || oldPlantData.waterSchedule
                        ? parseInt(newPlantData.waterSchedule || oldPlantData.waterSchedule)
                        : newPlantData.waterSchedule || oldPlantData.waterSchedule,
        // waterSchedule: (newPlantData.waterSchedule === '' && oldPlantData.waterSchedule > 0) ? null : (newPlantData.waterSchedule || oldPlantData.waterSchedule) ? parseInt(newPlantData.waterSchedule || oldPlantData.waterSchedule) : newPlantData.waterSchedule || oldPlantData.waterSchedule,
        waterScheduleAuto:
                newPlantData.waterScheduleAuto != null
                        ? newPlantData.waterScheduleAuto
                        : oldPlantData.waterScheduleAuto != null
                        ? oldPlantData.waterScheduleAuto
                        : false,
      };

      if (data) {
        data._id = oldPlantData._id;

        Meteor.call("water.update", type, data, (err, response) => {
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
  }

  const resetData = () => {
    setNewData({})

    props.exitEditMode();
  }

  return (
          <div className="PlantSeedlingViewEdit">
            {/* water */}
            {Meteor.isPro ? (
                    <WaterReadEditPro
                            item={plant}
                            updateData={changeNewData}
                            editing={props.editing}
                    />
            ) : (
                    <WaterReadEdit
                            item={plant}
                            updateData={changeNewData}
                            editing={props.editing}
                    />
            )}

            {/* modals */}
            <WaterModals addTrackerDate={addTrackerDate}
                         save={updatePlant}
                         resetModal={resetData}
                         modalOpen={props.modalOpen}
                         newDataTracker={newData.waterTracker}
                         tracker={plant.waterTracker}
                         highlightDates={plant.highlightDates}/>

          </div>
  )
}

WaterSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  editing: PropTypes.string,
  modalOpen: PropTypes.string,
  exitEditMode: PropTypes.func.isRequired,
};

export default withTracker((props) => {
  //TODO each category (ie water, fertilizer, etc) needs to have their own collections
  //TODO plant will be sent from props but water will be pulled here

  // const id = props.match.params.id
  // let plant = Plant.findOne({_id: id})
  let plant = props.plant;

  //sort the data
  plant.waterTracker = sortByLastDate(plant.waterTracker);

  plant.daysSinceWatered = getDaysSinceAction(plant.waterTracker);
  plant.waterCondition = getPlantCondition(
          plant.waterTracker,
          plant.daysSinceWatered,
          plant.waterSchedule
  );
  plant.highlightDates = getHighlightDates(plant.waterTracker);

  return {
    plant,
  };
})(WaterSwipePanel);