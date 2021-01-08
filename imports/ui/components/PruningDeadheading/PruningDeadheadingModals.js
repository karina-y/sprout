import React from "react";
import PropTypes from "prop-types";
import ItemAddEntryModal from "../Shared/ItemAddEntryModal";
import ItemViewHistoryModal from "../Shared/ItemViewHistoryModal";
import { parseDate } from "/imports/utils/helpers/plantData";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import UpdateTypes from "/imports/utils/constants/updateTypes";
import { withTracker } from 'meteor/react-meteor-data'

const PruningDeadheadingModals = (props) => {
  const {
    addTrackerDate,
    save,
    resetModal,
    modalOpen,
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
        show={modalOpen}
        type={UpdateTypes.pruningDeadheading.pruningDeadheadingEditModal}
        header="New pruning or deadheading entry"
      >
        {!pruneType && (
          <div className="flex-between">
            <label>
              Pruned{" "}
              <input
                type="radio"
                checked={pruneType === "pruningTracker"}
                onChange={() =>
                  pruneType !== "pruningTracker"
                    ? setPruneType({ pruneType: "pruningTracker" })
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
                checked={pruneType === "deadheadingTracker"}
                onChange={() =>
                  pruneType !== "deadheadingTracker"
                    ? setPruneType({ pruneType: "deadheadingTracker" })
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
                checked={pruneType === "pruningDeadheadingTracker"}
                onChange={() =>
                  pruneType !== "pruningDeadheadingTracker"
                    ? setPruneType({
                        pruneType: "pruningDeadheadingTracker",
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

        {pruneType && (
          <DatePicker
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

      <ItemViewHistoryModal
        cancel={resetModal}
        show={modalOpen}
        type={UpdateTypes.pruningDeadheading.pruningDeadheadingHistoryModal}
        header="Pruning - Deadheading History"
      >
        {tracker && tracker.length > 0 ? (
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
  modalOpen: PropTypes.string,
  tracker: PropTypes.array,
  diary: PropTypes.array,
  highlightDates: PropTypes.array,
};

export default withTracker(() => {
  const modalOpen = Session.get("modalOpen");

  return {
    modalOpen,
  };
})(PruningDeadheadingModals);
