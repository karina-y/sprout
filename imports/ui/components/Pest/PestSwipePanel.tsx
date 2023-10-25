import React, { ComponentClass } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getHighlightDates,
  getLastPestName,
  getLastPestTreatment,
  isNull,
  lastChecked,
  sortByLastDate,
  updateOrEditItem,
} from "@helper";
import { toast } from "react-toastify";
import { PestModals, PestReadEdit } from "@component";
import { useNewData } from "@hook";
import { Pest } from "@api";
import { IPestSchema, IPestStats } from "@model/pest";
import { ITrackerSchema } from "@model";

interface IPestSwipePanelProps {
  id: string;
  pest: IPestSchema;
  pestStats?: IPestStats;
  exitEditMode: () => void;
}

const PestSwipePanel = (props: IPestSwipePanelProps) => {
  const { pest, pestStats } = props;
  const {
    newData,
    setNewData,
    // changeNewData,
    addTrackerDate,
    addTrackerDetails,
  } = useNewData({});
  const pestLastChecked = lastChecked(
    pest.pestTracker as Array<ITrackerSchema>,
  );
  const pestName = getLastPestName(pest.pestTracker);
  const pestTreatment = getLastPestTreatment(pest.pestTracker);

  //TODO
  const updatePlant = (type: string) => {
    const newPlantData = newData;
    const oldPlantData = pest;

    if (!type || isNull(newPlantData)) {
      toast.error("No data entered.");
      return;
    } else {
      //TODO abstract each of these cases out
      const data = {
        [type]: newPlantData[type],
      };

      if (data) {
        updateOrEditItem("pest", type, props.id, data, oldPlantData);

        //reset the data
        resetData();
      } else {
        toast.error("No data entered.");
      }
    }
  };

  const resetData = () => {
    setNewData({});
    props.exitEditMode();
  };

  return (
    <div className="PlantSeedlingViewEdit">
      <PestReadEdit
        pestLastChecked={pestLastChecked}
        pestName={pestName}
        pestTreatment={pestTreatment}
      />

      {/* pests */}
      {/*
      //@ts-ignore */}
      <PestModals
        addTrackerDate={addTrackerDate}
        addTrackerDetails={addTrackerDetails}
        save={updatePlant}
        resetModal={resetData}
        newDataTracker={newData.pestTracker}
        tracker={pest.pestTracker}
        highlightDates={pestStats?.highlightDates}
      />
    </div>
  );
};

PestSwipePanel.propTypes = {
  id: PropTypes.string.isRequired,
  pest: PropTypes.object.isRequired,
  pestStats: PropTypes.object,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((props: any) => {
  let pest = Pest.findOne({ plantId: props.id }) || ({} as IPestSchema);
  const pestStats = {} as IPestStats;

  //sort the data
  if (pest) {
    pest.pestTracker = sortByLastDate(pest.pestTracker);
    pestStats.highlightDates = getHighlightDates(pest.pestTracker);
  } else {
    pest = {
      pestTracker: null,
      highlightDates: null,
    };
  }

  return {
    pest,
  } as IPestSwipePanelProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(PestSwipePanel) as ComponentClass<IPestSwipePanelProps, any>;
