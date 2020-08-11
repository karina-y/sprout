import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent'
import { parseDate } from '../../../utils/plantData'

const DiaryReadEdit = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">Diary</p>

		  <SwipePanelContent icon="diary">

			<div className="scroll-box">
			  {props.item.diary && props.item.diary.length > 0 ?
					  props.item.diary.map((item, index) => {
						return <div key={index}>
						  <p style={{padding: 0}}><b>Date: {parseDate(item.date)}</b></p>
						  <p>{item.entry || 'N/A'}</p>
						</div>
					  })
					  :
					  'No records available.'
			  }
			</div>

		  </SwipePanelContent>
		</div>
)


DiaryReadEdit.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default DiaryReadEdit;
