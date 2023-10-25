import React, { ChangeEvent, ComponentClass } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@component";
import { parseDate } from "@helper";
import { UpdateTypesDep } from "@constant";
import { withTracker } from "meteor/react-meteor-data";
import { RouteComponentPropsCustom } from "@type";
import { ISoilCompositionTrackerSchema, ITrackerSchema } from "@model";
import {
  Categories,
  ModalId,
  TrackerDetailType,
  TrackerEditingType,
  TrackerType,
} from "@enum";

import { Session } from "meteor/session";

interface ISoilCompAddProProps extends RouteComponentPropsCustom {
  addTrackerDate: (e: Date, trackerType: TrackerType) => void;
  addTrackerDetails: (
    e: ChangeEvent<HTMLInputElement>,
    trackerType: TrackerType,
    detailType: TrackerDetailType,
  ) => void;
  save: (type: TrackerEditingType | ModalId) => void;
  resetModal: () => void;
  activeModalId: ModalId;
  tracker: Array<ISoilCompositionTrackerSchema>;
  newDataTracker: ITrackerSchema;
  highlightDates: Array<Date>;
  category: Categories;
}

const SoilCompModals = (props: ISoilCompAddProProps) => {
  const {
    addTrackerDate,
    addTrackerDetails,
    save,
    resetModal,
    activeModalId,
    tracker,
    newDataTracker,
    highlightDates,
    category,
  } = props;

  return (
    <React.Fragment>
      <ItemAddEntryModal
        /*
          // @ts-ignore */
        save={save}
        cancel={resetModal}
        activeModalId={activeModalId}
        modalId={ModalId.SOIL_COMP_TRACKER}
        header="New soil composition entry"
      >
        <DatePicker
          /*
              // @ts-ignore */
          selected={newDataTracker ? newDataTracker.date : Date.now()}
          className="react-datepicker-wrapper"
          dateFormat="dd-MMMM-yyyy"
          popperPlacement="bottom"
          inline
          onSelect={(e) => addTrackerDate(e, TrackerType.SOIL_COMP_TRACKER)}
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
                  TrackerType.SOIL_COMP_TRACKER,
                  TrackerDetailType.MOISTURE,
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
                  TrackerType.SOIL_COMP_TRACKER,
                  TrackerDetailType.PH,
                )
              }
            />
          </p>
        )}
      </ItemAddEntryModal>

      {/*
      //@ts-ignore */}
      <ItemViewHistoryModal
        cancel={resetModal}
        activeModalId={activeModalId}
        modalIdToDisplay={UpdateTypesDep.soilComp.soilCompHistoryModal}
        header="Soil Composition History"
      >
        {tracker?.length ? (
          <table>
            <thead>
              <tr>
                {/*
                //@ts-ignore */}
                <th width="50%">Date</th>
                {category === "potted" ? (
                  //   @ts-ignore
                  <th width="50%">Moisture</th>
                ) : (
                  //   @ts-ignore
                  <th width="50%">pH</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tracker.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{parseDate(item.date)}</td>
                    {category === Categories.POTTED ? (
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
  activeModalId: PropTypes.string,
  tracker: PropTypes.array,
  newDataTracker: PropTypes.object,
  highlightDates: PropTypes.array,
  category: PropTypes.string, //TODO isRequired
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const activeModalId = Session.get("activeModalId");

  return {
    activeModalId: activeModalId,
  } as ISoilCompAddProProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(SoilCompModals) as ComponentClass<ISoilCompAddProProps, any>;
