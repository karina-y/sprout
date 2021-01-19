import React from 'react'
import PropTypes from 'prop-types'
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent'

const FertilizerAdd = (props) => {
  const {updateData, item} = props

  return (
		  <div className="swipe-slide">
			<p className="swipe-title title-ming">Fertilizer</p>

			<SwipePanelContent icon="schedule" iconTitle="fertilizer schedule">
			  <p className="modern-input">
				Fertilize every{' '}
				<input
						type="number"
						min="0"
						inputMode="numeric"
						pattern="[0-9]*"
						className="small"
						onChange={(e) => updateData(e, 'fertilizerSchedule')}
						value={item.fertilizerSchedule || ''}
				/>{' '}
				days
			  </p>
			</SwipePanelContent>

			<SwipePanelContent icon="fertilizer">
			  <p className="modern-input">
				<label>preferred fertilizer</label>
				<input
						type="text"
						onChange={(e) => updateData(e, 'preferredFertilizer')}
						value={item.preferredFertilizer || ''}
				/>
			  </p>
			</SwipePanelContent>
		  </div>
  )
}

FertilizerAdd.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
}

export default FertilizerAdd
