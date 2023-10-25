import React, { ChangeEvent, ComponentClass } from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { SoilTypes } from "@constant";
import { withTracker } from "meteor/react-meteor-data";
import { Categories, ModalId, PlantDetailType } from "@enum";
import { ISoilCompositionSchema } from "@model/soilCompositionSchema";
import { Session } from "meteor/session";

interface ISoilCompReadEditProProps {
  item: ISoilCompositionSchema;
  updateData: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    type: PlantDetailType,
  ) => void;
  soilCompLastChecked: string;
  soilMoisture: string;
  soilPh: number;
  category: Categories;
  editing: boolean;
}

const SoilCompReadEditPro = (props: ISoilCompReadEditProProps) => {
  const {
    item,
    updateData,
    soilCompLastChecked,
    soilMoisture,
    soilPh,
    category,
    editing,
  } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Soil Composition</p>

      <SwipePanelContent
        icon="schedule"
        iconTitle="last checked soil composition"
      >
        <p>{soilCompLastChecked}</p>
      </SwipePanelContent>

      {category === "in-ground" ? (
        editing ? (
          <React.Fragment>
            <SwipePanelContent icon="tilling">
              <p className="modern-input">
                <label>tilled</label>
                <select
                  onChange={(e) => updateData(e, PlantDetailType.TILLED)}
                  /*
                  //@ts-ignore */
                  defaultValue={item.tilled || ""}
                >
                  <option value="" disabled={true}>
                    - Is the soil tilled? -
                  </option>
                  {/*
                  //@ts-ignore */}
                  <option value={false}>No</option>
                  {/*
                  //@ts-ignore */}
                  <option value={true}>Yes</option>
                </select>
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="soilType">
              <p className="modern-input">
                <label>soil type</label>
                <select
                  onChange={(e) => updateData(e, PlantDetailType.SOIL_TYPE)}
                  defaultValue={item.soilType || ""}
                >
                  <option value="" disabled={true}>
                    - Select a ground soil type -
                  </option>
                  {SoilTypes.map((item, index) => {
                    return (
                      <option value={item.type} key={index}>
                        {item.displayName}
                      </option>
                    );
                  })}
                </select>
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="soilAmendment">
              <p className="modern-input">
                <label>soil amendment</label>
                <input
                  type="text"
                  onChange={(e) =>
                    updateData(e, PlantDetailType.SOIL_AMENDMENT)
                  }
                  defaultValue={item.soilAmendment || ""}
                />
              </p>
            </SwipePanelContent>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <SwipePanelContent icon="tilling">
              <p>Tilled: {item.tilled ? "Yes" : "No"}</p>
            </SwipePanelContent>

            {item.soilType && (
              <SwipePanelContent icon="soilType">
                <p>Soil Type: {item.soilType}</p>
              </SwipePanelContent>
            )}

            {item.soilAmendment && (
              <SwipePanelContent icon="soilAmendment">
                <p>Soil Amendment: {item.soilAmendment}</p>
              </SwipePanelContent>
            )}

            {soilPh && (
              <SwipePanelContent icon="ph">
                <p>pH {soilPh}</p>
              </SwipePanelContent>
            )}
          </React.Fragment>
        )
      ) : (
        ""
      )}

      {category === "potted" ? (
        editing ? (
          <SwipePanelContent icon="soilRecipe">
            <p className="modern-input">
              <label>soil recipe</label>
              <input
                type="text"
                onChange={(e) => updateData(e, PlantDetailType.SOIL_RECIPE)}
                defaultValue={item.soilRecipe || ""}
              />
            </p>
          </SwipePanelContent>
        ) : (
          <React.Fragment>
            {item.soilRecipe && (
              <SwipePanelContent icon="soilRecipe">
                <p>{item.soilRecipe}</p>
              </SwipePanelContent>
            )}

            {soilMoisture && (
              <SwipePanelContent icon="soilMoisture">
                <p>Moisture Level {soilMoisture}</p>
              </SwipePanelContent>
            )}

            {!item.soilRecipe && !soilMoisture && (
              <SwipePanelContent icon="info">
                <p>No records available</p>
              </SwipePanelContent>
            )}
          </React.Fragment>
        )
      ) : (
        ""
      )}
    </div>
  );
};

SoilCompReadEditPro.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  soilCompLastChecked: PropTypes.string.isRequired,
  soilMoisture: PropTypes.string,
  soilPh: PropTypes.number,
  editing: PropTypes.bool.isRequired,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const editingType = Session.get("editingType");
  const editing = editingType === ModalId.SOIL_COMP_TRACKER;

  return {
    editing,
  } as ISoilCompReadEditProProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(SoilCompReadEditPro) as ComponentClass<ISoilCompReadEditProProps, any>;
