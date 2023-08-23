import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import PropTypes, { Requireable } from "prop-types";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import { isActionDueToday } from "@helper";
import { PlantTaskList } from "@component";
import { Water, Fertilizer, Plant } from "@api";
import { PlantSchema } from "@model";

interface IPlantToDoProps {
  catalog: Array<PlantSchema>;
}

//TODO this doesn't need to be a class
class PlantToDo extends Component<IPlantToDoProps> {
  //TODO fill in propTypes
  static propTypes: {};

  // TODO type the props correctly
  constructor(props: any) {
    super(props);

    this.state = {};
  }
  // public static propTypes = {};

  componentDidMount() {
    Session.set("pageTitle", "Today's Tasks");
  }

  render() {
    //kytodo need a back button from this and other pages?
    const props: any = this.props;

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
  // catalog: PropTypes.oneOf<PlantSchema>(Array<PlantSchema>),
};

export default withTracker(() => {
  const catalog /*: Array<Plant>*/ = Plant.find({
    userId: Meteor.userId(),
  }).fetch();
  let needsAttention = [];

  //filter what needs attention today
  //plant.waterSchedule - plant.daysSinceWatered
  //TODO can this get moved into a helper or keep here since it's todo specific? or make a todo helper?
  for (let i = 0; i < catalog.length; i++) {
    const currPlant = catalog[i];
    const water = Water.findOne({ plantId: currPlant._id });
    const fertilizer = Fertilizer.findOne({ plantId: currPlant._id });

    console.log({ currPlant, fertilizer });

    let isWaterDue = isActionDueToday(
      water?.waterTracker,
      water?.waterSchedule
    );

    let isFertilizerDue = isActionDueToday(
      fertilizer?.fertilizerTracker,
      fertilizer?.fertilizerSchedule
    );

    if (isWaterDue || isFertilizerDue) {
      currPlant.attentionNeeded = {
        water: isWaterDue,
        fertilizer: isFertilizerDue,
      };

      needsAttention.push(currPlant);
    }
  }

  return {
    catalog: needsAttention,
  };
})(PlantToDo);
