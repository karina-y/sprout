/* eslint-disable @typescript-eslint/no-explicit-any */
//TODO ^
import React, { ChangeEvent, Component } from "react";
import autobind from "autobind-decorator";
import "./PlantAdd.scss";
import { Session } from "meteor/session";
import { Promise } from "bluebird";
import SwipeableViews from "react-swipeable-views";
import { selectRandomPlantPicture } from "@helper";
import { toast } from "react-toastify";
import { Category } from "@api";
import {
  BottomNavAdd,
  FertilizerAdd,
  FertilizerAddPro,
  SoilCompAdd,
  SoilCompAddPro,
  SwipePanelContent,
  WaterAdd,
  WaterAddPro,
} from "@component";
import {
  FertilizerDetailType,
  PlantDetailType,
  PruningDeadheadingDetailType,
  SoilCompDetailType,
  WaterUpdateType,
} from "@enum";
import { Categories } from "@enum/categories";
import { ICategorySchema } from "@model/category";
import { RouteComponentPropsCustom } from "@type";
import {
  IFertilizerSchema,
  IPlantSchema,
  IPruningDeadheadingSchema,
  IWaterSchema,
} from "@model";
import { ISoilCompositionSchema } from "@model/soilCompositionSchema";
import { Meteor } from "meteor/meteor";

type IPlantAddProps = RouteComponentPropsCustom;

interface IPlantAddState {
  plant: IPlantSchema;
  water: IWaterSchema;
  fertilizer: IFertilizerSchema;
  pruningDeadheading: IPruningDeadheadingSchema;
  soilComposition: ISoilCompositionSchema;
  swipeViewIndex: number;
  currentDateSelection?: Date;
  categories?: Array<ICategorySchema>;
}

@autobind
class PlantAdd extends Component<IPlantAddProps, IPlantAddState> {
  //TODO fill in propTypes
  static propTypes = {};

  constructor(props: IPlantAddProps) {
    super(props);

    this.state = {
      plant: {
        image: selectRandomPlantPicture(),
      } as IPlantSchema,
      water: {
        waterScheduleAuto: false,
      } as IWaterSchema,
      fertilizer: {} as IFertilizerSchema,
      pruningDeadheading: {} as IPruningDeadheadingSchema,
      soilComposition: {} as ISoilCompositionSchema,
      swipeViewIndex: 0,
      currentDateSelection: undefined,
      categories: undefined,
    };
  }

  componentDidMount() {
    Session.set("pageTitle", "New Plant");
    const categories = Category.find().fetch() as Array<ICategorySchema>;

    this.setState({
      categories,
    });
  }

  updatePlant(
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | Date,
    type: PlantDetailType,
  ) {
    const plant = this.state.plant;

    if (type === PlantDetailType.COMPANIONS) {
      // @ts-ignore
      if (e.target.value === "") {
        // @ts-ignore
        delete plant[type];
      } else {
        // @ts-ignore
        const stripped = e.target.value.replace(/\s*,\s*/g, ",");
        plant[type] = stripped.split(",");
      }
    } else if (
      type === PlantDetailType.DATE_BOUGHT ||
      type === PlantDetailType.DATE_PLANTED
    ) {
      // @ts-ignore
      plant[type] = new Date(e);
    } else {
      // @ts-ignore
      plant[type] = e.target.value;
    }

    this.setState({
      plant: plant,
    });
  }

  updateWater(e: React.ChangeEvent<HTMLInputElement>, type: WaterUpdateType) {
    const water = this.state.water;

    if (type === WaterUpdateType.WATER_SCHEDULE_AUTO) {
      water[type] = !water[type];
    } else {
      // @ts-ignore
      water[type] = e.target.value;
    }

    this.setState({
      water: water,
    });
  }

  updateFertilizer(
    e: React.ChangeEvent<HTMLInputElement>,
    type: FertilizerDetailType,
  ) {
    const fertilizer = this.state.fertilizer;

    // @ts-ignore
    fertilizer[type] = e.target.value;

    this.setState({
      fertilizer: fertilizer,
    });
  }

