import React, { ChangeEvent, ComponentClass } from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { withTracker } from "meteor/react-meteor-data";
import { Category } from "@api";
import { ISeedlingSchema } from "@model/seedling";
import { ICategorySchema } from "@model";
import { Session } from "meteor/session";
import { ModalId } from "@enum";

interface IEtcSeedlingReadEditProps {
  seedling: ISeedlingSchema;
  updateData: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    updateType: string,
  ) => void;
  editing: boolean;
  categories: Array<ICategorySchema>;
}

const EtcSeedlingReadEdit = (props: IEtcSeedlingReadEditProps) => {
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
          {/*
TODO do i want toxicity? it's not in the schema
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
*/}

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
          {/*
          TODO these aren't in the schema
          <SwipePanelContent icon="methodSeedStart">
            <small>method to start seed</small>
            <p>{seedling.methodSeedStart || "N/A"}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="indoorOutdoor">
            <small>started indoor or outdoor</small>
            <p>{seedling.indoorOutdoor || "N/A"}</p>
          </SwipePanelContent>
*/}

          <SwipePanelContent icon="seedBrand">
            <small>seed brand</small>
            <p>{seedling.seedBrand || "N/A"}</p>
          </SwipePanelContent>

          {/*<SwipePanelContent icon="dateExpires">
					  <small>date seed expires</small>
					  <p>{parseDate(seedling.dateExpires)}</p>
					</SwipePanelContent>*/}

          {/*  TODO do i want toxicity? it's not in the schema
        {seedling.toxicity && (
            <SwipePanelContent icon="toxicity">
              <small>toxicity</small>
              <p>{seedling.toxicity || "N/A"}</p>
            </SwipePanelContent>
          )}*/}
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const categories = Category.find({}).fetch();
  const editingType = Session.get("editingType");
  const editing = editingType === ModalId.ETC_TRACKER;

  return {
    categories,
    editing,
  } as IEtcSeedlingReadEditProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(EtcSeedlingReadEdit) as ComponentClass<IEtcSeedlingReadEditProps, any>;
