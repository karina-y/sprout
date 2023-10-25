import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { SoilTypes } from "@constant";
import { RouteComponentPropsCustom } from "@type";
import { Categories, SoilCompDetailType } from "../../../utils/enums";
import { ISoilCompositionSchema } from "@model/soilCompositionSchema";

interface ISoilCompAddProProps extends RouteComponentPropsCustom {
  item: ISoilCompositionSchema;
  updateData: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: SoilCompDetailType,
  ) => void;
  category?: Categories;
}

const SoilCompAddPro = (props: ISoilCompAddProProps) => {
  const { item, updateData, category } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Soil Composition</p>

      {category === "in-ground" ? (
        <React.Fragment>
          <SwipePanelContent icon="tilling">
            <p className="modern-input">
              <label>is the soil tilled</label>
              <select
                onChange={(e) => updateData(e, SoilCompDetailType.TILLED)}
                /*
                //@ts-ignore */
                value={item.tilled || ""}
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
              <label>ground soil type</label>
              <select
                onChange={(e) => updateData(e, SoilCompDetailType.SOIL_TYPE)}
                value={item.soilType || ""}
              >
                <option value="" disabled={true}>
                  - Select a ground soil type -
                </option>
                {/*
                //@ts-ignore */}
                {SoilTypes.map((item, index: number) => {
                  return (
                    //   TODO what is this why did i do item.type?
                    /*
                      //@ts-ignore */
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
                  updateData(e, SoilCompDetailType.SOIL_AMENDMENT)
                }
                value={item.soilAmendment || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="ph">
            <p className="modern-input">
              pH{" "}
              <input
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                className="small"
                placeholder="6.2"
                onChange={(e) => updateData(e, SoilCompDetailType.PH)}
              />
            </p>
          </SwipePanelContent>
        </React.Fragment>
      ) : category === "potted" ? (
        <React.Fragment>
          <SwipePanelContent icon="soilRecipe">
            <p className="modern-input">
              <label>soil recipe</label>
              <input
                type="text"
                onChange={(e) => updateData(e, SoilCompDetailType.SOIL_RECIPE)}
                value={item.soilRecipe || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="soilMoisture">
            <p className="modern-input">
              Moisture Level{" "}
              <input
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                className="small"
                placeholder="40"
                onChange={(e) => updateData(e, SoilCompDetailType.MOISTURE)}
              />
              %
            </p>
          </SwipePanelContent>
        </React.Fragment>
      ) : (
        <p>Please select a category on the first panel.</p>
      )}
    </div>
  );
};

SoilCompAddPro.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  category: PropTypes.string,
};

export default SoilCompAddPro;
