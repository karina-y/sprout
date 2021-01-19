import React from "react";
import PropTypes from "prop-types";
import SwipePanelContent from "../Shared/SwipePanelContent/SwipePanelContent";
import { parseDate } from "/imports/utils/helpers/plantData";

//todo change this name? it's read only
const DiaryReadEdit = (props) => {
  const { item } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Diary</p>

      <SwipePanelContent icon="diary">
        <div className="scroll-box">
          {item.diary && item.diary.length > 0
            ? item.diary.map((entry, index) => {
                return (
                  <div key={index}>
                    <p style={{ padding: 0 }}>
                      <b>Date: {parseDate(entry.date)}</b>
                    </p>
                    <p>{entry.entry || "N/A"}</p>
                  </div>
                );
              })
            : "No records available."}
        </div>
      </SwipePanelContent>
    </div>
  );
};

DiaryReadEdit.propTypes = {
  item: PropTypes.object.isRequired,
};

export default DiaryReadEdit;
