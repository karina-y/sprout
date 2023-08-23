import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@componentV2";
import { parseDate } from "@helper";
import { UpdateTypes } from "@constantV2";
import { withTracker } from "meteor/react-meteor-data";

const SoilCompModals = (props) => {
  const {
    addTrackerDate,
    addTrackerDetails,
    save,
    resetModal,
    modalOpen,
    tracker,
    newDataTracker,
    highlightDates,
    category,
  } = props;

  return (
    <React.Fragment>
      <ItemAddEntryModal
        save={save}
        cancel={resetModal}
        show={modalOpen}
        type={UpdateTypes.soilComp.soilCompEditModal}
        header="New soil composition entry"
      >
        <DatePicker
          selected={newDataTracker ? newDataTracker.date : Date.now()}
          className="react-datepicker-wrapper"
          dateFormat="dd-MMMM-yyyy"
          popperPlacement="bottom"
          inline
          onSelect={(e) =>
            addTrackerDate(e, UpdateTypes.soilComp.soilCompEditModal)
          }
          highlightDates={highlightDates}
        />

        {category === "potted" ? (
          <p className="modern-input for-modal">
            <label>Soil Moisture %</label>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) =>
                addTrackerDetails(
                  e,
                  UpdateTypes.soilComp.soilCompEditModal,
                  "moisture"
                )
              }
            />
          </p>
        ) : (
          <p className="modern-input for-modal">
            <label>pH Reading</label>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) =>
                addTrackerDetails(
                  e,
                  UpdateTypes.soilComp.soilCompEditModal,
                  "ph"
                )
              }
            />
          </p>
        )}
      </ItemAddEntryModal>

      <ItemViewHistoryModal
        cancel={resetModal}
        show={modalOpen}
        type={UpdateTypes.soilComp.soilCompHistoryModal}
        header="Soil Composition History"
      >
        {tracker?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th width="50%">Date</th>
                {category === "potted" ? (
                  <th width="50%">Moisture</th>
                ) : (
                  <th width="50%">pH</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tracker.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{parseDate(item.date)}</td>
                    {category === "potted" ? (
                      <td>
                        {item.moisture
                          ? `${Math.round(item.moisture * 100)}%`
                          : "N/A"}
                      </td>
                    ) : (
                      <td>{item.ph || "N/A"}</td>
                    )}
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

SoilCompModals.propTypes = {
  addTrackerDate: PropTypes.func.isRequired,
  addTrackerDetails: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.string,
  tracker: PropTypes.array,
  newDataTracker: PropTypes.object,
  highlightDates: PropTypes.array,
  category: PropTypes.string, //TODO isRequired
};

export default withTracker(() => {
  const modalOpen = Session.get("modalOpen");

  return {
    modalOpen,
  };
})(SoilCompModals);
