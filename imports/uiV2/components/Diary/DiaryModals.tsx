import React from "react";
import PropTypes from "prop-types";
import { ItemAddEntryModal, ItemViewHistoryModal } from "@componentV2";
import { parseDate } from "@helper";
import { UpdateTypes } from "@constantV2";
import { withTracker } from "meteor/react-meteor-data";

const DiaryModals = (props) => {
  const { save, resetModal, modalOpen, updateData, diary } = props;

  return (
    <React.Fragment>
      <ItemAddEntryModal
        save={save}
        cancel={resetModal}
        show={modalOpen}
        type={UpdateTypes.diary.diaryEditModal}
      >
        <p className="modern-input for-modal">
          <label>new diary entry</label>
          <textarea rows="6" onChange={(e) => updateData(e, "diary")} />
        </p>
      </ItemAddEntryModal>

      <ItemViewHistoryModal
        cancel={resetModal}
        show={modalOpen}
        type={UpdateTypes.diary.diaryHistoryModal}
        header="Diary History"
      >
        {diary?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Entry</th>
              </tr>
            </thead>
            <tbody>
              {diary.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{parseDate(item.date)}</td>
                    <td>{item.entry || "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No diary recorded</p>
        )}
      </ItemViewHistoryModal>
    </React.Fragment>
  );
};

DiaryModals.propTypes = {
  updateData: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.string,
  diary: PropTypes.array,
};

export default withTracker(() => {
  const modalOpen = Session.get("modalOpen");

  return {
    modalOpen,
  };
})(DiaryModals);