  updateSoilComposition(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: SoilCompDetailType,
  ) {
    const soilComposition = this.state.soilComposition;

    if (
      type === SoilCompDetailType.PH ||
      type === SoilCompDetailType.MOISTURE
    ) {
      const phVal = parseFloat(e.target.value);
      const moistureVal = parseFloat(
        (parseInt(e.target.value) / 100).toFixed(2),
      );

      if (soilComposition.soilCompositionTracker) {
        // @ts-ignore
        soilComposition.soilCompositionTracker[type] =
          type === SoilCompDetailType.MOISTURE ? moistureVal : phVal;
      } else {
        soilComposition.soilCompositionTracker = [
          // @ts-ignore
          {
            date: new Date(),
            [type]: type === SoilCompDetailType.MOISTURE ? moistureVal : phVal,
          },
        ];
      }
    } else if (type === "tilled") {
      soilComposition[type] = e.target.value === "true";
    } else {
      soilComposition[type] = e.target.value;
    }

    this.setState({
      soilComposition: soilComposition,
    });
  }

  updatePruningDeadheading(
    e: React.ChangeEvent<HTMLInputElement>,
    type: PruningDeadheadingDetailType,
  ) {
    const pruningDeadheading = this.state.pruningDeadheading;

    pruningDeadheading[type] = e.target.value;

    this.setState({
      pruningDeadheading: pruningDeadheading,
    });
  }

  validateData(plant: IPlantSchema, water: IWaterSchema) {
    let errMsg;
    let swipeViewIndex = this.state.swipeViewIndex;

    if (!plant.commonName && !plant.latinName) {
      errMsg =
        "Please enter either a common or latin name (eg. Swiss Cheese Plant or Monstera adansonii).";
      swipeViewIndex = 0;
    } else if (!water.waterPreference) {
      errMsg =
        "Please enter a watering preference (eg. Keep soil moist but not soggy, humidity tray helpful).";
      swipeViewIndex = 1;
    } else if (!plant.lightPreference) {
      errMsg =
        "Please enter a lighting preference (eg. Bright indirect light).";
      swipeViewIndex = 0;
    } else if (!plant.location) {
      errMsg =
        "Please enter where this plant lives in/around your home (eg. Living Room or Back Patio).";
      swipeViewIndex = 6;
    } else {
      if (Meteor.isPro && !plant.category) {
        errMsg = "Please select a category.";
        swipeViewIndex = 0;
      }
    }

    if (errMsg) {
      toast.error(errMsg);

      this.setState({
        swipeViewIndex,
      });
    }

    return errMsg;
  }

  addNewPlant() {
    const plant: IPlantSchema = this.state.plant;
    const water: IWaterSchema = this.state.water;
    const fertilizer: IFertilizerSchema = this.state.fertilizer;
    const soilComposition: ISoilCompositionSchema = this.state.soilComposition;
    const pruningDeadheading: IPruningDeadheadingSchema =
      this.state.pruningDeadheading;

    if (water.waterSchedule) {
      water.waterSchedule = parseInt(water.waterSchedule as unknown as string);
    }

    if (fertilizer.fertilizerSchedule) {
      fertilizer.fertilizerSchedule = parseInt(
        fertilizer.fertilizerSchedule as unknown as string,
      );
    }

    if (
      soilComposition.soilCompositionTracker &&
      !Array.isArray(soilComposition.soilCompositionTracker)
    ) {
      soilComposition.soilCompositionTracker = [
        soilComposition.soilCompositionTracker,
      ];
    }

    const err = this.validateData(plant, water);

    if (!err) {
      toast.warning("Saving your new plant...");

      //todo clean this up.. i don't want to run further inserts if one is erroring but i don't want to keep nesting
      Meteor.call(
        "plant.insert",
        plant,
        (plantErr: Meteor.Error, plantResponse: string) => {
          if (plantErr) {
            toast.error(plantErr.message);
          } else {
            // @ts-ignore
            const meteorCall = Promise.promisify(Meteor.call, Meteor);

            //TODO can i meteor.wrapasync this? and just await each one without all this chaining?
            // @ts-ignore
            const calls = meteorCall("water.insert", plantResponse, water)
              .then(
                meteorCall.bind(
                  Meteor,
                  // @ts-ignore
                  "fertilizer.insert",
                  plantResponse,
                  fertilizer,
                ),
              )
              .then(
                meteorCall.bind(
                  Meteor,
                  // @ts-ignore
                  "pruningDeadheading.insert",
                  plantResponse,
                  pruningDeadheading,
                ),
              )
              // @ts-ignore
              .then(meteorCall.bind(Meteor, "pest.insert", plantResponse, {}))
              // @ts-ignore
              .then(meteorCall.bind(Meteor, "diary.insert", plantResponse, {}))
              .then(
                meteorCall.bind(
                  Meteor,
                  // @ts-ignore
                  "soilComposition.insert",
                  plantResponse,
                  {},
                ),
              );

            calls
              // @ts-ignore
              .then(function (res) {
                console.log("Got Response!", res);
                toast.success("Plant added!");
                //props.history.push doesn't work properly here: React.ChangeEvent<HTMLInputElement>,all the data doesn't come through on the insert
                window.location.href = `/plant/${plantResponse}`;
              })
              // @ts-ignore
              .catch(function (err) {
                //TODO if any of these errored we have a problem
                //if the user navigates away from the page: React.ChangeEvent<HTMLInputElement>,they'll see the plant WAS partially saved
                //if the user tries to save again, they'll save a second plant
                //need to delete all the entries above and start over
                console.log("Got Error", err);
                toast.error(err.message);
                // @ts-ignore
                this.deletePlant(plantResponse);
              });
          }
        },
      );
    }
  }

