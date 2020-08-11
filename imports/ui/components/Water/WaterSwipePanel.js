import React, { Component } from "react";
import PropTypes from "prop-types";
import autobind from "react-autobind";
import "../PlantViewEdit/PlantSeedlingViewEdit.scss";;
import "react-datepicker/dist/react-datepicker.css";
import {
  getDaysSinceAction,
  getHighlightDates,
  getPlantCondition,
  sortByLastDate,
} from "../../../utils/plantData";
import { toast } from "react-toastify";
import { withTracker } from "meteor/react-meteor-data";
import WaterModals from './WaterModals'
import WaterReadEdit from './WaterReadEdit'
import WaterReadEditPro from './WaterReadEditPro'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/

class WaterSwipePanel extends Component {
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
                      <WaterReadEditPro
                              item={plant}
                              updateData={this.updateData}
                              editing={this.props.editing}
                      />
              ) : (
                      <WaterReadEdit
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
