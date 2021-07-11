import React, { Component } from "react";
import PropTypes from "prop-types";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import Plant from "/imports/api/Plant/Plant";
import { getDaysSinceAction } from "/imports/utils/helpers/plantData";
import PlantTaskList from "../../components/PlantTaskList/PlantTaskList";
import Water from "/imports/api/Water/Water";
import Fertilizer from "/imports/api/Fertilizer/Fertilizer";

//TODO this doesn't need to be a class
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

        {this.props.catalog?.length > 0 ? (
          this.props.catalog.map(function (plant, index) {
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
  catalog: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const catalog = Plant.find({ userId: Meteor.userId() }).fetch();
  let needsAttention = [];

  //filter what needs attention today
  //plant.waterSchedule - plant.daysSinceWatered
  for (let i = 0; i < catalog.length; i++) {
    let currPlant = catalog[i];
    let water = Water.findOne({ plantId: currPlant._id });
    let fertilizer = Fertilizer.findOne({ plantId: currPlant._id });

    let waterDue = water?.waterScheduleAuto
      ? 2
      : water?.waterSchedule - getDaysSinceAction(water?.waterTracker);

    let fertilizerDue = fertilizer?.fertilizerSchedule
      ? 2
      : fertilizer?.fertilizerSchedule -
        getDaysSinceAction(fertilizer?.fertilizerTracker);

    if (waterDue <= 1 || fertilizerDue <= 1) {
      currPlant.attentionNeeded = {
        water: waterDue <= 1,
        fertilizer: fertilizerDue <= 1,
      };

      needsAttention.push(currPlant);
    }
  }

  return {
    catalog: needsAttention,
  };
})(PlantToDo);
