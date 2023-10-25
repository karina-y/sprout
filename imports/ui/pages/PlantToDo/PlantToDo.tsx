import { Meteor } from "meteor/meteor";
import React, { Component, ComponentClass } from "react";
import PropTypes from "prop-types";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import { isActionDueToday } from "@helper";
import { PlantTaskList } from "@component";
import { Fertilizer, Plant, Water } from "@api";
import { RouteComponentPropsCustom } from "@type";
import { IPlantSchema, IPlantStats } from "@model";

interface IPlantToDoProps extends RouteComponentPropsCustom {
  catalog: Array<{
    plant: IPlantSchema;
    attentionNeeded: {
      water: boolean;
      fertilizer: boolean;
      pruning: boolean;
      deadheading: boolean;
    }; //TODO type
    plantStats: IPlantStats;
  }>;
}

//TODO this doesn't need to be a class
class PlantToDo extends Component<IPlantToDoProps> {
  //TODO fill in propTypes
  static propTypes = {};

  constructor(props: IPlantToDoProps) {
    super(props);
  }

  componentDidMount() {
    Session.set("pageTitle", "Today's Tasks");
  }

  render() {
    //kytodo need a back button from this and other pages?
    const props: IPlantToDoProps = this.props;

    return (
      <div className="ToDo">
        {/* TODO add sorting and filtering, also why am i doing a function for mapping? */}

        {this.props.catalog?.length ? (
          this.props.catalog.map(function (catalogItem, index) {
            return (
              <PlantTaskList
                plantStats={catalogItem.plantStats}
                plant={catalogItem.plant}
                attentionNeeded={catalogItem.attentionNeeded}
                key={index}
                {...props}
              />
            );
          })
        ) : (
          <p
            className="title-ming"
            style={{ marginTop: "50px", textAlign: "center", padding: "45px" }}
          >
            {/*TODO wtf is this error*/}
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
  const needsAttention = [];

  //filter what needs attention today
  //plant.waterSchedule - plant.daysSinceWatered
  //TODO can this get moved into a helper or keep here since it's todo specific? or make a todo helper?
  for (let i = 0; i < catalog.length; i++) {
    const currPlant = catalog[i];
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
      needsAttention.push({
        plant: currPlant,
        attentionNeeded: {
          water: isWaterDue,
          fertilizer: isFertilizerDue,
        },
        plantStats: {},
      });
    }
  }

  return {
    catalog: needsAttention,
  } as IPlantToDoProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(PlantToDo) as ComponentClass<IPlantToDoProps, any>;
