import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@componentV2";
import { SoilTypes, UpdateTypes } from "@constantV2";
import { withTracker } from "meteor/react-meteor-data";

const SoilCompReadEditPro = (props) => {
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
                  onChange={(e) => updateData(e, "tilled")}
                  defaultValue={item.tilled || ""}
                >
                  <option value="" disabled={true}>
                    - Is the soil tilled? -
                  </option>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </p>
            </SwipePanelContent>

            <SwipePanelContent icon="soilType">
              <p className="modern-input">
                <label>soil type</label>
                <select
                  onChange={(e) => updateData(e, "soilType")}
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
                  onChange={(e) => updateData(e, "soilAmendment")}
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
                onChange={(e) => updateData(e, "soilRecipe")}
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

export default withTracker(() => {
  const editingType = Session.get("editingType");
  const editing = editingType === UpdateTypes.soilComp.soilCompEditModal;

  return {
    editing,
  };
})(SoilCompReadEditPro);
