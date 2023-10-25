import React, { ChangeEvent, ComponentClass, ReactElement } from "react";
import PropTypes from "prop-types";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@component";
import { parseDate } from "@helper";
import { withTracker } from "meteor/react-meteor-data";
import { RouteComponentPropsCustom } from "@type";
import {
  ModalId,
  PlantDetailType,
  TrackerEditingType,
  UpdateType,
} from "@enum";
import { ISubDiarySchema } from "@model/diary";
import { Session } from "meteor/session";

interface IDiaryModalsProps extends RouteComponentPropsCustom {
  updateData: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: PlantDetailType,
  ) => void;
  save: (type: UpdateType | ModalId | TrackerEditingType) => void; //TODO do i want TrackerEditingType?
  resetModal: () => void;
  activeModalId?: ModalId; // ModalOpen
  diary?: Array<ISubDiarySchema>;
}

function DiaryModals(props: IDiaryModalsProps): ReactElement {
  const { save, resetModal, activeModalId, updateData, diary } = props;

  return (
    <>
      <ItemAddEntryModal
        save={save}
        cancel={resetModal}
        activeModalId={activeModalId as ModalId}
        modalId={ModalId.DIARY_TRACKER}
      >
        <p className="modern-input for-modal">
          <label>new diary entry</label>
          {/*  TODO update type of diary? */}
          <textarea
            rows={6}
            onChange={(e) => updateData(e, PlantDetailType.DIARY)}
          />
        </p>
      </ItemAddEntryModal>

      <ItemViewHistoryModal
        cancel={resetModal}
        activeModalId={activeModalId}
        modalIdToDisplay={ModalId.DIARY_TRACKER_HISTORY}
        header="Diary History"
      >
        {diary?.length ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Entry</th>
              </tr>
            </thead>
            <tbody>
              {diary?.map((item: ISubDiarySchema, index: number) => (
                <tr key={index}>
                  <td>{parseDate(item.date)}</td>
                  <td>{item.entry || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No diary recorded</p>
        )}
      </ItemViewHistoryModal>
    </>
  );
}

DiaryModals.propTypes = {
  updateData: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  activeModalId: PropTypes.string,
  diary: PropTypes.array,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withTracker((_props: any) => {
  const activeModalId: string = Session.get("activeModalId");

  return {
    activeModalId,
  } as IDiaryModalsProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(DiaryModals) as ComponentClass<IDiaryModalsProps, any>;
