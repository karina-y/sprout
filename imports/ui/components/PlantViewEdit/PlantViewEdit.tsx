import React, { Component, ComponentClass } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "./PlantSeedlingViewEdit.scss";
import { Session } from "meteor/session";
import "react-datepicker/dist/react-datepicker.css";
import SwipeableViews from "react-swipeable-views";
import { toast } from "react-toastify";
import {
  BottomNavManage,
  DiarySwipePanel,
  EtcSwipePanel,
  FertilizerSwipePanel,
  ItemAddEntryModal,
  PestSwipePanel,
  PruningDeadheadingSwipePanel,
  SoilCompSwipePanel,
  WaterSwipePanel,
  WaterSwipePanelPro,
} from "@component";
import { Plant } from "@api";
import autobind from "autobind-decorator";
import { IPlantSchema } from "@model";
import { RouteComponentPropsCustom } from "@type";
import { ModalId } from "@enum/modalEnums";
import { Meteor } from "meteor/meteor";

interface IPlantViewEditProps extends RouteComponentPropsCustom {
  plant: IPlantSchema;
  editingType: ModalId;
}

interface IPlantViewEditState {
  currentDateSelection?: Date;
  newData?: IPlantSchema;
  pruneType?: string; //TODO enum this
  swipeViewIndex: number;
}

@autobind
class PlantViewEdit extends Component<
  IPlantViewEditProps,
  IPlantViewEditState
> {
  public static propTypes = {};

  constructor(props: IPlantViewEditProps) {
    super(props);

    this.state = {
      newData: {} as IPlantSchema,
      swipeViewIndex: 0,
      currentDateSelection: undefined,
      pruneType: undefined,
    };

    // autobind(this);
  }

  componentDidMount() {
    Session.set(
      "pageTitle",
      this.props.plant.latinName || this.props.plant.commonName,
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
    Session.set("activeModalId", null);
    Session.set("editingType", null);
    Session.set("savingType", null);
  }

  //TODO it's not noticeable to the client but i get errors in the console after it's been deleted
  deletePlant() {
    Meteor.call(
      "plant.delete",
      this.props.plant._id,
      //TODO the any type here
      (err: Meteor.Error) => {
        if (err) {
          console.log("err", err);
          toast.error(err.message);
        } else {
          Session.set("activeModalId", null);

          //TODO this needs to be history.push but it results in an error when the page can't find the plant
          // this.props.history.push('/catalog/plant')
          //TODO can i use navigate()?
          window.location.href = "/catalog/plant";
        }
      },
    );
  }

  handleChangeIndex(e: number) {
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
        {/* photo panel */}
        {editingType === ModalId.ETC ? (
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
        {/*
kytodo idk what this was for
        <ShadowBox
          additionalOuterClasses="tempname todofixclassname"
          hoverAction={false}
          popoutHover={false}
          shadowLevel={2}
        >
          <ReactSVG
            src={Icons.water.icon}
            className="plant-condition-icon info"
            alt={Icons.water.alt}
            title={Icons.water.title}
          />

          <div className="contents-todo">
            <FontAwesomeIcon
              icon={Icons.schedule.icon}
              className="plant-condition-icon"
              alt={Icons.schedule.alt}
              title={Icons.schedule.title}
            />
          </div>
        </ShadowBox>
*/}

        <SwipeableViews
          className={`swipe-view ${editingType && "editing"}`}
          index={swipeViewIndex}
          onChangeIndex={this.handleChangeIndex}
        >
          {Meteor.isPro ? (
            //   @ts-ignore
            <WaterSwipePanelPro
              exitEditMode={this.exitEditMode}
              id={plant._id}
            />
          ) : (
            //   @ts-ignore
            <WaterSwipePanel exitEditMode={this.exitEditMode} id={plant._id} />
          )}

          {/*
          //@ts-ignore */}
          <FertilizerSwipePanel
            exitEditMode={this.exitEditMode}
            id={plant._id}
          />

          {/*
          //@ts-ignore */}
          <PruningDeadheadingSwipePanel
            exitEditMode={this.exitEditMode}
            id={plant._id}
          />

          {/*
          //@ts-ignore */}
          <SoilCompSwipePanel
            exitEditMode={this.exitEditMode}
            id={plant._id}
            category={plant.category}
          />

          {/*
          //@ts-ignore */}
          <PestSwipePanel exitEditMode={this.exitEditMode} id={plant._id} />

          {/*
          //@ts-ignore */}
          <DiarySwipePanel exitEditMode={this.exitEditMode} id={plant._id} />

          {/*
          //@ts-ignore */}
          <EtcSwipePanel exitEditMode={this.exitEditMode} plant={plant} />
        </SwipeableViews>

        {/* buttons */}
        <BottomNavManage
          exitEditMode={this.exitEditMode}
          swipeViewIndex={swipeViewIndex}
          type="plant"
        />

        {/*
        //@ts-ignore */}
        <ItemAddEntryModal
          save={this.deletePlant}
          cancel={this.exitEditMode}
          modalId={ModalId.DELETE}
          header="Are you sure you want to delete this plant's entire profile?"
        />
      </div>
    );
  }
}

PlantViewEdit.propTypes = {
  editingType: PropTypes.string,
  plant: PropTypes.object.isRequired,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  // const { id } = useParams();
  //TODO how can i use a hook?
  const id = window.location.pathname.replace(new RegExp("/plant/", "g"), "");

  const plant = Plant.findOne({ _id: id }) as IPlantSchema;

  //in case the user is looking at a deleted plant
  if (!plant) {
    //TODO how can i use a hook?
    window.location.href = "/catalog/plant";
  }

  const editingType = Session.get("editingType");

  return {
    plant,
    editingType,
  } as IPlantViewEditProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(PlantViewEdit) as ComponentClass<IPlantViewEditProps, any>;
