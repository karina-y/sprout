import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import ItemAddEntryModal from '../../Shared/ItemAddEntryModal'
import ItemViewHistoryModal from '../../Shared/ItemViewHistoryModal'
import { parseDate } from '../../../../utils/plantData'

const WaterModals = (props) => (
		<React.Fragment>
		  <ItemAddEntryModal save={props.save}
							 cancel={props.resetModal}
							 show={props.modalOpen}
							 type="waterTracker"
							 header="New water entry">
			<DatePicker
					selected={props.newDataTracker ? props.newDataTracker.date : Date.now()}
					className="react-datepicker-wrapper"
					dateFormat="dd-MMMM-yyyy"
					popperPlacement="bottom"
					inline
					onSelect={(e) => props.updateData(e, 'waterDate', 'waterTracker')}
					highlightDates={props.highlightDates}/>
		  </ItemAddEntryModal>


		  <ItemViewHistoryModal cancel={props.resetModal}
								show={props.modalOpen}
								type="waterTracker-history"
								header="Watering History">

			{props.tracker && props.tracker.length > 0 ?
					<table>
					  <thead>
					  <tr>
						<th>Date</th>
					  </tr>
					  </thead>
					  <tbody>

					  {props.tracker.map((item, index) => {
						return <tr key={index}>
						  <td>{parseDate(item.date)}</td>
						</tr>
					  })}

					  </tbody>
					</table>
					:
					<p>No entries recorded</p>
			}

		  </ItemViewHistoryModal>
		</React.Fragment>
)

WaterModals.propTypes = {
  updateData: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool,
  tracker: PropTypes.array,
  newDataTracker: PropTypes.array,
  highlightDates: PropTypes.array
}

export default WaterModals
