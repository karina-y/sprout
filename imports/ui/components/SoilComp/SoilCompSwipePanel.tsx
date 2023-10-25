//TODO this file is fucked, idg what soilComp is supposed to be.. is it a custom object?
//@ts-nocheck
import React, { ComponentClass, useEffect } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  getHighlightDates,
  getLastSoilMoisture,
  getLastSoilPh,
  lastChecked,
  sortByLastDate,
  updateOrEditItem,
} from "@helper";
import { toast } from "react-toastify";
import {
  SoilCompModals,
  SoilCompReadEdit,
  SoilCompReadEditPro,
} from "@component";
import { useNewData } from "@hook";
import { UpdateTypesDep } from "@constant";
import { RouteComponentPropsCustom } from "@type";
import { Categories, TrackerEditingType } from "@enum";
import {
  ISoilCompositionSchema,
  ISoilCompositionStats,
} from "@model/soilCompositionSchema";
import { SoilComposition } from "@api";

interface ISoilCompSwipePanelProps extends RouteComponentPropsCustom {
  exitEditMode: () => void;
  id: string;
  soilComp: ISoilCompositionSchema;
  soilCompStats?: ISoilCompositionStats;
  category: Categories;
  editing: boolean;
  savingType: TrackerEditingType;
}

const SoilCompSwipePanel = (props: ISoilCompSwipePanelProps) => {
  const { category, soilComp, soilCompStats } = props;
  const {
    newData,
    setNewData,
    changeNewData,
    addTrackerDate,
    addTrackerDetails,
  } = useNewData({});

  useEffect(() => {
    if (
      props.savingType === `${UpdateTypesDep.soilComp.soilCompEditModal}-edit`
    ) {
      updatePlant(`${UpdateTypesDep.soilComp.soilCompEditModal}-edit`);
    }
  }, [props]);

  const updatePlant = (type) => {
    const newPlantData = newData;
    const oldPlantData = soilComp;

    if (!type || isNull(newPlantData)) {
      toast.error("No data entered.");
      return;
    } else {
      let data;

      if (type === UpdateTypesDep.soilComp.soilCompEditModal) {
        data = newPlantData;
      } else {
        if (props.category === "in-ground") {
          data = {
            soilAmendment: newPlantData.soilAmendment,
            soilType: newPlantData.soilType,
            tilled: newPlantData.tilled === "true",
          };
        } else {
          data = {
            soilRecipe: newPlantData.soilRecipe,
          };
        }
      }

      if (data) {
        updateOrEditItem("soilComposition", type, props.id, data, oldPlantData);

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
      {/* soil comp */}
      {Meteor.isPro ? (
        <SoilCompReadEditPro
          item={soilComp}
          updateData={changeNewData}
          soilCompLastChecked={soilCompStats?.soilCompLastChecked}
          soilMoisture={soilCompStats?.soilMoisture}
          soilPh={soilCompStats?.soilPh}
          category={category}
        />
      ) : (
        <SoilCompReadEdit
          item={soilComp}
          updateData={changeNewData}
          soilCompLastChecked={soilCompStats?.soilCompLastChecked}
          soilMoisture={soilCompStats?.soilMoisture}
          soilPh={soilCompStats?.soilPh}
          category={category}
        />
      )}

      {/* soil comp */}
      <SoilCompModals
        addTrackerDetails={addTrackerDetails}
        addTrackerDate={addTrackerDate}
        save={updatePlant}
        resetModal={resetData}
        newDataTracker={newData.soilCompositionTracker}
        tracker={soilComp.soilCompositionTracker}
        category={category}
        highlightDates={soilComp.highlightDates}
      />
    </div>
  );
};

SoilCompSwipePanel.propTypes = {
  soilComp: PropTypes.object.isRequired,
  soilCompStats: PropTypes.object.isRequired,
  exitEditMode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  savingType: PropTypes.string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((props: any) => {
  const savingType = Session.get("savingType");
  let soilComp =
    SoilComposition.findOne({ plantId: props.id }) ||
    ({} as ISoilCompositionSchema);
  let soilCompStats: ISoilCompositionStats = {};

  //sort the data
  if (soilComp) {
    soilComp.soilCompositionTracker = sortByLastDate(
      soilComp.soilCompositionTracker,
    );
    soilCompStats.highlightDates = getHighlightDates(
      soilComp.soilCompositionTracker,
    );

    //filtering so we only show the values necessary on the calendar (just in case the user changes the category)
    if (props.category === Categories.POTTED) {
      soilComp.soilCompositionTracker = soilComp.soilCompositionTracker.filter(
        function (obj) {
          return obj.moisture;
        },
      );
    } else {
      soilComp.soilCompositionTracker = soilComp.soilCompositionTracker.filter(
        function (obj) {
          return obj.ph;
        },
      );
    }

    soilCompStats.soilCompLastChecked = lastChecked(
      soilComp.soilCompositionTracker,
    );
    soilCompStats.soilPh = getLastSoilPh(soilComp.soilCompositionTracker);
    soilCompStats.soilMoisture = getLastSoilMoisture(
      soilComp.soilCompositionTracker,
    );
  } else {
    soilComp = {
      soilCompositionTracker: null,
    };
    soilCompStats = {
      highlightDates: null,
      soilCompLastChecked: null,
      soilPh: null,
      soilMoisture: null,
    };
  }

  return {
    soilComp,
    soilCompStats,
    savingType,
  } as ISoilCompSwipePanelProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(SoilCompSwipePanel) as ComponentClass<ISoilCompSwipePanelProps, any>;
