import React from "react";
import PropTypes from "prop-types";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";
import { withTracker } from "meteor/react-meteor-data";
import Category from "../../../api/Category/Category";
import { parseDate } from "/imports/utils/helpers/plantData";
import { Session } from "meteor/session";
import UpdateTypes from "/imports/utils/constants/updateTypes";

const SeedlingDatesReadEdit = (props) => {
  const { seedling, updateData, editing } = props;

  return (
    <div className="swipe-slide adjust-icons">
      <p className="swipe-title title-ming">Dates</p>

      {/*TODO - this format: {editingType === UpdateTypes.water.waterEditModal ?*/}
      {editing ? (
        <React.Fragment>
          <SwipePanelContent icon="sowDate">
            <p className="modern-input">
              <label>sow date</label>
              <input
                type="date"
                onBlur={(e) => updateData(e, "sowDate")}
                defaultValue={
                  seedling.sowDate
                    ? new Date(seedling.sowDate).toJSON().slice(0, 10)
                    : new Date().toJSON().slice(0, 10)
                }
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="sprout date">
            <p className="modern-input">
              <label>sprout date</label>
              <input
                type="date"
                onBlur={(e) => updateData(e, "sproutDate")}
                defaultValue={
                  seedling.sproutDate
                    ? new Date(seedling.sproutDate).toJSON().slice(0, 10)
                    : new Date().toJSON().slice(0, 10)
                }
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="trueLeavesDate">
            <p className="modern-input">
              <label>true leaves date</label>
              <input
                type="date"
                onBlur={(e) => updateData(e, "trueLeavesDate")}
                defaultValue={
                  seedling.trueLeavesDate
                    ? new Date(seedling.trueLeavesDate).toJSON().slice(0, 10)
                    : new Date().toJSON().slice(0, 10)
                }
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="info">
            <p className="modern-input">
              <label>days to germinate (ie 7-14 days)</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "daysToGerminate")}
                defaultValue={seedling.daysToGerminate || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="days to germinate">
            <p className="modern-input">
              <label>days to harvest (ie 60-90 days)</label>
              <input
                type="text"
                onChange={(e) => updateData(e, "daysToHarvest")}
                defaultValue={seedling.daysToHarvest || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="estimated harvest date">
            <p className="modern-input">
              <label>estimated harvest date</label>
              <input
                type="date"
                onBlur={(e) => updateData(e, "estHarvestDate")}
                defaultValue={
                  seedling.estHarvestDate
                    ? new Date(seedling.estHarvestDate).toJSON().slice(0, 10)
                    : new Date().toJSON().slice(0, 10)
                }
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="actual harvest date">
            <p className="modern-input">
              <label>actual harvest date</label>
              <input
                type="date"
                onBlur={(e) => updateData(e, "actualHarvestDate")}
                defaultValue={
                  seedling.actualHarvestDate
                    ? new Date(seedling.actualHarvestDate).toJSON().slice(0, 10)
                    : new Date().toJSON().slice(0, 10)
                }
              />
            </p>
          </SwipePanelContent>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <SwipePanelContent icon="sowDate">
            <small>sow date</small>
            <p>{parseDate(seedling.sowDate)}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="sprout date">
            <small>sprout date</small>
            <p>{parseDate(seedling.sproutDate)}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="trueLeavesDate">
            <small>true leaves date</small>
            <p>{parseDate(seedling.trueLeavesDate)}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="days to germinate">
            <small>days to germinate</small>
            <p>{seedling.daysToGerminate || "N/A"}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="transplant date">
            <small>transplant date</small>
            <p>{parseDate(seedling.transplantDate)}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="days to harvest">
            <small>days to harvest</small>
            <p>{seedling.daysToHarvest || "N/A"}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="estimated harvest date">
            <small>estimated harvest date</small>
            <p>{parseDate(seedling.estHarvestDate)}</p>
          </SwipePanelContent>

          <SwipePanelContent icon="schedule" iconTitle="actual harvest date">
            <small>actual harvest date</small>
            <p>{parseDate(seedling.actualHarvestDate)}</p>
          </SwipePanelContent>
        </React.Fragment>
      )}
    </div>
  );
};

SeedlingDatesReadEdit.propTypes = {
  seedling: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  categories: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const categories = Category.find({}).fetch();
  const editingType = Session.get("editingType");
  const editing = editingType === UpdateTypes.general.dates;

  return {
    categories,
    editing,
  };
})(SeedlingDatesReadEdit);
