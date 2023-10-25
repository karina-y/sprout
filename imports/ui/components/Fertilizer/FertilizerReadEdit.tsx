import React, { ChangeEvent, ComponentClass } from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { withTracker } from "meteor/react-meteor-data";
import { RouteComponentPropsCustom } from "@type";
import { ModalId, PlantDetailType } from "@enum";
import { IFertilizerSchema, IFertilizerStats } from "@model";
import { Session } from "meteor/session";

interface IFertilizerReadEditProps extends RouteComponentPropsCustom {
  editingType: string; //TODO
  editing: boolean;
  fertilizer: IFertilizerSchema;
  fertilizerStats: IFertilizerStats;
  updateData: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    type: PlantDetailType,
  ) => void;
  fertilizerContent: string; //TODO
}

const FertilizerReadEdit = (props: IFertilizerReadEditProps) => {
  const {
    // editingType,
    editing,
    fertilizer,
    fertilizerStats,
    updateData,
    fertilizerContent,
  } = props;

  //todo why do i have 2 checks for editing?
  return (
    //   TODO add these id's to all my swipe panels
    <div className="swipe-slide" id="fertilizerReadEdit">
      <p className="swipe-title title-ming">Fertilizer</p>

      <SwipePanelContent
        icon="schedule"
        iconTitle="fertilizer schedule"
        /* TODO swipepanelcontent doesn't take additionalOuterClasses */
        /*additionalOuterClasses={
          editingType !== "fertilizerTracker" ? "top-align" : ""
        }*/
      >
        {editing ? (
          <p className="modern-input">
            Fertilize every{" "}
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
        ) : fertilizer.fertilizerSchedule &&
          fertilizerStats.daysSinceFertilized ? (
          <React.Fragment>
            <p>Fertilize every {fertilizer.fertilizerSchedule} days</p>
            <p>
              Due in{" "}
              {fertilizer.fertilizerSchedule -
                fertilizerStats.daysSinceFertilized}{" "}
              days
            </p>
          </React.Fragment>
        ) : fertilizer.fertilizerSchedule != null ? (
          <p>{`Feed every ${fertilizer.fertilizerSchedule} days`}</p>
        ) : (
          <p>No schedule set</p>
        )}
      </SwipePanelContent>

      {editing ? (
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
      ) : (
        (fertilizer.preferredFertilizer || fertilizerContent) && (
          <SwipePanelContent icon="fertilizer">
            <p>{fertilizer.preferredFertilizer || fertilizerContent}</p>
          </SwipePanelContent>
        )
      )}
    </div>
  );
};

FertilizerReadEdit.propTypes = {
  fertilizer: PropTypes.object.isRequired,
  fertilizerStats: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  fertilizerContent: PropTypes.string.isRequired,
  editingType: PropTypes.string,
  editing: PropTypes.bool.isRequired,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const editingType = Session.get("editingType");
  const editing = editingType === ModalId.FERTILIZER_TRACKER;

  return {
    editingType,
    editing,
  } as IFertilizerReadEditProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(FertilizerReadEdit) as ComponentClass<IFertilizerReadEditProps, any>;
