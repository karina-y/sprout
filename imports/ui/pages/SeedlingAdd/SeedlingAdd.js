import React, { Component } from "react";
import autobind from "react-autobind";
import "./SeedlingAdd.scss";
import Modal from "react-bootstrap/Modal";
import { Session } from "meteor/session";
import SwipeableViews from "react-swipeable-views";
import { selectRandomPlantPicture } from "@helper";
import { toast } from "react-toastify";
import { Category } from "@api";
import {
  SwipePanelContent,
  WaterAdd,
  WaterAddPro,
  FertilizerAddPro,
  FertilizerAdd,
  SoilCompAddPro,
  SoilCompAdd,
  BottomNavAdd,
} from "@component";

class SeedlingAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seedling: {
        image: selectRandomPlantPicture(),
        waterScheduleAuto: false,
      },
      swipeViewIndex: 0,
      showDiaryModal: false,
      currentDateSelection: null,
      categories: null,
    };

    autobind(this);
  }

  componentDidMount() {
    Session.set("pageTitle", "New Seedling");
    const categories = Category.find().fetch();

    this.setState({
      categories,
    });
  }

  addNewProfile() {
    let seedling = this.state.seedling;

    if (seedling.waterSchedule) {
      seedling.waterSchedule = parseInt(seedling.waterSchedule);
    }

    if (seedling.fertilizerSchedule) {
      seedling.fertilizerSchedule = parseInt(seedling.fertilizerSchedule);
    }

    if (
      seedling.soilCompositionTracker &&
      !Array.isArray(seedling.soilCompositionTracker)
    ) {
      seedling.soilCompositionTracker = [seedling.soilCompositionTracker];
    }

    let errMsg;

    if (!seedling.commonName && !seedling.latinName) {
      errMsg =
        "Please enter either a common or latin name (eg. Swiss Cheese Plant or Monstera adansonii).";
    } else if (!seedling.category) {
      errMsg = "Please select a category.";
    } else if (!seedling.method) {
      errMsg =
        "Please enter a seed starting method (eg. used jiffy pot and greenhouse method)";
    } else if (!seedling.waterPreference) {
      errMsg =
        "Please enter a watering preference (eg. Keep soil moist but not soggy, humidity tray helpful).";
    } else if (!seedling.lightPreference) {
      errMsg =
        "Please enter a lighting preference (eg. sun light or grow light).";
    }

    if (errMsg) {
      toast.error(errMsg);
    } else {
      Meteor.call("seedling.insert", seedling, (err, response) => {
        if (err) {
          toast.error(err.message);
        } else {
          toast.success("Seedling added!");
          this.props.history.push("/catalog/seedling");
        }
      });
    }
  }

  updateData(e, type) {
    const seedling = this.state.seedling;

    if (type === "ph" || type === "moisture") {
      let phVal = parseFloat(e.target.value);
      let moistureVal = parseFloat((parseInt(e.target.value) / 100).toFixed(2));

      if (seedling.soilCompositionTracker) {
        seedling.soilCompositionTracker[type] =
          type === "moisture" ? moistureVal : phVal;
      } else {
        seedling.soilCompositionTracker = {
          date: new Date(),
          [type]: type === "moisture" ? moistureVal : phVal,
        };
      }
    } else if (type === "daysToGerminate" || type === "daysToHarvest") {
      seedling[type] = parseInt(e.target.value);
    } else if (
      type === "dateExpires" ||
      type === "dateBought" ||
      type === "startDate" ||
      type === "sproutDate" ||
      type === "trueLeavesDate" ||
      type === "transplantDate" ||
      type === "estHarvestDate" ||
      type === "actualHarvestDate"
    ) {
      seedling[type] = new Date(e);
    } else if (type === "tilled") {
      seedling[type] = e.target.value === "true" ? true : false;
    } else {
      seedling[type] = e.target.value;
    }

    this.setState({
      seedling,
    });
  }

  render() {
    const { seedling, swipeViewIndex, categories, showDiaryModal } = this.state;
    //TODO add ability to set plant photo and photo history eventually

    return (
      <div className="SeedlingAdd">
        <img
          src={seedling.image}
          alt={seedling.commonName}
          title={seedling.commonName}
          className="hero-img"
        />

        <SwipeableViews
          className="swipe-view"
          index={swipeViewIndex}
          onChangeIndex={(e) => this.setState({ swipeViewIndex: e })}
        >
          {/* plant info */}
          <div className="swipe-slide">
            <p className="swipe-title title-ming">Seedling Details</p>

            <SwipePanelContent icon="info" iconTitle="common name">
              <p className="modern-input">
                <label>common name *</label>
                <input
                  type="text"
                  onChange={(e) => this.updateData(e, "commonName")}
                  value={seedling.commonName || ""}
                />
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="info" iconTitle="latin name">
              <p className="modern-input">
                <label>latin name *</label>
                <input
                  type="text"
                  onChange={(e) => this.updateData(e, "latinName")}
                  value={seedling.latinName || ""}
                />
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="category">
              <p className="modern-input">
                <label>category *</label>
                <select
                  onChange={(e) => this.updateData(e, "category")}
                  value={seedling.category || ""}
                >
                  <option value="" disabled={true}>
                    - Select a category -
                  </option>
                  {categories?.map((item, index) => {
                    return (
                      <option value={item.category} key={index}>
                        {item.displayName}
                      </option>
                    );
                  })}
                </select>
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="methodSeedStart">
              <p className="modern-input">
                <label>method to start seed *</label>
                <input
                  type="text"
                  onChange={(e) => this.updateData(e, "method")}
                  value={seedling.method || ""}
                />
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="indoorOutdoor">
              <p className="modern-input">
                <label>started indoor or outdoor</label>
                <select
                  onChange={(e) => this.updateData(e, "startedIndoorOutdoor")}
                  value={seedling.startedIndoorOutdoor || ""}
                >
                  <option value="" disabled={true}>
                    - Select a start location -
                  </option>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="seedBrand">
              <p className="modern-input">
                <label>seed brand</label>
                <input
                  type="text"
                  onChange={(e) => this.updateData(e, "seedBrand")}
                  value={seedling.seedBrand || ""}
                />
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="lightPreference">
              <p className="modern-input">
                <label>sun light or grow light *</label>
                <select
                  onChange={(e) => this.updateData(e, "lightPreference")}
                  value={seedling.lightPreference || ""}
                >
                  <option value="" disabled={true}>
                    - What lighting is being used? -
                  </option>
                  <option value="grow light">Grow Light</option>
                  <option value="sun light">Sun Light</option>
                </select>
              </p>
            </SwipePanelContent>
          </div>

          {/* water */}
          {Meteor.isPro ? (
            <WaterAddPro
              item={seedling}
              updateData={this.updateData}
              type={"seedling"}
            />
          ) : (
            <WaterAdd item={seedling} updateData={this.updateData} />
          )}

          {/* fertilizer */}
          {Meteor.isPro ? (
            <FertilizerAddPro item={seedling} updateData={this.updateData} />
          ) : (
            <FertilizerAdd item={seedling} updateData={this.updateData} />
          )}

          {/* soil comp */}
          {Meteor.isPro ? (
            <SoilCompAddPro item={seedling} updateData={this.updateData} />
          ) : (
            <SoilCompAdd item={seedling} updateData={this.updateData} />
          )}

          {/* notable dates */}
          <div className="swipe-slide">
            <p className="swipe-title title-ming">Notable Dates</p>

            <SwipePanelContent icon="schedule">
              <p className="modern-input">
                <label>start date</label>
                <input
                  type="date"
                  onBlur={(e) => this.updateData(e, "startDate")}
                  defaultValue={seedling.startDate || ""}
                />
              </p>
            </SwipePanelContent>

            {/*<SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>sprout date</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'sproutDate')}
							 defaultValue={seedling.sproutDate || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>true leaves date</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'trueLeavesDate')}
							 defaultValue={seedling.trueLeavesDate || ''}/></p>
				  </SwipePanelContent>*/}

            <SwipePanelContent icon="schedule" iconTitle="days to germinate">
              <p className="modern-input">
                <label>days to germinate (7-14 days)</label>
                <input
                  type="text"
                  onChange={(e) => props.updateData(e, "daysToGerminate")}
                  defaultValue={seedling.daysToGerminate || ""}
                />
              </p>
            </SwipePanelContent>

            {/*<SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>transplant date</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'transplantDate')}
							 defaultValue={seedling.transplantDate || ''}/></p>
				  </SwipePanelContent>

				  <SwipePanelContent icon="schedule" iconTitle="days to germinate">
					<p className="modern-input">Days to harvest: <input type="number"
																		min="0"
																		inputMode="numeric"
																		pattern="[0-9]*"
																		placeholder="4"
																		className="small"
																		onChange={(e) => this.updateData(e, 'daysToHarvest')}
																		value={seedling.daysToHarvest || ''}/> days</p>
				  </SwipePanelContent>*/}

            <SwipePanelContent icon="schedule">
              <p className="modern-input">
                <label>estimated harvest date</label>
                <input
                  type="date"
                  onBlur={(e) => this.updateData(e, "estHarvestDate")}
                  defaultValue={seedling.estHarvestDate || ""}
                />
              </p>
            </SwipePanelContent>

            {/*<SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>actual harvest date</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'actualHarvestDate')}
							 defaultValue={seedling.actualHarvestDate || ''}/></p>
				  </SwipePanelContent>*/}

            {/*<SwipePanelContent icon="schedule">
					<p className="modern-input">
					  <label>date seed expires</label>
					  <input type="date"
							 onBlur={(e) => this.updateData(e, 'dateExpires')}
							 defaultValue={seedling.dateExpires || ''}/></p>
				  </SwipePanelContent>*/}
          </div>
        </SwipeableViews>

        <BottomNavAdd
          cancel={() => this.setState({ swipeViewIndex: swipeViewIndex - 1 })}
          add={this.addNewProfile}
        />

        <Modal
          show={showDiaryModal}
          onHide={() => this.setState({ showDiaryModal: false })}
          className="seedling-view-data-modal"
        >
          <Modal.Header closeButton></Modal.Header>

          <Modal.Body>Save new plant seedling?</Modal.Body>

          <Modal.Footer>
            <button
              onClick={() => this.setState({ showDiaryModal: false })}
              className="flat"
            >
              Cancel
            </button>

            <button
              onClick={() => this.setState({ showDiaryModal: false })}
              className="flat"
            >
              Save
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default SeedlingAdd;
