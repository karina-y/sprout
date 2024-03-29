//TODO figure this all out
//@ts-nocheck
import React, { ComponentClass } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import "./SeedlingPreview.scss";
import { ShadowBox } from "@component";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getDaysSinceAction, getPlantCondition } from "@helper";
import { Icons } from "@constant";
import { ReactSVG } from "react-svg";
import { RouteComponentPropsCustom } from "@type";

interface ISeedlingPreviewProps extends RouteComponentPropsCustom {
  seedling: {
    _id: string;
    condition: string;
    image: string;
    commonName: string;
    latinName: string;
    waterProgress: number;
    waterCondition: string;
    fertilizerProgress: number;
    fertilizerCondition: string;
  }; //TODO make a stats model, make enums for these
  type: string; //TODO
}

const SeedlingPreview = (props: ISeedlingPreviewProps) => {
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
              /*
                  // @ts-ignore  */
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
              /*
                // @ts-ignore  */
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  //TODO wtf is going on here?
  //@ts-ignore
  const seedling = seedling;

  //TODO this code is duplicated
  if (seedling.fertilizerTracker?.length) {
    seedling.daysSinceFertilized = getDaysSinceAction(
      seedling.fertilizerTracker,
    );

    seedling.fertilizerCondition = getPlantCondition(
      seedling.fertilizerTracker,
      seedling.daysSinceFertilized,
      seedling.fertilizerSchedule,
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

  if (seedling.waterTracker?.length) {
    seedling.daysSinceWatered = getDaysSinceAction(seedling.waterTracker);
    seedling.waterCondition = getPlantCondition(
      seedling.waterTracker,
      seedling.daysSinceWatered,
      seedling.waterSchedule,
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
  } as ISeedlingPreviewProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(SeedlingPreview) as ComponentClass<ISeedlingPreviewProps, any>;
