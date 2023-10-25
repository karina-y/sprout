import React, { ChangeEvent } from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { RouteComponentPropsCustom } from "@type";
import { ISeedlingSchema } from "@model/seedling";
import { SeedlingUpdateType } from "@enum";

interface INotableDatesReadEditProps extends RouteComponentPropsCustom {
  seedling: ISeedlingSchema;
  updateData: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    type: SeedlingUpdateType,
  ) => void;
  editing: boolean;
}

const NotableDatesReadEdit = (props: INotableDatesReadEditProps) => {
  const { seedling, updateData } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Notable Dates</p>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>start date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, SeedlingUpdateType.START_DATE)}
            /*
           //@ts-ignore */
            defaultValue={seedling.startDate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>sprout date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, SeedlingUpdateType.SPROUT_DATE)}
            /*
             //@ts-ignore */
            defaultValue={seedling.sproutDate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>true leaves date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, SeedlingUpdateType.TRUE_LEAVES_DATE)}
            /*
             //@ts-ignore */
            defaultValue={seedling.trueLeavesDate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule" iconTitle="days to germinate">
        <p className="modern-input">
          <label>days to germinate (ie 7-14 days)</label>
          <input
            type="text"
            onChange={(e) =>
              updateData(e, SeedlingUpdateType.DAYS_TO_GERMINATE)
            }
            defaultValue={seedling.daysToGerminate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>transplant date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, SeedlingUpdateType.TRANSPLANT_DATE)}
            /*
             //@ts-ignore */
            defaultValue={seedling.transplantDate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule" iconTitle="days to germinate">
        <p className="modern-input">
          <label>days to harvest (ie 60-90 days)</label>
          <input
            type="text"
            onChange={(e) => updateData(e, SeedlingUpdateType.DAYS_TO_HARVEST)}
            defaultValue={seedling.daysToHarvest || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>estimated harvest date</label>
          <input
            type="date"
            onBlur={(e) => updateData(e, SeedlingUpdateType.EST_HARVEST_DATE)}
            /*
             //@ts-ignore */
            defaultValue={seedling.estHarvestDate || ""}
          />
        </p>
      </SwipePanelContent>

      <SwipePanelContent icon="schedule">
        <p className="modern-input">
          <label>actual harvest date</label>
          <input
            type="date"
            onBlur={(e) =>
              updateData(e, SeedlingUpdateType.ACTUAL_HARVEST_DATE)
            }
            /*
             //@ts-ignore */
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
