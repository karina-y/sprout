import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import autobind from "react-autobind";
import "../PlantViewEdit/PlantSeedlingViewEdit.scss";;
import "react-datepicker/dist/react-datepicker.css";
import {
  getDaysSinceAction, getHighlightDates,
  getPlantCondition,
  lastFertilizerUsed,
  sortByLastDate,
} from '../../../utils/plantData'
import { toast } from "react-toastify";
import FertilizerModals from "./FertilizerModals";
import FertilizerReadEdit from './FertilizerReadEdit'
import FertilizerReadEditPro from './FertilizerReadEditPro'

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/

class FertilizerSwipePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newData: {},
    };

    autobind(this);
  }

  //this updates the plant's data in my state before it gets sent out to the backend
  updateData(e, type) {
    //this is any new data that's been entered, updating it as new inputs are entered
    let newPlantData = this.state.newData;

    newPlantData[type] = e.target.value;

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

  //this adds additional details to trackers, ie fertilizer type used
  addTrackerDetails(e, trackerType, detailType) {
    let newPlantData = this.state.newData;

    if (newPlantData[trackerType]) {
      newPlantData[trackerType][detailType] = e.target.value;
    } else {
      newPlantData[trackerType] = {
        [detailType]: e.target.value,
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
        fertilizer: newPlantData.fertilizer,
        compost: newPlantData.compost,
        nutrient: newPlantData.nutrient,
      };

      if (data) {
        data._id = oldPlantData._id;

        Meteor.call("fertilizer.update", type, data, (err, response) => {
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
    const fertilizerContent = lastFertilizerUsed(plant.fertilizerTracker)

    return (
            <div className="PlantSeedlingViewEdit">
              {Meteor.isPro ?
                      <FertilizerReadEditPro item={plant}
                                             updateData={this.updateData}
                                             fertilizerContent={fertilizerContent}
                                             editing={this.props.editing}/>
                      :
                      <FertilizerReadEdit item={plant}
                                          updateData={this.updateData}
                                          fertilizerContent={fertilizerContent}
                                          editing={this.props.editing}/>
              }

              {/* modals */}
              <FertilizerModals addTrackerDate={this.addTrackerDate}
                                addTrackerDetails={this.addTrackerDetails}
                                save={this.updatePlant}
                                resetModal={this.resetData}
                                modalOpen={this.props.modalOpen}
                                newDataTracker={this.state.newData.fertilizerTracker}
                                tracker={plant.fertilizerTracker}
                                highlightDates={plant.highlightDates}/>

            </div>
    );
  }
}

FertilizerSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  editing: PropTypes.string,
  modalOpen: PropTypes.string,
  exitEditMode: PropTypes.func.isRequired,
};

export default withTracker((props) => {
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
    plant
  };
})(FertilizerSwipePanel);
