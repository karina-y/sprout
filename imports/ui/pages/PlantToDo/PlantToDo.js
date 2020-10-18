import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Session } from "meteor/session";
import Plant from "/imports/api/Plant/Plant";
import { getDaysSinceAction, getPlantCondition } from "../../../utils/helpers/plantData";
import PlantTaskList from "../../components/PlantTaskList/PlantTaskList";
import Water from "/imports/api/Water/Water";
import Fertilizer from "/imports/api/Fertilizer/Fertilizer";

class PlantToDo extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    Session.set("pageTitle", "Today's Tasks");
  }

  render() {
    const props = this.props;

    return (
      <div className="ToDo">
        {/* TODO add sorting and filtering, also why am i doing a function for mapping? */}

        {this.props.catalogue && this.props.catalogue.length > 0 ? (
          this.props.catalogue.map(function (plant, index) {
            return <PlantTaskList plant={plant} key={index} {...props} />;
          })
        ) : (
          <p
            className="title-ming"
            style={{ marginTop: "50px", textAlign: "center", padding: "45px" }}
          >
            You don't have any plants that need attention today!
          </p>
        )}
      </div>
    );
  }
}

PlantToDo.propTypes = {
  catalogue: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const catalogue = Plant.find({ userId: Meteor.userId() }).fetch();
  let needsAttention = [];

  //filter what needs attention today
  //plant.waterSchedule - plant.daysSinceWatered - 1
  for (let i = 0; i < catalogue.length; i++) {
    let currPlant = catalogue[i];
    let water = Water.findOne({ plantId: currPlant._id });
    let fertilizer = Fertilizer.findOne({ plantId: currPlant._id });

    let waterDue = water.waterScheduleAuto
      ? 2
      : water.waterSchedule - getDaysSinceAction(water.waterTracker) - 1;
    let fertilizerDue =
      fertilizer.fertilizerSchedule - getDaysSinceAction(fertilizer.fertilizerTracker) - 1;

    if (waterDue < 1 || fertilizerDue < 1) {
      currPlant.attentionNeeded = {
        water: waterDue < 1,
        fertilizer: fertilizerDue < 1,
      };

      needsAttention.push(currPlant);
    }
  }

  return {
    catalogue: needsAttention,
  };
})(PlantToDo);
