import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@component";
import { parseDate } from "@helper";
import { UpdateTypes } from "@constant";
import { withTracker } from "meteor/react-meteor-data";

const WaterModals = (props) => {
  const {
    addTrackerDate,
    save,
    resetModal,
    tracker,
    newDataTracker,
    highlightDates,
    activeModalId,
  } = props;

  return (
    <React.Fragment>
      <ItemAddEntryModal
        save={save}
        cancel={resetModal}
        show={activeModalId}
        modalId={UpdateTypes.water.waterEditModal}
        header="New water entry"
      >
        <DatePicker
          selected={newDataTracker ? newDataTracker.date : Date.now()}
          className="react-datepicker-wrapper"
          dateFormat="dd-MMMM-yyyy"
          popperPlacement="bottom"
          inline
          onSelect={(e) => addTrackerDate(e, "waterTracker")}
          highlightDates={highlightDates}
        />
      </ItemAddEntryModal>

      <ItemViewHistoryModal
        cancel={resetModal}
        show={activeModalId}
        modalId={UpdateTypes.water.waterHistoryModal}
        header="Watering History"
      >
        {tracker?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tracker.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{parseDate(item.date)}</td>
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

WaterModals.propTypes = {
  addTrackerDate: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  tracker: PropTypes.array,
  newDataTracker: PropTypes.object,
  highlightDates: PropTypes.array,
  activeModalId: PropTypes.string,
};

export default withTracker(() => {
  const activeModalId = Session.get("activeModalId");

  return {
    activeModalId: activeModalId,
  };
})(WaterModals);
