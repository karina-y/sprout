import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import ItemAddEntryModal from '../../Shared/ItemAddEntryModal'
import ItemViewHistoryModal from '../../Shared/ItemViewHistoryModal'
import { parseDate } from '../../../../utils/plantData'

const PestModals = (props) => (
		<React.Fragment>
		  <ItemAddEntryModal save={props.save}
							 cancel={props.resetModal}
							 show={props.modalOpen}
							 type="pestTracker"
							 header="New pest entry">

			<DatePicker selected={props.newDataTracker ? props.newDataTracker.date : Date.now()}
						className="react-datepicker-wrapper"
						dateFormat="dd-MMMM-yyyy"
						popperPlacement="bottom"
						inline
						onSelect={(e) => props.updateData(e, 'pestDate', 'pestTracker')}
						highlightDates={props.highlightDates}/>

			<p className="modern-input for-modal">
			  <label>pest treated</label>
			  <input type="text"
					 onChange={(e) => props.updateData(e, 'pest', 'pestTracker', true)}/>
			</p>

			<p className="modern-input for-modal">
			  <label>treatment method</label>
			  <input type="text"
					 onChange={(e) => props.updateData(e, 'treatment', 'pestTracker', true)}/>
			</p>
		  </ItemAddEntryModal>


		  <ItemViewHistoryModal cancel={props.resetModal}
								show={props.modalOpen}
								type="pestTracker-history"
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
  updateData: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.string,
  tracker: PropTypes.array,
  newDataTracker: PropTypes.array,
  highlightDates: PropTypes.array
}

export default PestModals
