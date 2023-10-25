import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@component";
import { parseDate } from "@helper";
import { UpdateTypes } from "@constant";
import { withTracker } from "meteor/react-meteor-data";

const PestModals = (props) => {
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
        modalId={UpdateTypes.pest.pestEditModal}
        header="New pest entry"
      >
        <DatePicker
          selected={newDataTracker ? newDataTracker.date : Date.now()}
          className="react-datepicker-wrapper"
          dateFormat="dd-MMMM-yyyy"
          popperPlacement="bottom"
          inline
          onSelect={(e) => addTrackerDate(e, "pestTracker")}
          highlightDates={highlightDates}
        />

        <p className="modern-input for-modal">
          <label>pest treated</label>
          <input
            type="text"
            onChange={(e) => addTrackerDetails(e, "pestTracker", "pest")}
          />
        </p>

        <p className="modern-input for-modal">
          <label>treatment method</label>
          <input
            type="text"
            onChange={(e) => addTrackerDetails(e, "pestTracker", "treatment")}
          />
        </p>
      </ItemAddEntryModal>

      <ItemViewHistoryModal
        cancel={resetModal}
        show={activeModalId}
        modalId={UpdateTypes.pest.pestHistoryModal}
        header="Pest History"
      >
        {tracker?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Pest</th>
                <th>Treatment</th>
              </tr>
            </thead>
            <tbody>
              {tracker.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{parseDate(item.date)}</td>
                    <td>{item.pest || "N/A"}</td>
                    <td>{item.treatment || "N/A"}</td>
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

PestModals.propTypes = {
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
})(PestModals);
