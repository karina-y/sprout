import React, { ComponentClass, useEffect } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getHighlightDates,
  isNull,
  sortByLastDate,
  updateOrEditItem,
} from "@helper";
import { toast } from "react-toastify";
import {
  PruningDeadheadingModals,
  PruningDeadheadingReadEditPro,
} from "@component";
import { useNewData, usePruneType } from "@hook";
import { UpdateTypesDep } from "@constant";
import { PruningDeadheading } from "@api";
import { IPruningDeadheadingSchema, IPruningDeadheadingStats } from "@model";
import { TrackerEditingType } from "@enum";
import { Session } from "meteor/session";

interface IPruningDeadheadingSwipePanelProps {
  exitEditMode: () => void;
  id: string;
  pruningDeadheading: IPruningDeadheadingSchema;
  pruningDeadheadingStats: IPruningDeadheadingStats;
  savingType?: TrackerEditingType; //TODO enums
}

const PruningDeadheadingSwipePanel = (
  props: IPruningDeadheadingSwipePanelProps,
) => {
  const { pruningDeadheading, pruningDeadheadingStats } = props;
  const {
    newData,
    setNewData,
    changeNewData,
    addTrackerDate,
    addTrackerDetails,
  } = useNewData({});
  const { pruneType, setPruneType } = usePruneType(null);

  useEffect(() => {
    if (props.savingType === TrackerEditingType.PRUNING_DEADHEADING_EDIT) {
      updatePlant(TrackerEditingType.PRUNING_DEADHEADING_EDIT);
    }
  }, [props]);

  //TODO enums
  const updatePlant = (type: string) => {
    const newPlantData: IPruningDeadheadingSchema = newData;
    const oldPlantData: IPruningDeadheadingSchema = pruningDeadheading;

    //todo these are actually stored separately in the db, but for ease for the user they're in one view
    /*if (type === "pruningDeadheadingTracker") {
      type = pruneType;
    }*/

    if (!type || isNull(newPlantData)) {
      toast.error("No data entered.");
      return;
    } else {
      let data: Partial<IPruningDeadheadingSchema>;

      if (
        type === UpdateTypesDep.pruningDeadheading.pruningDeadheadingEditModal
      ) {
        data = {
          pruningTracker: newPlantData.pruningTracker,
          deadheadingTracker: newPlantData.deadheadingTracker,
        };
      } else {
        data = {
          pruningPreference:
            newPlantData.pruningPreference || oldPlantData.pruningPreference,
          deadheadingPreference:
            newPlantData.deadheadingPreference ||
            oldPlantData.deadheadingPreference,
        };
      }

      if (data) {
        updateOrEditItem(
          "pruningDeadheading",
          type,
          props.id,
          data,
          oldPlantData,
        );

        //reset the data
        resetData();
      } else {
        toast.error("No data entered.");
      }
    }
  };

  const resetData = () => {
    setNewData({});
    setPruneType(null);
    props.exitEditMode();
  };

  return (
    <div className="PlantSeedlingViewEdit">
      {/*
      //@ts-ignore */}
      <PruningDeadheadingReadEditPro
        plant={pruningDeadheading}
        updateData={changeNewData}
      />

      {/* pruning */}
      {/*
      //@ts-ignore */}
      <PruningDeadheadingModals
        addTrackerDate={addTrackerDate}
        addTrackerDetails={addTrackerDetails}
        save={updatePlant}
        resetModal={resetData}
        newDataTracker={newData.pruningDeadheadingTracker}
        tracker={pruningDeadheadingStats.pruningDeadheadingTracker}
        highlightDates={pruningDeadheadingStats.highlightDates}
        pruneType={pruneType}
        /*
        // @ts-ignore */
        setPruneType={(val) => setPruneType(val)}
      />
      {/* TODO setPruneType above*/}
    </div>
  );
};

PruningDeadheadingSwipePanel.propTypes = {
  exitEditMode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  pruningDeadheading: PropTypes.object.isRequired,
  savingType: PropTypes.string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((props: any) => {
  const savingType = Session.get("savingType");
  const pruningDeadheading =
    PruningDeadheading.findOne({ plantId: props.id }) ||
    ({} as IPruningDeadheadingSchema);
  const pruningDeadheadingStats = {} as IPruningDeadheadingStats;

  if (
    pruningDeadheading?.pruningTracker ||
    pruningDeadheading?.deadheadingTracker
  ) {
    const pruning = pruningDeadheading.pruningTracker || [];
    const deadheading = pruningDeadheading.deadheadingTracker || [];

    //TODO enum these two?
    for (let i = 0; i < pruning.length; i++) {
      pruning[i].action = "Pruned";
    }

    for (let i = 0; i < deadheading.length; i++) {
      deadheading[i].action = "Deadheaded";
    }

    //TODO
    //@ts-ignore
    pruningDeadheadingStats.pruningDeadheadingTracker = sortByLastDate(
      pruning.concat(deadheading),
    );

    pruningDeadheadingStats.highlightDates = getHighlightDates(
      pruningDeadheadingStats.pruningDeadheadingTracker,
    );
  } else {
    // @ts-ignore
    pruningDeadheadingStats.pruningDeadheadingTracker = null;
  }

  return {
    pruningDeadheading,
    pruningDeadheadingStats,
    savingType,
  } as IPruningDeadheadingSwipePanelProps;
})(PruningDeadheadingSwipePanel) as ComponentClass<
  IPruningDeadheadingSwipePanelProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;
