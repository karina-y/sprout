import React, { ComponentClass } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@component";
import { parseDate } from "@helper";
import { withTracker } from "meteor/react-meteor-data";
import { IWaterTrackerSchema } from "@model";
import { ModalId, WaterDetailType } from "@enum";
import { Session } from "meteor/session";

interface IWaterModalsProps {
  addTrackerDate: (e: Date) => void;
  save: (type: WaterDetailType) => void;
  resetModal: () => void;
  activeModalId: ModalId;
  tracker: Array<IWaterTrackerSchema>;
  newDataTracker: IWaterTrackerSchema;
  highlightDates: Array<Date>;
}

const WaterModals = (props: IWaterModalsProps) => {
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
    <>
      {/* water tracker entry modal */}
      <ItemAddEntryModal
        //@ts-ignore
        save={save}
        cancel={resetModal}
        activeModalId={activeModalId as ModalId}
        /* TODO change this to water_tracker_add */
        modalId={ModalId.WATER_TRACKER}
        /*TODO left off here, trying to identify where i need ModalId and where i can use WaterDetailType */
        editingType={WaterDetailType.WATER_TRACKER}
        header="New water entry"
      >
        <DatePicker
          selected={
            newDataTracker
              ? (newDataTracker.date as Date)
              : (Date.now() as unknown as Date)
          }
          className="react-datepicker-wrapper"
          dateFormat="dd-MMMM-yyyy"
          popperPlacement="bottom"
          inline
          onChange={(e) => addTrackerDate(e as Date)}
          highlightDates={highlightDates}
        />
      </ItemAddEntryModal>

      {/* water tracker history modal */}
      <ItemViewHistoryModal
        cancel={resetModal}
        activeModalId={activeModalId}
        modalIdToDisplay={ModalId.WATER_TRACKER_HISTORY}
        header="Watering History"
      >
        {tracker?.length ? (
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
    </>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const activeModalId = Session.get("activeModalId");

  return {
    activeModalId: activeModalId,
  } as IWaterModalsProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(WaterModals) as ComponentClass<IWaterModalsProps, any>;
