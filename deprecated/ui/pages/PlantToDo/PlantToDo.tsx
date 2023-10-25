import { Meteor } from "meteor/meteor";
import React, { Component, ComponentClass } from "react";
import PropTypes from "prop-types";

import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import { isActionDueToday } from "@helper";
import { PlantTaskList } from "@component";
import { Fertilizer, Plant, Water } from "@api";
import { RouteComponentProps } from "@reach/router";
import { IPlantSchema, IPlantStats } from "@model";

interface IPlantToDoProps extends RouteComponentProps {
  //TODO
  catalog: Array<IPlantSchema & IPlantStats>;
}

//TODO this doesn't need to be a class
class PlantToDo extends Component<IPlantToDoProps> {
  //TODO fill in propTypes
  static propTypes = {};

  // TODO type the props correctly
  constructor(props: IPlantToDoProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    Session.set("pageTitle", "Today's Tasks");
  }

  render() {
    //kytodo need a back button from this and other pages?
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
            {/* eslint-disable-next-line react/no-unescaped-entities */}
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const catalog = Plant.find({
    userId: Meteor.userId(),
  }).fetch() as Array<IPlantSchema>;
  const needsAttention: Array<IPlantSchema> = [];

  //filter what needs attention today
  //plant.waterSchedule - plant.daysSinceWatered
  //TODO can this get moved into a helper or keep here since it's todo specific? or make a todo helper?
  for (let i = 0; i < catalog.length; i++) {
    const currPlant = catalog[i];
    const currPlantStats = {} as IPlantStats;
    const water = Water.findOne({ plantId: currPlant._id });
    const fertilizer = Fertilizer.findOne({ plantId: currPlant._id });

    console.log({ currPlant, fertilizer });

    const isWaterDue = isActionDueToday(
      water?.waterTracker,
      water?.waterSchedule,
    );

    const isFertilizerDue = isActionDueToday(
      fertilizer?.fertilizerTracker,
      fertilizer?.fertilizerSchedule,
    );

    if (isWaterDue || isFertilizerDue) {
      //@ts-ignore
      currPlantStats.attentionNeeded = {
        water: isWaterDue,
        fertilizer: isFertilizerDue,
      };

      //TODO figure this out
      needsAttention.push({ ...currPlant, ...currPlantStats });
    }
  }

  return {
    catalog: needsAttention,
  } as IPlantToDoProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(PlantToDo) as ComponentClass<IPlantToDoProps, any>;
