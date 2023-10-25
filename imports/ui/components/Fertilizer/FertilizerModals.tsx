import React, { ChangeEvent, ComponentClass } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import DatePicker from "react-datepicker";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@component";
import { parseDate } from "@helper";
import { UpdateTypesDep } from "@constant";
import { IFertilizerTrackerSchema } from "@model";
import {
  ModalId,
  TrackerDetailType,
  TrackerEditingType,
  TrackerType,
} from "@enum";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";

interface IFertilizerModalsProps {
  addTrackerDate: (e: Date, trackerType: TrackerType) => void;
  addTrackerDetails: (
    e: ChangeEvent<HTMLInputElement>,
    trackerType: TrackerType,
    detailType: TrackerDetailType,
  ) => void;
  save: (type: TrackerEditingType | ModalId) => void;
  resetModal: () => void;
  activeModalId: ModalId;
  tracker: Array<IFertilizerTrackerSchema>;
  newDataTracker: IFertilizerTrackerSchema;
  highlightDates: Array<Date>;
}

const FertilizerModals = (props: IFertilizerModalsProps) => {
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
        activeModalId={activeModalId}
        modalId={UpdateTypesDep.fertilizer.fertilizerEditModal}
        header="New fertilizer entry"
      >
        {/*
        //@ts-ignore */}
        <DatePicker
          /*
        //@ts-ignore */
          selected={newDataTracker ? newDataTracker.date : Date.now()}
          className="react-datepicker-wrapper"
          dateFormat="dd-MMMM-yyyy"
          popperPlacement="bottom"
          inline
          onSelect={(e) => addTrackerDate(e, TrackerType.FERTILIZER_TRACKER)}
          highlightDates={highlightDates}
        />

        <p className="modern-input for-modal">
          <label>fertilizer used</label>
          <input
            type="text"
            onChange={(e) =>
              addTrackerDetails(
                e,
                TrackerType.FERTILIZER_TRACKER,
                TrackerDetailType.FERTILIZER,
              )
            }
          />
        </p>
      </ItemAddEntryModal>

      <ItemViewHistoryModal
        cancel={resetModal}
        activeModalId={activeModalId}
        modalIdToDisplay={UpdateTypesDep.fertilizer.fertilizerHistoryModal}
        header="Fertilizing History"
      >
        {tracker?.length ? (
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const activeModalId = Session.get("activeModalId");

  return {
    activeModalId: activeModalId,
  } as IFertilizerModalsProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(FertilizerModals) as ComponentClass<IFertilizerModalsProps, any>;
