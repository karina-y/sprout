import React from "react";
import PropTypes from "prop-types";
import ItemAddEntryModal from "../Shared/ItemAddEntryModal";
import ItemViewHistoryModal from "../Shared/ItemViewHistoryModal";
import { parseDate } from "../../../utils/helpers/plantData";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import UpdateTypes from "../../../utils/constants/updateTypes";

const PruningDeadheadingModals = (props) => (
  <React.Fragment>
    <ItemAddEntryModal
      save={props.save}
      cancel={props.resetModal}
      show={props.modalOpen}
      type={UpdateTypes.pruningDeadheading.pruningDeadheadingEditModal}
      header="New pruning or deadheading entry"
    >
      {!props.pruneType && (
        <div className="flex-between">
          <label>
            Pruned{" "}
            <input
              type="radio"
              checked={props.pruneType === "pruningTracker"}
              onChange={() =>
                props.pruneType !== "pruningTracker"
                  ? props.setPruneType({ pruneType: "pruningTracker" })
                  : props.setPruneType({
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
              checked={props.pruneType === "deadheadingTracker"}
              onChange={() =>
                props.pruneType !== "deadheadingTracker"
                  ? props.setPruneType({ pruneType: "deadheadingTracker" })
                  : props.setPruneType({
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
              checked={props.pruneType === "pruningDeadheadingTracker"}
              onChange={() =>
                props.pruneType !== "pruningDeadheadingTracker"
                  ? props.setPruneType({
                      pruneType: "pruningDeadheadingTracker",
                    })
                  : props.setPruneType({
                      pruneType: null,
                      newData: null,
                    })
              }
            />
          </label>
        </div>
      )}

      {props.pruneType && (
        <DatePicker
          selected={props.newDataTracker ? props.newDataTracker.date : Date.now()}
          className="react-datepicker-wrapper"
          dateFormat="dd-MMMM-yyyy"
          popperPlacement="bottom"
          inline
          onSelect={(e) =>
            props.pruneType
              ? props.addTrackerDate(e, props.pruneType)
              : toast.warning("Please select an action below first.")
          }
          highlightDates={props.highlightDates}
        />
      )}
    </ItemAddEntryModal>

    <ItemViewHistoryModal
      cancel={props.resetModal}
      show={props.modalOpen}
      type={UpdateTypes.pruningDeadheading.pruningDeadheadingHistoryModal}
      header="Pruning - Deadheading History"
    >
      {props.tracker && props.tracker.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {props.tracker.map((item, index) => {
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

export default PruningDeadheadingModals;
