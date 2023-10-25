import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import DatePicker from "react-datepicker";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@component";
import { parseDate } from "@helper";
import { UpdateTypes } from "@constant";

const FertilizerModals = (props) => {
  const {
    addTrackerDate,
    addTrackerDetails,
    save,
    resetModal,
    activeModalId,
    tracker,
    newDataTracker,
    highlightDates,
  } = props;

  return (
    <React.Fragment>
      <ItemAddEntryModal
        save={save}
        cancel={resetModal}
        show={activeModalId}
        modalId={UpdateTypes.fertilizer.fertilizerEditModal}
        header="New fertilizer entry"
      >
        <DatePicker
          selected={newDataTracker ? newDataTracker.date : Date.now()}
          className="react-datepicker-wrapper"
          dateFormat="dd-MMMM-yyyy"
          popperPlacement="bottom"
          inline
          onSelect={(e) => addTrackerDate(e, "fertilizerTracker")}
          highlightDates={highlightDates}
        />

        <p className="modern-input for-modal">
          <label>fertilizer used</label>
          <input
            type="text"
            onChange={(e) =>
              addTrackerDetails(e, "fertilizerTracker", "fertilizer")
            }
          />
        </p>
      </ItemAddEntryModal>

      <ItemViewHistoryModal
        cancel={resetModal}
        show={activeModalId}
        modalId={UpdateTypes.fertilizer.fertilizerHistoryModal}
        header="Fertilizing History"
      >
        {tracker?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>{Meteor.isPro ? "Fertilizer" : "Food"}</th>
              </tr>
            </thead>
            <tbody>
              {tracker.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{parseDate(item.date)}</td>
                    <td>{item.fertilizer}</td>
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

FertilizerModals.propTypes = {
  addTrackerDate: PropTypes.func.isRequired,
  addTrackerDetails: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  activeModalId: PropTypes.string,
  tracker: PropTypes.array,
  newDataTracker: PropTypes.object,
  highlightDates: PropTypes.array,
};

export default withTracker(() => {
  const activeModalId = Session.get("activeModalId");

  return {
    activeModalId: activeModalId,
  };
})(FertilizerModals);
