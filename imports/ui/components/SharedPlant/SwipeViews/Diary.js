import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'

const Diary = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">Diary</p>

		  <SwipePanelContent icon="diary">

			<div className="scroll-box">
			  {props.plant.diary && props.plant.diary.length > 0 ?
					  props.plant.diary.map((item, index) => {
						return <div key={index}>
						  <p style={{padding: 0}}><b>Date: {new Date(item.date).toLocaleDateString()}</b></p>
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


Diary.propTypes = {
  plant: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default Diary;
