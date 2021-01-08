import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import ItemAddEntryModal from "../Shared/ItemAddEntryModal";
import ItemViewHistoryModal from "../Shared/ItemViewHistoryModal";
import {
  parseDate,

} from "/imports/utils/helpers/plantData";
import UpdateTypes from "/imports/utils/constants/updateTypes";
import { withTracker } from "meteor/react-meteor-data";

const WaterModals = (props) => {
  const {
    addTrackerDate,
    save,
    resetModal,
    tracker,
    newDataTracker,
    highlightDates,
    modalOpen,
  } = props;

  return (
    <React.Fragment>
      <ItemAddEntryModal
        save={save}
        cancel={resetModal}
        show={modalOpen}
        type={UpdateTypes.water.waterEditModal}
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
        show={modalOpen}
        type={UpdateTypes.water.waterHistoryModal}
        header="Watering History"
      >
        {tracker && tracker.length > 0 ? (
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
  modalOpen: PropTypes.string,
};

export default withTracker(() => {
  const modalOpen = Session.get("modalOpen");

  return {
    modalOpen,
  };
})(WaterModals);
