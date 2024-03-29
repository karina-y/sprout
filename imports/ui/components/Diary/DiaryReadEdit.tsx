import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { parseDate } from "@helper";
import { IDiarySchema } from "@model/diary";

interface IDiaryReadEditProps {
  item: IDiarySchema;
}

//todo change this name? it's read only
const DiaryReadEdit = (props: IDiaryReadEditProps) => {
  const { item } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Diary</p>

      <SwipePanelContent icon="diary">
        <div className="scroll-box">
          {item.diary?.length
            ? item.diary.map((entry, index: number) => {
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
