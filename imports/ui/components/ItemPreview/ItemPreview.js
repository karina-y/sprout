import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import "./ItemPreview.scss";
import ShadowBox from "../ShadowBox/ShadowBox";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getDaysSinceAction, getPlantCondition } from "/imports/utils/helpers/plantData";
import Icons from "/imports/utils/constants/icons";
import { ReactSVG } from "react-svg";
import Fertilizer from "/imports/api/Fertilizer/Fertilizer";
import Water from "/imports/api/Water/Water";

const ItemPreview = (props) => (
  <button
    onClick={() => props.history.push(`/${props.type}/${props.item._id}`)}
    className="ItemPreview naked"
  >
    <ShadowBox
      additionalOuterClasses={props.item.condition}
      hoverAction={false}
      popoutHover={false}
      shadowLevel={2}
    >
      <img
        src={props.item.image}
        alt={props.item.latinName || props.item.commonName}
        title={props.item.latinName || props.item.commonName}
      />

      <div className="quick-details">
        <p>{props.item.latinName || props.item.commonName}</p>

        <div>
          <ReactSVG
            src={Icons.water.icon}
            className="plant-condition-icon"
            alt={Icons.water.alt}
            title={Icons.water.title}
          />

          <ProgressBar
            now={props.item.waterProgress === 0 ? 5 : props.item.waterProgress}
            className={`water ${props.item.waterCondition}`}
          />
        </div>

        <div>
          <ReactSVG
            src={Icons.fertilizer.icon}
            className="plant-condition-icon fertilizer"
            alt={Icons.fertilizer.alt}
            title={Icons.fertilizer.title}
          />
          <ProgressBar
            now={props.item.fertilizerProgress === 0 ? 5 : props.item.fertilizerProgress}
            className={`fertilizer ${props.item.fertilizerCondition}`}
          />
        </div>
      </div>
    </ShadowBox>
  </button>
);

ItemPreview.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default withTracker((props) => {
  const type = props.match.params.type;
  let item = props.item;

  const water = Water.findOne({ plantId: item._id });
  const fertilizer = Fertilizer.findOne({ plantId: item._id });

  //TODO turn these into a hook? is that right in tracker?
  if (fertilizer.fertilizerTracker && fertilizer.fertilizerTracker.length > 0) {
    item.daysSinceFertilized = getDaysSinceAction(fertilizer.fertilizerTracker);
    item.fertilizerCondition = getPlantCondition(
      fertilizer.fertilizerTracker,
      item.daysSinceFertilized,
      fertilizer.fertilizerSchedule
    );
    item.fertilizerProgress =
      item.daysSinceFertilized / fertilizer.fertilizerSchedule > 1
        ? 5
        : (1 - item.daysSinceFertilized / fertilizer.fertilizerSchedule) * 100 || 5;
  } else {
    item.fertilizerCondition = "happy";
    item.fertilizerProgress = 100;
  }

  if (water.waterTracker && water.waterTracker.length > 0) {
    item.daysSinceWatered = getDaysSinceAction(water.waterTracker);
    item.waterCondition = water.waterScheduleAuto
      ? "happy"
      : getPlantCondition(water.waterTracker, item.daysSinceWatered, water.waterSchedule);
    item.waterProgress = water.waterScheduleAuto
      ? 100
      : item.daysSinceWatered / water.waterSchedule > 1
      ? 5
      : (1 - item.daysSinceWatered / water.waterSchedule) * 100 || 5;
  } else {
    item.waterCondition = "happy";
    item.waterProgress = 100;
  }

  return {
    item,
    type,
  };
})(ItemPreview);
