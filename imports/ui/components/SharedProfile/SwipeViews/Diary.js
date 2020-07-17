import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../../Shared/SwipePanelContent'

const Diary = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">Diary</p>

		  <SwipePanelContent icon="diary">

			<div className="scroll-box">
			  {props.profile.diary && props.profile.diary.length > 0 ?
					  props.profile.diary.map((item, index) => {
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
  profile: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default Diary;
