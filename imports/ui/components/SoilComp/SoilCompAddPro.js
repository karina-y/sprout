import React from "react";
import PropTypes from "prop-types";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";
import SoilTypes from "/imports/utils/constants/soilTypes";

const SoilCompAddPro = (props) => {
  const {item, updateData, category} = props;

  return (
          <div className="swipe-slide">
            <p className="swipe-title title-ming">Soil Composition</p>

            {category === "in-ground" ? (
                    <React.Fragment>
                      <SwipePanelContent icon="tilling">
                        <p className="modern-input">
                          <label>is the soil tilled</label>
                          <select onChange={(e) => updateData(e, "tilled")} value={item.tilled || ""}>
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
                          <label>ground soil type</label>
                          <select onChange={(e) => updateData(e, "soilType")}
                                  value={item.soilType || ""}>
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
                                  onChange={(e) => updateData(e, "ph")}
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
                                  onChange={(e) => updateData(e, "soilRecipe")}
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
                                  onChange={(e) => updateData(e, "moisture")}
                          />
                          %
                        </p>
                      </SwipePanelContent>
                    </React.Fragment>
            ) : (
                    <p>Please select a category on the first panel.</p>
            )}
          </div>
  )}

SoilCompAddPro.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  category: PropTypes.string,
};

export default SoilCompAddPro;
