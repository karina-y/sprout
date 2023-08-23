import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@componentV2";
import { withTracker } from "meteor/react-meteor-data";
import { Category } from "@api";
import { parseDate } from "@helper";
import { UpdateTypes } from "@constantV2";

const EtcPlantReadEdit = (props) => {
  const { plant, updateData, editing, categories } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Etc</p>

      {editing ? (
        <React.Fragment>
          <SwipePanelContent icon="info" iconTitle="common name">
            <p className="modern-input">
              <label>common name</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "commonName")}
                defaultValue={plant.commonName || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="info" iconTitle="latin name">
            <p className="modern-input">
              <label>latin name</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "latinName")}
                defaultValue={plant.latinName || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="category">
            <p className="modern-input">
              <label>category</label>
              <select
                onChange={(e) => updateData(e, "category")}
                defaultValue={plant.category || ""}
              >
                <option value="" disabled={true}>
                  - Select a category -
                </option>
                {categories?.map((item, index) => {
                  return (
                    <option value={item.category} key={index}>
                      {item.displayName}
                    </option>
                  );
                })}
              </select>
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="toxicity">
            <p className="modern-input">
              <label>toxicity</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "toxicity")}
                defaultValue={plant.toxicity || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="locationBought">
            <p className="modern-input">
              <label>location bought</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "locationBought")}
                defaultValue={plant.locationBought}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="date bought">
            <p className="modern-input">
              <label>date bought</label>
              <input
                type="date"
                onBlur={(e) => updateData(e, "dateBought")}
                defaultValue={
                  plant.dateBought
                    ? new Date(plant.dateBought).toJSON().slice(0, 10)
                    : new Date().toJSON().slice(0, 10)
                }
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent
            icon="schedule"
            iconTitle={
              plant.category === "potted" ? "Date Potted" : "Date Planted"
            }
          >
            <p className="modern-input">
              <label>
                {plant.category === "potted" ? "date potted" : "date planted"}
              </label>
              <input
                type="date"
                placeholder={
                  plant.category === "potted" ? "Date Potted" : "Date Planted"
                }
                onBlur={(e) => updateData(e, "datePlanted")}
                defaultValue={
                  plant.datePlanted
                    ? new Date(plant.datePlanted).toJSON().slice(0, 10)
                    : new Date().toJSON().slice(0, 10)
                }
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="plantLocation">
            <p className="modern-input">
              <label>plant location</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "location")}
                defaultValue={plant.location}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="companions">
            <p className="modern-input">
              <label>companions</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "companions")}
                defaultValue={
                  plant.companions ? plant.companions.join(", ") : null
                }
              />
            </p>
          </SwipePanelContent>

          {/*{type === "plant" ?*/}
          <SwipePanelContent icon="lightPreference">
            <p className="modern-input">
              <label>light preferences *</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "lightPreference")}
                defaultValue={plant.lightPreference || ""}
              />
            </p>
          </SwipePanelContent>
          {/*:
							<SwipePanelContent icon="lightPreference">
							  <p className="modern-input">
								<label>sun light or grow light *</label>
								<select onChange={(e) => updateData(e, 'lightPreference')}
										defaultValue={plant.lightPreference || ''}>
								  <option value='' disabled={true}>- What lighting is being used? -</option>
								  <option value="grow light">Grow Light</option>
								  <option value="sun light">Sun Light</option>
								</select>
							  </p>
							</SwipePanelContent>
					}*/}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <SwipePanelContent icon="info" iconTitle="common name">
            <p>{plant.commonName}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="category">
            <p>{plant.category}</p>
          </SwipePanelContent>

          {plant.toxicity && (
            <SwipePanelContent icon="toxicity">
              <p>{plant.toxicity || "N/A"}</p>
            </SwipePanelContent>
          )}

          {plant.locationBought && (
            <SwipePanelContent icon="locationBought">
              <p>{plant.locationBought || "N/A"}</p>
            </SwipePanelContent>
          )}

          {plant.dateBought && (
            <SwipePanelContent icon="schedule" iconTitle="date bought">
              <p>{parseDate(plant.dateBought)}</p>
            </SwipePanelContent>
          )}

          {plant.datePlanted && (
            <SwipePanelContent icon="schedule" iconTitle="date planted">
              <p>{parseDate(plant.datePlanted)}</p>
            </SwipePanelContent>
          )}

          <SwipePanelContent icon="plantLocation">
            <p>{plant.location || "N/A"}</p>
          </SwipePanelContent>

          {plant.companions?.length > 0 && (
            <SwipePanelContent icon="companions">
              <p>{plant.companions.join(", ")}</p>
            </SwipePanelContent>
          )}

          <SwipePanelContent icon="lightPreference">
            <p>{plant.lightPreference}</p>
          </SwipePanelContent>
        </React.Fragment>
      )}
    </div>
  );
};

EtcPlantReadEdit.propTypes = {
  plant: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  categories: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const categories = Category.find({}).fetch();
  const editingType = Session.get("editingType");
  const editing = editingType === UpdateTypes.etc.etcEditModal;

  return {
    categories,
    editing,
  };
})(EtcPlantReadEdit);
