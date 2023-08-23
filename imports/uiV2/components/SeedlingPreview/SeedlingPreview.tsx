import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import "./SeedlingPreview.scss";
import { ShadowBox } from "@componentV2";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getDaysSinceAction, getPlantCondition } from "@helper";
import { Icons } from "@constantV2";
import { ReactSVG } from "react-svg";

const SeedlingPreview = (props) => {
  const { seedling, history } = props;

  return (
    <button
      onClick={() => history.push(`/seedling/${seedling._id}`)}
      className="SeedlingPreview naked"
    >
      <ShadowBox
        additionalOuterClasses={seedling.condition}
        hoverAction={false}
        popoutHover={false}
        shadowLevel={2}
      >
        <img
          src={seedling.image}
          alt={seedling.latinName || seedling.commonName}
          title={seedling.latinName || seedling.commonName}
        />

        <div className="quick-details">
          <p>{seedling.latinName || seedling.commonName}</p>

          <div>
            <ReactSVG
              src={Icons.water.icon}
              className="plant-condition-icon"
              alt={Icons.water.alt}
              title={Icons.water.title}
            />

            <ProgressBar
              now={seedling.waterProgress === 0 ? 5 : seedling.waterProgress}
              className={`water ${seedling.waterCondition}`}
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
              now={
                seedling.fertilizerProgress === 0
                  ? 5
                  : seedling.fertilizerProgress
              }
              className={`fertilizer ${seedling.fertilizerCondition}`}
            />
          </div>
        </div>
      </ShadowBox>
    </button>
  );
};

SeedlingPreview.propTypes = {
  seedling: PropTypes.object.isRequired,
};

export default withTracker((props) => {
  let seedling = seedling;

  //TODO this code is duplicated
  if (seedling.fertilizerTracker?.length > 0) {
    seedling.daysSinceFertilized = getDaysSinceAction(
      seedling.fertilizerTracker
    );

    seedling.fertilizerCondition = getPlantCondition(
      seedling.fertilizerTracker,
      seedling.daysSinceFertilized,
      seedling.fertilizerSchedule
    );

    //todo simplify this
    seedling.fertilizerProgress =
      seedling.daysSinceFertilized / seedling.fertilizerSchedule > 1
        ? 5
        : (1 - seedling.daysSinceFertilized / seedling.fertilizerSchedule) *
            100 || 5;
  } else {
    seedling.fertilizerCondition = "happy";
    seedling.fertilizerProgress = 100;
  }

  if (seedling.waterTracker?.length > 0) {
    seedling.daysSinceWatered = getDaysSinceAction(seedling.waterTracker);
    seedling.waterCondition = getPlantCondition(
      seedling.waterTracker,
      seedling.daysSinceWatered,
      seedling.waterSchedule
    );
    seedling.waterProgress =
      seedling.daysSinceWatered / seedling.waterSchedule > 1
        ? 5
        : (1 - seedling.daysSinceWatered / seedling.waterSchedule) * 100 || 5;
  } else {
    seedling.waterCondition = "happy";
    seedling.waterProgress = 100;
  }

  return {
    seedling,
  };
})(SeedlingPreview);
