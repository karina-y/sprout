import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import autobind from "react-autobind";
import "./PlantSeedlingViewEdit.scss";
import { Session } from "meteor/session";
import "react-datepicker/dist/react-datepicker.css";
import SwipeableViews from "react-swipeable-views";
import Plant from "/imports/api/Plant/Plant";
import { toast } from "react-toastify";
import ItemAddEntryModal from "../Shared/ItemAddEntryModal";
import FertilizerSwipePanel from "../Fertilizer/FertilizerSwipePanel";
import WaterSwipePanel from "../Water/WaterSwipePanel";
import SoilCompSwipePanel from "../SoilComp/SoilCompSwipePanel";
import PruningDeadheadingSwipePanel from "../PruningDeadheading/PruningDeadheadingSwipePanel";
import PestSwipePanel from "../Pest/PestSwipePanel";
import DiarySwipePanel from "../Diary/DiarySwipePanel";
import EtcSwipePanel from "../Etc/EtcSwipePanel";
import Water from "/imports/api/Water/Water";
import Fertilizer from "/imports/api/Fertilizer/Fertilizer";
import Diary from "/imports/api/Diary/Diary";
import Pest from "/imports/api/Pest/Pest";
import PruningDeadheading from "/imports/api/PruningDeadheading/PruningDeadheading";
import SoilComposition from "/imports/api/SoilComposition/SoilComposition";
import BottomNavManage from "../BottomNav/BottomNavManage";

/*
TODO
- make types a file of constants (dateBought, datePlanted, etc)
- maybe just move all the view components into one file and import that alone
*/

class PlantViewEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newData: {},
      swipeViewIndex: 0,
      currentDateSelection: null,
      pruneType: null,
    };

    autobind(this);
  }

  componentDidMount() {
    Session.set(
      "pageTitle",
      this.props.plant.latinName || this.props.plant.commonName
    );

    //this is to disable keyboard from popping up on android, sometimes you just need good ol vanilla js
    const inputs = document.getElementsByTagName("input");

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
  }

  componentWillUnmount() {
    this.exitEditMode();
  }

  //TODO
  updatePhoto(e) {
    let files = e.target.files;
    let file = files[0];
    let fileReader = new FileReader();

    if (files.length === 0) {
      return;
    }

    fileReader.onload = function (event) {
      let dataUrl = event.target.result;
      template.dataUrl.set(dataUrl);
    };

    fileReader.readAsDataURL(file);
  }

  exitEditMode() {
    Session.set("modalOpen", null);
    Session.set("editingType", null);
    Session.set("savingType", null);
  }

  deletePlant() {
    Meteor.call("plant.delete", this.props.plant._id, (err, response) => {
      if (err) {
        console.log("err", err);
        toast.error(err.message);
      } else {
        console.log("success", response);
        Session.set("modalOpen", null);

        //TODO this needs to be history.push but it results in an error when the page can't find the plant
        // this.props.history.push('/catalogue/plant')
        window.location.href = "/catalogue/plant";
      }
    });
  }

  handleChangeIndex(e) {
    this.setState({
      swipeViewIndex: e,
    });

    Session.set("editingType", null);
  }

  render() {
    const {
      plant,
      water,
      fertilizer,
      diary,
      pest,
      pruningDeadheading,
      soilComposition,
      editingType,
    } = this.props;

    const { swipeViewIndex } = this.state;

    return (
      <div className="PlantSeedlingViewEdit">
        {editingType === "etc" ? (
          <div className="plant-photo editing">
            <img
              src={plant.image}
              alt={plant.commonName}
              title={plant.commonName}
            />

            {/*<FontAwesomeIcon icon={faCamera}
										 size="3x"
										 className="plant-condition-icon"
										 alt="camera"
										 title="update photo"/>

						<input type="file" name="plant photo" onChange={this.updatePhoto}/>*/}
          </div>
        ) : (
          <div className="plant-photo">
            <img
              src={plant.image}
              alt={plant.commonName}
              title={plant.commonName}
            />
          </div>
        )}

        <SwipeableViews
          className={`swipe-view ${editingType && "editing"}`}
          index={swipeViewIndex}
          onChangeIndex={this.handleChangeIndex}
        >
          <WaterSwipePanel exitEditMode={this.exitEditMode} plant={water} />

          <FertilizerSwipePanel
            exitEditMode={this.exitEditMode}
            plant={fertilizer}
          />

          <PruningDeadheadingSwipePanel
            exitEditMode={this.exitEditMode}
            plant={pruningDeadheading}
          />

          <SoilCompSwipePanel
            exitEditMode={this.exitEditMode}
            plant={soilComposition}
            category={plant.category}
          />

          <PestSwipePanel exitEditMode={this.exitEditMode} plant={pest} />

          <DiarySwipePanel exitEditMode={this.exitEditMode} plant={diary} />

          <EtcSwipePanel exitEditMode={this.exitEditMode} plant={plant} />
        </SwipeableViews>

        {/* buttons */}
        <BottomNavManage
          exitEditMode={this.exitEditMode}
          swipeViewIndex={swipeViewIndex}
          type="plant"
        />

        <ItemAddEntryModal
          save={this.deletePlant}
          cancel={this.exitEditMode}
          type="delete"
          header="Are you sure you want to delete this plant's entire profile?"
        />
      </div>
    );
  }
}

PlantViewEdit.propTypes = {
  plant: PropTypes.object.isRequired,
  editingType: PropTypes.string,
};

export default withTracker((props) => {
  const id = props.match.params.id;
  const plant = Plant.findOne({ _id: id });
  const water = Water.findOne({ plantId: id });
  const fertilizer = Fertilizer.findOne({ plantId: id });
  const diary = Diary.findOne({ plantId: id });
  const pest = Pest.findOne({ plantId: id });
  const pruningDeadheading = PruningDeadheading.findOne({ plantId: id });
  const soilComposition = SoilComposition.findOne({ plantId: id });
  const editingType = Session.get("editingType");

  return {
    plant,
    water,
    fertilizer,
    diary,
    pest,
    pruningDeadheading,
    soilComposition,
    editingType,
  };
})(PlantViewEdit);
