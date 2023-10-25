import React, { ComponentClass, useEffect } from "react";
import PropTypes from "prop-types";
import "@component/PlantViewEdit/PlantSeedlingViewEdit.scss";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { EtcPlantReadEdit } from "@component";
import { useNewData } from "@hook";
import { withTracker } from "meteor/react-meteor-data";
import { RouteComponentPropsCustom } from "@type";
import { IPlantSchema } from "@model";
import { TrackerEditingType } from "@enum";
import { Session } from "meteor/session";
import { Meteor } from "meteor/meteor";
import { isNull } from "@helper";

interface IEtcSwipePanelProps extends RouteComponentPropsCustom {
  plant: IPlantSchema;
  newData: IPlantSchema;
  exitEditMode: () => void;
  savingType: TrackerEditingType;
}

const EtcSwipePanel = (props: IEtcSwipePanelProps) => {
  const plant = props.plant;
  const { newData, setNewData, changeNewData } = useNewData({});

  useEffect(() => {
    if (props.savingType === `${ModalId.ETC_TRACKER}-edit`) {
      updatePlant(`${ModalId.ETC_TRACKER}-edit`);
    }
  }, [props]);

  //TODO enum type param
  const updatePlant = (type: string) => {
    const newPlantData = newData;
    const oldPlantData = plant;
    let changeTitle = false;

    if (!type || isNull(newPlantData)) {
      toast.error("No data entered.");
      return;
    } else {
      //TODO how can i update only the data that needs updating, instead of doing all this
      const data: Partial<IPlantSchema> = {
        commonName: newPlantData.commonName || oldPlantData.commonName,
        latinName: newPlantData.latinName || oldPlantData.latinName,
        toxicity: newPlantData.toxicity || oldPlantData.toxicity,
        category: newPlantData.category || oldPlantData.category,
        location: newPlantData.location || oldPlantData.location,
        locationBought:
          newPlantData.locationBought || oldPlantData.locationBought,
        dateBought: new Date(
          newPlantData.dateBought || oldPlantData.dateBought,
        ),
        datePlanted: new Date(
          newPlantData.datePlanted || oldPlantData.datePlanted,
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

        Meteor.call("plant.update", data, changeTitle, (err: Meteor.Error) => {
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
      {/*TODO how should i handle required props when they're established in the component itself?*/}
      <EtcPlantReadEdit
        plant={plant}
        updateData={changeNewData}
        editing={false}
        categories={[]}
      />
    </div>
  );
};

EtcSwipePanel.propTypes = {
  plant: PropTypes.object.isRequired,
  exitEditMode: PropTypes.func.isRequired,
  savingType: PropTypes.string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const savingType = Session.get("savingType");

  return {
    savingType,
  } as IEtcSwipePanelProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(EtcSwipePanel) as ComponentClass<IEtcSwipePanelProps, any>;
