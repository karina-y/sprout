import React, { ComponentClass } from "react";
import PropTypes from "prop-types";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@component";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { withTracker } from "meteor/react-meteor-data";
import { IPruningDeadheadingTrackerSchema } from "@model";
import {
  ModalId,
  TrackerDetailType,
  TrackerEditingType,
  TrackerType,
} from "@enum";
import { Session } from "meteor/session";
import { parseDate } from "@helper";

interface IPruningDeadheadingModalsProps {
  addTrackerDate: (e: Date, trackerType: TrackerType) => void;
  addTrackerDetails: (
    e: Date,
    trackerType: TrackerType,
    trackerDetailType: TrackerDetailType,
  ) => void;
  save: (type: TrackerEditingType | ModalId) => void;
  resetModal: () => void;
  activeModalId: ModalId;
  tracker: Array<IPruningDeadheadingTrackerSchema>;
  highlightDates: Array<Date>;
  pruneType: TrackerType;
  setPruneType: ({
    pruneType,
    newData,
  }: {
    pruneType: TrackerType | null;
    newData?: any; //TODO
  }) => void; //TODO the any type
  newDataTracker: IPruningDeadheadingTrackerSchema;
}

const PruningDeadheadingModals = (props: IPruningDeadheadingModalsProps) => {
  const {
    addTrackerDate,
    save,
    resetModal,
    activeModalId,
    tracker,
    highlightDates,
    pruneType,
    setPruneType,
    newDataTracker,
  } = props;

  return (
    <React.Fragment>
      <ItemAddEntryModal
        save={save}
        cancel={resetModal}
        activeModalId={activeModalId}
        modalId={ModalId.PRUNING_DEADHEADING_TRACKER}
        header="New pruning or deadheading entry"
      >
        <>
          {!pruneType && (
            <div className="flex-between">
              <label>
                Pruned{" "}
                <input
                  type="radio"
                  checked={pruneType === TrackerType.PRUNING_TRACKER}
                  onChange={() =>
                    pruneType !== TrackerType.PRUNING_TRACKER
                      ? setPruneType({ pruneType: TrackerType.PRUNING_TRACKER })
                      : setPruneType({
                          pruneType: null,
                          newData: null,
                        })
                  }
                />
              </label>
              <label>
                Deadheaded{" "}
                <input
                  type="radio"
                  checked={pruneType === TrackerType.DEADHEADING_TRACKER}
                  onChange={() =>
                    pruneType !== TrackerType.DEADHEADING_TRACKER
                      ? setPruneType({
                          pruneType: TrackerType.DEADHEADING_TRACKER,
                        })
                      : setPruneType({
                          pruneType: null,
                          newData: null,
                        })
                  }
                />
              </label>
              <label>
                Both{" "}
                <input
                  type="radio"
                  checked={
                    pruneType === TrackerType.PRUNING_DEADHEADING_TRACKER
                  }
                  onChange={() =>
                    pruneType !== TrackerType.PRUNING_DEADHEADING_TRACKER
                      ? setPruneType({
                          pruneType: TrackerType.PRUNING_DEADHEADING_TRACKER,
                        })
                      : setPruneType({
                          pruneType: null,
                          newData: null,
                        })
                  }
                />
              </label>
            </div>
          )}
        </>

        {pruneType && (
          //   @ts-ignore
          <DatePicker
            /*
            //@ts-ignore  */
            selected={newDataTracker ? newDataTracker.date : Date.now()}
            className="react-datepicker-wrapper"
            dateFormat="dd-MMMM-yyyy"
            popperPlacement="bottom"
            inline
            onSelect={(e) =>
              pruneType
                ? addTrackerDate(e, pruneType)
                : toast.warning("Please select an action below first.")
            }
            highlightDates={highlightDates}
          />
        )}
      </ItemAddEntryModal>
      {/*TODO the pruning deadheading tracker doesn't have action on it*/}
      <ItemViewHistoryModal
        cancel={resetModal}
        activeModalId={activeModalId}
        modalIdToDisplay={ModalId.PRUNING_DEADHEADING_TRACKER_HISTORY}
        header="Pruning - Deadheading History"
      >
        {tracker?.length ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tracker.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{parseDate(item.date)}</td>
                    <td>{item.action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No entries recorded</p>
        )}
      </ItemViewHistoryModal>
    </React.Fragment>
  );
};

PruningDeadheadingModals.propTypes = {
  addTrackerDate: PropTypes.func.isRequired,
  addTrackerDetails: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  activeModalId: PropTypes.string,
  tracker: PropTypes.array,
  diary: PropTypes.array,
  highlightDates: PropTypes.array,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const activeModalId = Session.get("activeModalId");

  return {
    activeModalId: activeModalId,
  } as IPruningDeadheadingModalsProps;
})(PruningDeadheadingModals) as ComponentClass<
  IPruningDeadheadingModalsProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;
