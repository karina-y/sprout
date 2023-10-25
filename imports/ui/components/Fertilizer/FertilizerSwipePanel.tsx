import React, { ComponentClass, useEffect } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getDaysSinceAction,
  getHighlightDates,
  getPlantCondition,
  isNull,
  lastFertilizerUsed,
  sortByLastDate,
  updateOrEditItem,
} from "@helper";
import { toast } from "react-toastify";
import {
  FertilizerModals,
  FertilizerReadEdit,
  FertilizerReadEditPro,
} from "@component";
import { useNewData } from "@hook";
import { Fertilizer } from "@api";
import {
  IFertilizerSchema,
  IFertilizerStats,
  IFertilizerStatsPro,
  IFertilizerTrackerSchema,
} from "@model";
import { ModalId, TrackerEditingType } from "@enum";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

interface IFertilizerSwipePanelProps {
  fertilizer: IFertilizerSchema;
  fertilizerStats: IFertilizerStats;
  id: string;
  savingType: TrackerEditingType;
  exitEditMode: () => void;
}

const FertilizerSwipePanel = (props: IFertilizerSwipePanelProps) => {
  const { fertilizer, fertilizerStats } = props;
  const fertilizerContent = lastFertilizerUsed(
    fertilizer.fertilizerTracker as Array<IFertilizerTrackerSchema>,
  );
  const {
    newData,
    setNewData,
    changeNewData,
    addTrackerDate,
    addTrackerDetails,
  } = useNewData({});

  useEffect(() => {
    if (props.savingType === TrackerEditingType.FERTILIZER_EDIT) {
      updatePlant(TrackerEditingType.FERTILIZER_EDIT);
    }
  }, [props]);

  //TODO
  const updatePlant = (type: TrackerEditingType | ModalId) => {
    const newPlantData = newData;
    const oldPlantData = fertilizer;
    let data: Partial<IFertilizerSchema>;

    console.log("kytodo updatePlant() fertilizer", {
      newPlantData,
      oldPlantData,
    });

    if (!type || isNull(newPlantData)) {
      toast.error("No data entered.");
      return;
    } else if (type === ModalId.FERTILIZER_TRACKER) {
      data = {
        fertilizerTracker: newPlantData.fertilizerTracker,
      };
    } else {
      //TODO abstract each of these cases out
      data = {
        fertilizerSchedule:
          //TODO why do i have this empty string check here?
          newPlantData.fertilizerSchedule === "" &&
          oldPlantData?.fertilizerSchedule
            ? null
            : newPlantData.fertilizerSchedule || oldPlantData.fertilizerSchedule
            ? parseInt(
                newPlantData.fertilizerSchedule ||
                  oldPlantData.fertilizerSchedule,
              )
            : newPlantData.fertilizerSchedule ||
              oldPlantData.fertilizerSchedule,
        preferredFertilizer: newPlantData.preferredFertilizer,
        compost: newPlantData.compost,
        nutrient: newPlantData.nutrient,
      };
    }

    if (data) {
      updateOrEditItem("fertilizer", type, props.id, data, oldPlantData);

      //reset the data
      resetData();
    } else {
      toast.error("No data entered.");
    }
  };

  const resetData = () => {
    setNewData({});

    props.exitEditMode();
  };

  return (
    <div className="PlantSeedlingViewEdit" id="fertilizerSwipePanel">
      {Meteor.isPro ? (
        //   TODO fix these two, params are required but set within withTracker
        /*
        //@ts-ignore */
        <FertilizerReadEditPro
          fertilizer={fertilizer}
          fertilizerStats={fertilizerStats as IFertilizerStatsPro}
          updateData={changeNewData}
          fertilizerContent={fertilizerContent}
        />
      ) : (
        /*
        //@ts-ignore */
        <FertilizerReadEdit
          fertilizer={fertilizer}
          fertilizerStats={fertilizerStats}
          updateData={changeNewData}
          fertilizerContent={fertilizerContent}
        />
      )}
      {/* modals */}
      <FertilizerModals
        addTrackerDate={addTrackerDate}
        addTrackerDetails={addTrackerDetails}
        save={updatePlant}
        resetModal={resetData}
        newDataTracker={newData.fertilizerTracker}
        /*
        //@ts-ignore */
        tracker={fertilizer.fertilizerTracker}
        highlightDates={fertilizerStats.highlightDates}
      />
    </div>
  );
};

FertilizerSwipePanel.propTypes = {
  exitEditMode: PropTypes.func.isRequired,
  fertilizer: PropTypes.object.isRequired,
  fertilizerStats: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  savingType: PropTypes.string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((props: any) => {
  const savingType = Session.get("savingType");
  const fertilizer =
    Fertilizer.findOne({ plantId: props.id }) || ({} as IFertilizerSchema);
  const fertilizerStats = {} as IFertilizerStats;

  //sort the data
  fertilizer.fertilizerTracker = sortByLastDate(fertilizer.fertilizerTracker);

  fertilizerStats.daysSinceFertilized = getDaysSinceAction(
    fertilizer.fertilizerTracker,
  );
  fertilizerStats.fertilizerCondition = getPlantCondition(
    fertilizer.fertilizerTracker,
    fertilizerStats.daysSinceFertilized,
    fertilizer.fertilizerSchedule,
  );
  fertilizerStats.highlightDates = getHighlightDates(
    fertilizer.fertilizerTracker,
  );

  return {
    fertilizer,
    fertilizerStats,
    savingType,
  } as IFertilizerSwipePanelProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(FertilizerSwipePanel) as ComponentClass<IFertilizerSwipePanelProps, any>;
