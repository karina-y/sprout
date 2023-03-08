import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { EtcPlantReadEdit } from "@component";
import { useNewData } from "@hook";
import { UpdateTypes } from "@constant";
import { withTracker } from "meteor/react-meteor-data";

const EtcSwipePanel = (props) => {
  const plant = props.plant;
  const { newData, setNewData, changeNewData } = useNewData({});

  useEffect(() => {
    if (props.savingType === `${UpdateTypes.etc.etcEditModal}-edit`) {
      updatePlant(`${UpdateTypes.etc.etcEditModal}-edit`);
    }
  }, [props]);

  const updatePlant = (type) => {
    const newPlantData = newData;
    const oldPlantData = plant;
    let changeTitle = false;

    if (!type || !newPlantData || JSON.stringify(newPlantData) === "{}") {
      toast.error("No data entered.");
    } else {
      //TODO how can i update only the data that needs updating, instead of doing all this
      let data = {
        commonName: newPlantData.commonName || oldPlantData.commonName,
        latinName: newPlantData.latinName || oldPlantData.latinName,
        toxicity: newPlantData.toxicity || oldPlantData.toxicity,
        category: newPlantData.category || oldPlantData.category,
        location: newPlantData.location || oldPlantData.location,
        locationBought:
          newPlantData.locationBought || oldPlantData.locationBought,
        dateBought: new Date(
          newPlantData.dateBought || oldPlantData.dateBought
        ),
        datePlanted: new Date(
          newPlantData.datePlanted || oldPlantData.datePlanted
        ),
        companions: newPlantData.companions || oldPlantData.companions,
        lightPreference:
          newPlantData.lightPreference || oldPlantData.lightPreference,
      };

      if (
        newPlantData.latinName !== oldPlantData.latinName ||
        newPlantData.commonName !== oldPlantData.commonName
      ) {
        changeTitle = true;
      }

      if (data) {
        data._id = oldPlantData._id;

        Meteor.call("plant.update", data, changeTitle, (err, response) => {
          if (err) {
            toast.error(err.message);
          } else {
            toast.success("Successfully saved new entry.");
            resetData();

            if (newPlantData.latinName !== oldPlantData.latinName) {
              Session.set("pageTitle", newPlantData.latinName);
            }
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
      <EtcPlantReadEdit plant={plant} updateData={changeNewData} />
    </div>
  );
};

EtcSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  exitEditMode: PropTypes.func.isRequired,
  savingType: PropTypes.string,
};

export default withTracker(() => {
  const savingType = Session.get("savingType");

  return {
    savingType,
  };
})(EtcSwipePanel);
