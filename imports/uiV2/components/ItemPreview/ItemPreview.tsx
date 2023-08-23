import React from "react";
import PropTypes from "prop-types";
import ProgressBar from "react-bootstrap/ProgressBar";
import { withTracker } from "meteor/react-meteor-data";
import "./ItemPreview.scss";
import { ShadowBox } from "@componentV2";
import { getDaysSinceAction, getPlantCondition } from "@helper";
import { Icons } from "@constantV2";
import { ReactSVG } from "react-svg";
import { Fertilizer, Water } from "@api";

const ItemPreview = (props) => {
  const { item, type, history } = props;

  return (
    <button
      onClick={() => history.push(`/${type}/${item._id}`)}
      className="ItemPreview naked"
    >
      <ShadowBox
        additionalOuterClasses={item.condition}
        hoverAction={false}
        popoutHover={false}
        shadowLevel={2}
      >
        <img
          src={item.image}
          alt={item.latinName || item.commonName}
          title={item.latinName || item.commonName}
        />

        <div className="quick-details">
          <p>{item.latinName || item.commonName}</p>

          <div>
            <ReactSVG
              src={Icons.water.icon}
              className="plant-condition-icon"
              alt={Icons.water.alt}
              title={Icons.water.title}
            />

            <ProgressBar
              now={item.waterProgress === 0 ? 5 : item.waterProgress}
              className={`water ${item.waterCondition}`}
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
              now={item.fertilizerProgress === 0 ? 5 : item.fertilizerProgress}
              className={`fertilizer ${item.fertilizerCondition}`}
            />
          </div>
        </div>
      </ShadowBox>
    </button>
  );
};

ItemPreview.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default withTracker((props) => {
  const type = props.match.params.type;
  let item = props.item;

  const water = Water.findOne({ plantId: item._id });
  const fertilizer = Fertilizer.findOne({ plantId: item._id });

  //TODO turn these into a hook? is that ok in tracker?
  //either way this is duplicated code and i don't like it
  if (fertilizer?.fertilizerTracker?.length > 0) {
    item.daysSinceFertilized = getDaysSinceAction(fertilizer.fertilizerTracker);

    item.fertilizerCondition = getPlantCondition(
      fertilizer.fertilizerTracker,
      item.daysSinceFertilized,
      fertilizer.fertilizerSchedule
    );

    //todo can i simplify this?
    item.fertilizerProgress =
      item.daysSinceFertilized / fertilizer.fertilizerSchedule > 1
        ? 5
        : (1 - item.daysSinceFertilized / fertilizer.fertilizerSchedule) *
            100 || 5;
  } else {
    item.fertilizerCondition = "happy";
    item.fertilizerProgress = 100;
  }

  if (water?.waterTracker?.length > 0) {
    item.daysSinceWatered = getDaysSinceAction(water.waterTracker);
    item.waterCondition = water.waterScheduleAuto
      ? "happy"
      : getPlantCondition(
          water.waterTracker,
          item.daysSinceWatered,
          water.waterSchedule
        );
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
