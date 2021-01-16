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
import BottomNavManage from "../BottomNav/BottomNavManage";

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
  // updatePhoto(e) {
  //   let files = e.target.files;
  //   let file = files[0];
  //   let fileReader = new FileReader();
  //
  //   if (files.length === 0) {
  //     return;
  //   }
  //
  //   fileReader.onload = function (event) {
  //     let dataUrl = event.target.result;
  //     template.dataUrl.set(dataUrl);
  //   };
  //
  //   fileReader.readAsDataURL(file);
  // }

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
    const { plant, editingType } = this.props;

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
          <WaterSwipePanel exitEditMode={this.exitEditMode} id={plant._id} />

          <FertilizerSwipePanel
            exitEditMode={this.exitEditMode}
            id={plant._id}
          />

          <PruningDeadheadingSwipePanel
            exitEditMode={this.exitEditMode}
            id={plant._id}
          />

          <SoilCompSwipePanel
            exitEditMode={this.exitEditMode}
            id={plant._id}
            category={plant.category}
          />

          <PestSwipePanel exitEditMode={this.exitEditMode} id={plant._id} />

          <DiarySwipePanel exitEditMode={this.exitEditMode} id={plant._id} />

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

  //in case the user is looking at a deleted plant
  if (!plant) {
    props.history.push("/catalogue/plant");
  }

  const editingType = Session.get("editingType");

  return {
    plant,
    editingType,
  };
})(PlantViewEdit);
