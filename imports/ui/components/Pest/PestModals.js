import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import ItemAddEntryModal from '../Shared/ItemAddEntryModal'
import ItemViewHistoryModal from '../Shared/ItemViewHistoryModal'
import { parseDate } from '../../../utils/helpers/plantData'
import UpdateTypes from '../../../utils/constants/updateTypes'

const PestModals = (props) => (
		<React.Fragment>
		  <ItemAddEntryModal save={props.save}
							 cancel={props.resetModal}
							 show={props.modalOpen}
							 type={UpdateTypes.pest.pestEditModal}
							 header="New pest entry">

			<DatePicker selected={props.newDataTracker ? props.newDataTracker.date : Date.now()}
						className="react-datepicker-wrapper"
						dateFormat="dd-MMMM-yyyy"
						popperPlacement="bottom"
						inline
						onSelect={(e) => props.addTrackerDate(e, 'pestTracker')}
						highlightDates={props.highlightDates}/>

			<p className="modern-input for-modal">
			  <label>pest treated</label>
			  <input type="text"
					 onChange={(e) => props.addTrackerDetails(e, 'pestTracker', 'pest')}/>
			</p>

			<p className="modern-input for-modal">
			  <label>treatment method</label>
			  <input type="text"
					 onChange={(e) => props.addTrackerDetails(e, 'pestTracker', 'treatment')}/>
			</p>
		  </ItemAddEntryModal>


		  <ItemViewHistoryModal cancel={props.resetModal}
								show={props.modalOpen}
								type={UpdateTypes.pest.pestEditModal}
								header="Pest History">

			{props.tracker && props.tracker.length > 0 ?
					<table>
					  <thead>
					  <tr>
						<th>Date</th>
						<th>Pest</th>
						<th>Treatment</th>
					  </tr>
					  </thead>
					  <tbody>

					  {props.tracker.map((item, index) => {
						return <tr key={index}>
						  <td>{parseDate(item.date)}</td>
						  <td>{item.pest || 'N/A'}</td>
						  <td>{item.treatment || 'N/A'}</td>
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

PestModals.propTypes = {
  addTrackerDate: PropTypes.func.isRequired,
  addTrackerDetails: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.string,
  tracker: PropTypes.array,
  newDataTracker: PropTypes.object,
  highlightDates: PropTypes.array
}

export default PestModals
