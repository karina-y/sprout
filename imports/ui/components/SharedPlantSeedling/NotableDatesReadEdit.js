import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";

const NotableDatesReadEdit = (props) => {
  const { seedling, updateData, editing } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Notable Dates</p>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>start date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, "startDate")}
            defaultValue={seedling.startDate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>sprout date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, "sproutDate")}
            defaultValue={seedling.sproutDate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>true leaves date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, "trueLeavesDate")}
            defaultValue={seedling.trueLeavesDate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule" iconTitle="days to germinate">
        <p className="modern-input">
          <label>days to germinate (ie 7-14 days)</label>
          <input
            type="text"
            onChange={(e) => updateData(e, "daysToGerminate")}
            defaultValue={seedling.daysToGerminate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>transplant date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, "transplantDate")}
            defaultValue={seedling.transplantDate || ""}
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

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>estimated harvest date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, "estHarvestDate")}
            defaultValue={seedling.estHarvestDate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>actual harvest date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, "actualHarvestDate")}
            defaultValue={seedling.actualHarvestDate || ""}
          />
        </p>
      </SwipePanelContent>

      {/*<SwipePanelContent icon="schedule">
			<p className="modern-input">
			  <label>date seed expires</label>
			  <input type="date"
					 onBlur={(e) => updateData(e, 'dateExpires')}
					 defaultValue={seedling.dateExpires || ''}/></p>
		  </SwipePanelContent>*/}
    </div>
  );
};

NotableDatesReadEdit.propTypes = {
  seedling: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.string,
};

export default NotableDatesReadEdit;
