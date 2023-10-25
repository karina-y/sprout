import React, { ChangeEvent, ComponentClass } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@component";
import { parseDate } from "@helper";
import { UpdateTypesDep } from "@constant";
import { withTracker } from "meteor/react-meteor-data";
import { RouteComponentPropsCustom } from "@type";
import {
  ModalId,
  TrackerDetailType,
  TrackerEditingType,
  TrackerType,
} from "@enum";
import { IPestTrackerSchema } from "@model";
import { Session } from "meteor/session";

interface IPestModalsProps extends RouteComponentPropsCustom {
  addTrackerDate: (e: Date, trackerType: TrackerType) => void;
  addTrackerDetails: (
    e: ChangeEvent<HTMLInputElement>,
    trackerType: TrackerType,
    detailType: TrackerDetailType,
  ) => void;
  save: (type: TrackerEditingType | ModalId) => void;
  resetModal: () => void;
  activeModalId?: ModalId;
  tracker?: Array<IPestTrackerSchema>;
  newDataTracker?: IPestTrackerSchema;
  highlightDates?: Array<Date>;
}

const PestModals = (props: IPestModalsProps) => {
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
        activeModalId={activeModalId as ModalId}
        modalId={UpdateTypesDep.pest.pestEditModal}
        header="New pest entry"
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
          onSelect={(e) => addTrackerDate(e, TrackerType.PEST_TRACKER)}
          highlightDates={highlightDates}
        />

        <p className="modern-input for-modal">
          <label>pest treated</label>
          <input
            type="text"
            onChange={(e) =>
              addTrackerDetails(
                e,
                TrackerType.PEST_TRACKER,
                TrackerDetailType.PEST,
              )
            }
          />
        </p>

        <p className="modern-input for-modal">
          <label>treatment method</label>
          <input
            type="text"
            onChange={(e) =>
              addTrackerDetails(
                e,
                TrackerType.PEST_TRACKER,
                TrackerDetailType.TREATMENT,
              )
            }
          />
        </p>
      </ItemAddEntryModal>

      <ItemViewHistoryModal
        cancel={resetModal}
        activeModalId={activeModalId}
        modalIdToDisplay={UpdateTypesDep.pest.pestHistoryModal}
        header="Pest History"
      >
        {tracker?.length ? (
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const activeModalId = Session.get("activeModalId");

  return {
    activeModalId: activeModalId,
  } as IPestModalsProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(PestModals) as ComponentClass<IPestModalsProps, any>;
