import React, { ChangeEvent, ComponentClass } from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { withTracker } from "meteor/react-meteor-data";
import { IPruningDeadheadingSchema } from "@model";
import { ModalId, PlantDetailType } from "@enum";
import { Session } from "meteor/session";

interface IPruningDeadheadingReadEditProProps {
  plant: IPruningDeadheadingSchema;
  updateData: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    type: PlantDetailType,
  ) => void;
  editing: boolean;
}

const PruningDeadheadingReadEditPro = (
  props: IPruningDeadheadingReadEditProProps,
) => {
  const { plant, updateData, editing } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Pruning - Deadheading</p>

      {editing ? (
        <React.Fragment>
          {/*<SwipePanelContent icon="pruning" iconTitle="pruning schedule">
					  <p className="modern-input">
						Prune every <input type="number"
										   min="0"
										   inputMode="numeric"
										   pattern="[0-9]*"
										   className="small"
										   onChange={(e) => updateData(e, 'pruningSchedule')}
										   value={plant.pruningSchedule || ''}/> days
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="deadheading" iconTitle="deadheading schedule">
					  <p className="modern-input">
						Deadhead every <input type="number"
											  min="0"
											  inputMode="numeric"
											  pattern="[0-9]*"
											  className="small"
											  onChange={(e) => updateData(e, 'deadheadingSchedule')}
											  value={plant.deadheadingSchedule || ''}/> days
					  </p>
					</SwipePanelContent>*/}

          <SwipePanelContent icon="pruning" iconTitle="pruning preference">
            <p className="modern-input">
              <label>pruning preference</label>
              <input
                type="text"
                onChange={(e) =>
                  updateData(e, PlantDetailType.PRUNING_PREFERENCE)
                }
                defaultValue={plant.pruningPreference || ""}
              />
            </p>
          </SwipePanelContent>

          <SwipePanelContent
            icon="deadheading"
            iconTitle="deadheading preference"
          >
            <p className="modern-input">
              <label>deadheading preference</label>
              <input
                type="text"
                onChange={(e) =>
                  updateData(e, PlantDetailType.DEADHEADING_PREFERENCE)
                }
                defaultValue={plant.deadheadingPreference || ""}
              />
            </p>
          </SwipePanelContent>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/*<SwipePanelContent icon="pruning"
									   iconTitle="pruning schedule"
									   additionalOuterClasses="top-align">
					  <p>{plant.pruningSchedule ? `Prune every ${plant.pruningSchedule} days` : 'No pruning schedule entered'}</p>
					  {plant.pruningSchedule &&
					  <p>Due in {plant.pruningSchedule - plant.daysSincePruned} days</p>}
					</SwipePanelContent>

					<SwipePanelContent icon="deadheading"
									   iconTitle="deadheading schedule"
									   additionalOuterClasses="top-align">
					  <p>{plant.deadheadingSchedule ? `Deadhead every ${plant.deadheadingSchedule} days` : 'No deadheading schedule entered'}</p>
					  {plant.deadheadingSchedule &&
					  <p>Due in {plant.deadheadingSchedule - plant.daysSinceDeadheaded} days</p>}
					</SwipePanelContent>*/}

          <SwipePanelContent icon="pruning" iconTitle="pruning preference">
            <p>
              {plant.pruningPreference
                ? `${plant.pruningPreference}`
                : "No pruning preference entered"}
            </p>
          </SwipePanelContent>

          <SwipePanelContent
            icon="deadheading"
            iconTitle="deadheading preference"
          >
            <p>
              {plant.deadheadingPreference
                ? `${plant.deadheadingPreference}`
                : "No deadheading preference entered"}
            </p>
          </SwipePanelContent>
        </React.Fragment>
      )}
    </div>
  );
};

PruningDeadheadingReadEditPro.propTypes = {
  plant: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const editingType = Session.get("editingType");
  const editing = editingType === ModalId.PRUNING_DEADHEADING_TRACKER;

  return {
    editing,
  } as IPruningDeadheadingReadEditProProps;
})(PruningDeadheadingReadEditPro) as ComponentClass<
  IPruningDeadheadingReadEditProProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;
