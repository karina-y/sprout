import React from "react";
import PropTypes from "prop-types";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";
import { withTracker } from "meteor/react-meteor-data";
import Category from "/imports/api/Category/Category";
import UpdateTypes from "/imports/utils/constants/updateTypes";

const EtcSeedlingReadEdit = (props) => {
  const { seedling, updateData, editing, categories } = props;

  return (
    <div className="swipe-slide adjust-icons">
      <p className="swipe-title title-ming">Etc</p>

      {editing ? (
        <React.Fragment>
          <SwipePanelContent icon="info" iconTitle="common name">
            <p className="modern-input">
              <label>common name *</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "commonName")}
                value={seedling.commonName || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="info" iconTitle="latin name">
            <p className="modern-input">
              <label>latin name *</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "latinName")}
                value={seedling.latinName || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="category">
            <p className="modern-input">
              <label>category *</label>
              <select
                onChange={(e) => updateData(e, "category")}
                value={seedling.category || ""}
              >
                <option value="" disabled={true}>
                  - Select a category -
                </option>
                {categories &&
                  categories.map((item, index) => {
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
                defaultValue={seedling.toxicity || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="methodSeedStart">
            <p className="modern-input">
              <label>method to start seed *</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "method")}
                value={seedling.method || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="indoorOutdoor">
            <p className="modern-input">
              <label>started indoor or outdoor</label>
              <select
                onChange={(e) => updateData(e, "startedIndoorOutdoor")}
                value={seedling.startedIndoorOutdoor || ""}
              >
                <option value="" disabled={true}>
                  - Select a start location -
                </option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="seedBrand">
            <p className="modern-input">
              <label>seed brand</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "seedBrand")}
                value={seedling.seedBrand || ""}
              />
            </p>
          </SwipePanelContent>

          {/*<SwipePanelContent icon="dateExpires">
					  <p className="modern-input">
						<label>date expires</label>
						<input type="date"
							   onBlur={(e) => updateData(e, 'dateExpires')}
							   defaultValue={seedling.dateExpires ? new Date(seedling.dateExpires).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>
					</SwipePanelContent>*/}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <SwipePanelContent icon="category">
            <small>category</small>
            <p>{seedling.category || "N/A"}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="methodSeedStart">
            <small>method to start seed</small>
            <p>{seedling.methodSeedStart || "N/A"}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="indoorOutdoor">
            <small>started indoor or outdoor</small>
            <p>{seedling.indoorOutdoor || "N/A"}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="seedBrand">
            <small>seed brand</small>
            <p>{seedling.seedBrand || "N/A"}</p>
          </SwipePanelContent>

          {/*<SwipePanelContent icon="dateExpires">
					  <small>date seed expires</small>
					  <p>{parseDate(seedling.dateExpires)}</p>
					</SwipePanelContent>*/}

          {seedling.toxicity && (
            <SwipePanelContent icon="toxicity">
              <small>toxicity</small>
              <p>{seedling.toxicity || "N/A"}</p>
            </SwipePanelContent>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

EtcSeedlingReadEdit.propTypes = {
  seedling: PropTypes.object.isRequired,
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
    editing
  };
})(EtcSeedlingReadEdit);
