import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "../PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import { sortByLastDate } from "/imports/utils/helpers/plantData";
import { toast } from "react-toastify";
import DiaryModals from "./DiaryModals";
import DiaryReadEdit from "./DiaryReadEdit";
import useNewData from "/imports/ui/hooks/useNewData";
import Diary from "/imports/api/Diary/Diary";

const DiarySwipePanel = (props) => {
  const diary = props.diary;
  const { newData, setNewData, changeNewData } = useNewData({});

  const updatePlant = (type) => {
    const newPlantData = newData;
    const oldPlantData = diary;

    if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
      toast.error("No data entered.");
    } else {
      //TODO abstract each of these cases out
      let data = {
        diary: newPlantData.diary,
      };

      if (data) {
        data._id = oldPlantData._id;

        Meteor.call("diary.update", data, (err, response) => {
          if (err) {
            toast.error(err.message);
          } else {
            toast.success("Successfully saved new entry.");
            resetData();
          }
        });
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
      <DiaryReadEdit item={diary} updateData={changeNewData} />

      {/* diary */}
      <DiaryModals
        updateData={changeNewData}
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

export default withTracker((props) => {
  let diary = Diary.findOne({ plantId: props.id }) || {};

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
  };
})(DiarySwipePanel);
