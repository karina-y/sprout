import React, { Component } from "react";
import PropTypes from "prop-types";
import autobind from "react-autobind";
import "./PlantSeedlingViewEdit.scss";
import { Session } from "meteor/session";
import "react-datepicker/dist/react-datepicker.css";
import {
  getDaysSinceAction,
  getHighlightDates,
  getPlantCondition,
  parseDate,
  sortByLastDate,
} from "../../../utils/plantData";
import { toast } from "react-toastify";
import ItemAddEntryModal from "../Shared/ItemAddEntryModal";
import WaterPro from "../SharedPlantSeedling/SwipeViewsEdit/WaterPro";
import Water from "../SharedPlantSeedling/SwipeViewsEdit/Water";
import DatePicker from "react-datepicker";
import ItemViewHistoryModal from "../Shared/ItemViewHistoryModal";
import { withTracker } from "meteor/react-meteor-data";
import WaterModals from '../SharedPlantSeedling/SwipeModals/WaterModals'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/

class WaterViewEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newData: {},
    };

    autobind(this);
  }

  updateData(e, type) {
    //this is any new data that's been entered, updating it as new inputs are entered
    const newPlantData = this.state.newData;

    if (type === "waterScheduleAuto") {
      if (newPlantData[type]) {
        newPlantData[type] = !newPlantData[type];
      } else {
        newPlantData[type] = !this.props.plant[type];
      }
    } else {
      newPlantData[type] = e.target.value;
    }

    this.setState({
      newData: newPlantData,
    });
  }

  //this only adds new dates to trackers, ie adding date fertilizer was used
  addTrackerDate(e, trackerType) {
    let newPlantData = this.state.newData;

    if (newPlantData[trackerType]) {
      newPlantData[trackerType].date = new Date(e);
    } else {
      newPlantData[trackerType] = {
        date: new Date(e),
      };
    }

    this.setState({
      newData: newPlantData,
    });
  }

  //TODO clean this up next!
  updatePlant(type) {
    console.log("profile", type);

    const newPlantData = this.state.newData;
    const oldPlantData = this.props.plant;

    if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
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
            this.resetData();
          }
        });
      } else {
        toast.error("No data entered.");
      }
    }
  }

  resetData() {
    this.setState({
      newData: {},
    });

    this.props.exitEditMode();
  }

  render() {
    const plant = this.props.plant;

    return (
      <div className="PlantSeedlingViewEdit">
        {/* water */}
        {Meteor.isPro ? (
          <WaterPro
            item={plant}
            updateData={this.updateData}
            editing={this.props.editing}
          />
        ) : (
          <Water
            item={plant}
            updateData={this.updateData}
            editing={this.props.editing}
          />
        )}

        {/* modals */}
		<WaterModals addTrackerDate={this.addTrackerDate}
					 addTrackerDetails={this.addTrackerDetails}
					 save={this.updatePlant}
					 resetModal={this.resetData}
					 modalOpen={this.props.modalOpen}
					 newDataTracker={this.state.newData.waterTracker}
					 tracker={plant.waterTracker}
					 highlightDates={plant.highlightDates}/>

      </div>
    );
  }
}

WaterViewEdit.propTypes = {
  plant: PropTypes.object.isRequired,
  editing: PropTypes.string,
  modalOpen: PropTypes.string,
  exitEditMode: PropTypes.func.isRequired,
};

export default withTracker((props) => {
  //TODO each category (ie water, fertilizer, etc) needs to have their own collections
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
})(WaterViewEdit);
