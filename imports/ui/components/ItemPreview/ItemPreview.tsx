import React, { ComponentClass } from "react";
import PropTypes from "prop-types";
import ProgressBar from "react-bootstrap/ProgressBar";
import { withTracker } from "meteor/react-meteor-data";
import "./ItemPreview.scss";
import { ShadowBox } from "@component";
import {
  getDaysSinceAction,
  getFertilizerProgress,
  getPlantCondition,
  getWaterProgress,
} from "@helper";
import { Icons } from "@constant";
import { ReactSVG } from "react-svg";
import { Fertilizer, Water } from "@api";
import { RouteComponentPropsCustom } from "@type";
import {
  IFertilizerSchema,
  IFertilizerStats,
  IPlantSchema,
  IWaterSchema,
  IWaterStats,
} from "@model";
import { useNavigate, useParams } from "react-router";

interface IItemPreviewProps extends RouteComponentPropsCustom {
  item: IPlantSchema;
  fertilizerStats: IFertilizerStats;
  waterStats: IWaterStats;
  type?: string; //TODO
  overallCondition: string;
}

const ItemPreview = (props: IItemPreviewProps) => {
  //TODO why isn't history showing up?
  //@ts-ignore
  const { item, fertilizerStats, waterStats, type, overallCondition } = props;
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/${type}/${item._id}`)}
      className="ItemPreview naked"
    >
      <ShadowBox
        additionalOuterClasses={overallCondition}
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
              /*
              //@ts-ignore */
              src={Icons.water.icon}
              className="plant-condition-icon"
              alt={Icons.water.alt}
              title={Icons.water.title}
            />

            <ProgressBar
              now={
                waterStats.waterProgress === 0 ? 5 : waterStats.waterProgress
              }
              className={`water ${waterStats.waterCondition}`}
            />
          </div>

          <div>
            <ReactSVG
              /*
              //@ts-ignore */
              src={Icons.fertilizer.icon}
              className="plant-condition-icon fertilizer"
              alt={Icons.fertilizer.alt}
              title={Icons.fertilizer.title}
            />
            <ProgressBar
              now={
                fertilizerStats.fertilizerProgress === 0
                  ? 5
                  : fertilizerStats.fertilizerProgress
              }
              className={`fertilizer ${fertilizerStats.fertilizerCondition}`}
            />
          </div>
        </div>
      </ShadowBox>
    </button>
  );
};

//TODO if a prop is required but defined in withTracker, set it as required in the props interface but not in the propTypes
ItemPreview.propTypes = {
  item: PropTypes.object.isRequired,
  fertilizerStats: PropTypes.object,
  waterStats: PropTypes.object,
  type: PropTypes.string.isRequired,
  overallCondition: PropTypes.string.isRequired,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((props: any) => {
  const { type } = useParams();
  const item = props.item;
  const fertilizerStats = {} as IFertilizerStats;
  const waterStats = {} as IWaterStats;

  const water = Water.findOne({ plantId: item._id }) as IWaterSchema;
  const fertilizer = Fertilizer.findOne({
    plantId: item._id,
  }) as IFertilizerSchema;

  //TODO turn these into a hook? is that ok in tracker?
  //either way this is duplicated code and i don't like it
  if (fertilizer?.fertilizerTracker?.length) {
    fertilizerStats.daysSinceFertilized = getDaysSinceAction(
      fertilizer.fertilizerTracker,
    );

    fertilizerStats.fertilizerCondition = getPlantCondition(
      fertilizer.fertilizerTracker,
      fertilizerStats.daysSinceFertilized,
      fertilizer.fertilizerSchedule,
    );

    //todo can i simplify this?
    fertilizerStats.fertilizerProgress = getFertilizerProgress(
      item,
      fertilizerStats,
    );
  } else {
    item.fertilizerCondition = "happy";
    item.fertilizerProgress = 100;
  }

  if (water?.waterTracker?.length) {
    waterStats.daysSinceWatered = getDaysSinceAction(water.waterTracker);

    waterStats.waterCondition = getPlantCondition(
      water.waterTracker,
      waterStats.daysSinceWatered,
      water.waterSchedule,
      water.waterScheduleAuto,
    );

    waterStats.waterProgress = getWaterProgress(item, waterStats);
  } else {
    waterStats.waterCondition = "happy";
    waterStats.waterProgress = 100;
  }

  return {
    item,
    waterStats,
    fertilizerStats,
    // type: modalId, //TODO idk why this was modalId?
    type,
    overallCondition: "unknown", //TODO idk where this came from, maybe parent component?
  } as IItemPreviewProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(ItemPreview) as ComponentClass<IItemPreviewProps, any>;
