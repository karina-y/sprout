import React, { ComponentClass } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import { isNull, sortByLastDate, updateOrEditItem } from "@helper";
import { toast } from "react-toastify";
import { DiaryModals, DiaryReadEdit } from "@component";
import { Diary } from "@api";
import { IDiarySchema } from "@model/diary";
import { ModalId, UpdateType } from "@enum";
import { useNewData } from "@hook";

interface IDiarySwipePanelProps {
  diary: IDiarySchema;
  exitEditMode: () => void;
  id: string;
}

const DiarySwipePanel = (props: IDiarySwipePanelProps) => {
  const diary = props.diary;
  const { newData, setNewData, changeNewData } = useNewData({});

  //TODO are these types accurate?
  const updatePlant = (type: UpdateType | ModalId) => {
    const newPlantData: IDiarySchema = newData;
    const oldPlantData: IDiarySchema = diary;

    if (!type || isNull(newPlantData)) {
      toast.error("No data entered.");
      return;
    } else {
      //TODO abstract each of these cases out

      const data: Partial<IDiarySchema> = {
        diary: newPlantData.diary,
      };

      if (data) {
        updateOrEditItem("diary", type, props.id, data, oldPlantData);

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
      {/* diary */}
      <DiaryReadEdit item={diary} />
      {/* diary */}
      <DiaryModals
        updateData={changeNewData}
        /* TODO */
        save={updatePlant}
        resetModal={resetData}
        diary={diary.diary}
      />
    </div>
  );
};

DiarySwipePanel.propTypes = {
  diary: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  exitEditMode: PropTypes.func.isRequired,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((props: any) => {
  let diary = Diary.findOne({ plantId: props.id }) || ({} as IDiarySchema);

  //sort the data
  if (diary) {
    diary.diary = sortByLastDate(diary.diary);
  } else {
    diary = {
      diary: null,
    };
  }

  return {
    diary,
  } as IDiarySwipePanelProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(DiarySwipePanel) as ComponentClass<IDiarySwipePanelProps, any>;