  //todo this code is repeated
  deletePlant(plantId: string) {
    Meteor.call("plant.delete", plantId, (err: Meteor.Error) => {
      if (err) {
        console.log("err", err);

        //todo do we want to show clients this error?
        toast.error(err.message);
      } else {
        //TODO this needs to be history.push but it results in an error when the page can't find the plant
        // this.props.history.push('/catalog/plant')
        // window.location.href = "/catalog/plant";
      }
    });
  }

  render() {
    const { plant, water, fertilizer, soilComposition, pruningDeadheading } =
      this.state;

    //TODO add ability to set plant photo and photo history eventually

    return (
      <div className="PlantAdd">
        <img
          src={plant.image}
          alt={plant.commonName}
          title={plant.commonName}
          className="hero-img"
        />

        <SwipeableViews
          className="swipe-view"
          index={this.state.swipeViewIndex}
          onChangeIndex={(e) => this.setState({ swipeViewIndex: e })}
        >
          {/* plant info */}
          <div className="swipe-slide">
            <p className="swipe-title title-ming">
              Plant {Meteor.isPro ? "Details" : "Name"}
            </p>

            <SwipePanelContent icon="info" iconTitle="common name">
              <p className="modern-input">
                <label>common name *</label>
                <input
                  type="text"
                  onChange={(e) =>
                    this.updatePlant(e, PlantDetailType.COMMON_NAME)
                  }
                  value={plant.commonName || ""}
                />
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="info" iconTitle="latin name">
              <p className="modern-input">
                <label>latin name *</label>
                <input
                  type="text"
                  onChange={(e) =>
                    this.updatePlant(e, PlantDetailType.LATIN_NAME)
                  }
                  value={plant.latinName || ""}
                />
              </p>
            </SwipePanelContent>

            {Meteor.isPro && (
              <React.Fragment>
                <SwipePanelContent icon="category">
                  <p className="modern-input">
                    <label>category *</label>
                    <select
                      onChange={(e) =>
                        this.updatePlant(e, PlantDetailType.CATEGORY)
                      }
                      value={plant.category || ""}
                    >
                      <option value="" disabled={true}>
                        - Select a category -
                      </option>
                      {this.state.categories?.map(
                        (item: ICategorySchema, index) => {
                          return (
                            <option value={item.category} key={index}>
                              {item.displayName}
                            </option>
                          );
                        },
                      )}
                    </select>
                  </p>
                </SwipePanelContent>
              </React.Fragment>
            )}

            <SwipePanelContent icon="toxicity">
              <p className="modern-input">
                <label>toxicity</label>
                <input
                  type="text"
                  onChange={(e) =>
                    this.updatePlant(e, PlantDetailType.TOXICITY)
                  }
                  value={plant.toxicity || ""}
                />
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="lightPreference">
              <p className="modern-input">
                <label>light preferences *</label>
                <input
                  type="text"
                  onChange={(e) =>
                    this.updatePlant(e, PlantDetailType.LIGHT_PREFERENCE)
                  }
                  value={plant.lightPreference || ""}
                />
              </p>
            </SwipePanelContent>
          </div>

          {/* water */}
          {Meteor.isPro ? (
            <WaterAddPro
              item={water}
              updateData={this.updateWater}
              type={WaterUpdateType.WATER}
            />
          ) : (
            <WaterAdd item={water} updateData={this.updateWater} />
          )}

          {/* fertilizer */}
          {Meteor.isPro ? (
            <FertilizerAddPro
              item={fertilizer}
              updateData={this.updateFertilizer}
            />
          ) : (
            <FertilizerAdd
              item={fertilizer}
              updateData={this.updateFertilizer}
            />
          )}

          {/* pruning/deadheading schedule */}
          {/*TODO import the pruningdeadheading component*/}
          {Meteor.isPro && (
            <div className="swipe-slide">
              <p className="swipe-title title-ming">Pruning - Deadheading</p>
              <SwipePanelContent icon="pruning" iconTitle="pruning preference">
                <p className="modern-input">
                  <label>pruning preference</label>
                  <input
                    type="text"
                    onChange={(e) =>
                      this.updatePruningDeadheading(
                        e,
                        PruningDeadheadingDetailType.PRUNING_PREFERENCE,
                      )
                    }
                    value={pruningDeadheading.pruningPreference || ""}
                  />
                </p>
              </SwipePanelContent>

              <SwipePanelContent
                icon="deadheading"
                iconTitle="deadheading preference"
              >
                <p className="modern-input">
                  <label>deadheading preference</label>
                  <input
                    type="text"
                    onChange={(e) =>
                      this.updatePruningDeadheading(
                        e,
                        PruningDeadheadingDetailType.DEADHEADING_PREFERENCE,
                      )
                    }
                    value={pruningDeadheading.deadheadingPreference || ""}
                  />
                </p>
              </SwipePanelContent>
            </div>
          )}

          {/* soil comp */}
          {Meteor.isPro ? (
            <SoilCompAddPro
              item={soilComposition}
              updateData={this.updateSoilComposition}
              category={plant.category}
            />
          ) : (
            <SoilCompAdd
              item={soilComposition}
              updateData={this.updateSoilComposition}
              category={plant.category}
            />
          )}

          {/* location/date bought */}
          <div className="swipe-slide">
            <p className="swipe-title title-ming">Location & Date Bought</p>

            <SwipePanelContent icon="locationBought">
              <p className="modern-input">
                <label>location bought</label>
                <input
                  type="text"
                  onChange={(e) =>
                    this.updatePlant(e, PlantDetailType.LOCATION_BOUGHT)
                  }
                  value={plant.locationBought || ""}
                />
              </p>
            </SwipePanelContent>

            {/*need to make this swipepanelcontent with the custom style*/}
            <SwipePanelContent icon="schedule">
              <p className="modern-input">
                <label>date bought</label>
                <input
                  type="date"
                  onBlur={(e) =>
                    this.updatePlant(e, PlantDetailType.DATE_BOUGHT)
                  }
                  // @ts-ignore
                  defaultValue={plant.dateBought || ""}
                />
              </p>
            </SwipePanelContent>
          </div>

          {/* etc */}
          <div className="swipe-slide">
            <p className="swipe-title title-ming">Etc</p>
            <SwipePanelContent
              icon="category"
              iconTitle={
                plant.category === Categories.POTTED
                  ? "Date Potted"
                  : "Date Planted"
              }
            >
              <p className="modern-input">
                <label>
                  {plant.category === Categories.POTTED
                    ? "date potted"
                    : "date planted"}
                </label>

                <input
                  type="date"
                  placeholder={
                    plant.category === Categories.POTTED
                      ? "Date Potted"
                      : "Date Planted"
                  }
                  onBlur={(e) =>
                    this.updatePlant(e, PlantDetailType.DATE_PLANTED)
                  }
                  // @ts-ignore
                  defaultValue={plant.datePlanted || ""}
                />
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="plantLocation">
              <p className="modern-input">
                <label>plant location *</label>
                <input
                  type="text"
                  onChange={(e) =>
                    this.updatePlant(e, PlantDetailType.LOCATION)
                  }
                  value={plant.location || ""}
                />
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="companions">
              <p className="modern-input">
                <label>companion plants</label>
                <input
                  type="text"
                  onChange={(e) =>
                    this.updatePlant(e, PlantDetailType.COMPANIONS)
                  }
                  value={plant.companions || ""}
                />
              </p>
            </SwipePanelContent>
          </div>
        </SwipeableViews>

        <BottomNavAdd
          cancel={() =>
            this.setState({ swipeViewIndex: this.state.swipeViewIndex - 1 })
          }
          add={this.addNewPlant}
        />
      </div>
    );
  }
}

export default PlantAdd;
