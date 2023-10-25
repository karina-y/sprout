import React, { ChangeEvent, ComponentClass } from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { withTracker } from "meteor/react-meteor-data";
import { PlantDetailType } from "@enum";
import { IFertilizerSchema, IFertilizerStatsPro } from "@model";
import { Session } from "meteor/session";

interface IFertilizerReadEditProProps {
  editingType: string; //TODO
  editing: boolean;
  fertilizer: IFertilizerSchema;
  fertilizerStats: IFertilizerStatsPro;
  updateData: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    type: PlantDetailType,
  ) => void;
  fertilizerContent: string; //TODO
}

const FertilizerReadEditPro = (props: IFertilizerReadEditProProps) => {
  const {
    editing,
    fertilizer,
    // fertilizerStats,
    updateData,
    // fertilizerContent,
  } = props;

  return (
    <div className="swipe-slide" id="fertilizerReadEditPro">
      <p className="swipe-title title-ming">Fertilizer - Nutrients</p>

      {editing ? (
        <React.Fragment>
          <SwipePanelContent icon="schedule" iconTitle="fertilizer schedule">
            <p className="modern-input">
              Feed every{" "}
              <input
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                className="small"
                onChange={(e) =>
                  updateData(e, PlantDetailType.FERTILIZER_SCHEDULE)
                }
                defaultValue={fertilizer.fertilizerSchedule || ""}
              />{" "}
              days
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="fertilizer">
            <p className="modern-input">
              <label>preferred fertilizer</label>
              <input
                type="text"
                onChange={(e) =>
                  updateData(e, PlantDetailType.PREFERRED_FERTILIZER)
                }
                defaultValue={fertilizer.preferredFertilizer || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="compost">
            <p className="modern-input">
              <label>compost</label>
              <input
                type="text"
                onChange={(e) => updateData(e, PlantDetailType.COMPOST)}
                defaultValue={fertilizer.compost || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="nutrients">
            <p className="modern-input">
              <label>other nutrient amendment</label>
              <input
                type="text"
                onChange={(e) => updateData(e, PlantDetailType.NUTRIENT)}
                defaultValue={fertilizer.nutrient || ""}
              />
            </p>
          </SwipePanelContent>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <SwipePanelContent
            icon="schedule"
            iconTitle="fertilizer schedule"
            /*
            //@ts-ignore */
            additionalOuterClasses="top-align"
          >
            <p>
              {fertilizer.fertilizerSchedule != null
                ? `Feed every ${fertilizer.fertilizerSchedule} days`
                : "No schedule set"}
            </p>

            {/*
            TODO
            {fertilizer.fertilizerSchedule != null &&
              fertilizerStats.daysSinceFertilized != null && (
                <p>
                  Due in{" "}
                  {fertilizer.fertilizerSchedule -
                    fertilizerStats.daysSinceFertilized}{" "}
                  days
                </p>
              )}*/}
          </SwipePanelContent>

          <React.Fragment>
            {/*
           TODO
           {(fertilizer || fertilizerContent) && (
              <SwipePanelContent icon="fertilizer">
                <p>
                  {fertilizer ||
                    fertilizerContent ||
                    fertilizer.preferredFertilizer}
                </p>
              </SwipePanelContent>
            )}*/}

            {fertilizer.compost && (
              <SwipePanelContent icon="compost">
                <p>{fertilizer.compost}</p>
              </SwipePanelContent>
            )}

            {fertilizer.nutrient && (
              <SwipePanelContent icon="nutrients">
                <p>{fertilizer.nutrient}</p>
              </SwipePanelContent>
            )}
          </React.Fragment>
        </React.Fragment>
      )}
    </div>
  );
};

FertilizerReadEditPro.propTypes = {
  fertilizer: PropTypes.object.isRequired,
  fertilizerStats: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string,
  editing: PropTypes.bool.isRequired,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const editingType = Session.get("editingType");
  const editing = editingType === ModalId.FERTILIZER_TRACKER;

  return {
    editing,
  } as IFertilizerReadEditProProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(FertilizerReadEditPro) as ComponentClass<IFertilizerReadEditProProps, any>;
