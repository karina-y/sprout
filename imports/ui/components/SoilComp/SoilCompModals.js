import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import ItemAddEntryModal from '../Shared/ItemAddEntryModal'
import ItemViewHistoryModal from '../Shared/ItemViewHistoryModal'
import { parseDate } from '/imports/utils/plantData'

const SoilCompModals = (props) => (
		<React.Fragment>
		  <ItemAddEntryModal save={props.save}
							 cancel={props.resetModal}
							 show={props.modalOpen}
							 type="soilCompositionTracker"
							 header="New soil composition entry">

			<DatePicker
					selected={props.newDataTracker ? props.newDataTracker.date : Date.now()}
					className="react-datepicker-wrapper"
					dateFormat="dd-MMMM-yyyy"
					popperPlacement="bottom"
					inline
					onSelect={(e) => props.addTrackerDate(e, 'soilCompositionTracker')}
					highlightDates={props.highlightDates}/>

			{props.category === 'potted' ?
					<p className="modern-input for-modal">
					  <label>Soil Moisture %</label>
					  <input type="number"
							 min="0"
							 inputMode="numeric"
							 pattern="[0-9]*"
							 onChange={(e) => props.updateData(e, 'moisture')}/>
					</p>
					:
					<p className="modern-input for-modal">
					  <label>pH Reading</label>
					  <input type="number"
							 min="0"
							 inputMode="numeric"
							 pattern="[0-9]*"
							 onChange={(e) => props.updateData(e, 'ph')}/>
					</p>
			}



		  </ItemAddEntryModal>


		  <ItemViewHistoryModal cancel={props.resetModal}
								show={props.modalOpen}
								type="soilCompositionTracker-history"
								header="Soil Composition History">

			{props.tracker && props.tracker.length > 0 ?
					<table>
					  <thead>
					  <tr>
						<th width="50%">Date</th>
						{props.category === 'potted' ?
								<th width="50%">Moisture</th>
								:
								<th width="50%">pH</th>
						}
					  </tr>
					  </thead>
					  <tbody>

					  {props.tracker.map((item, index) => {
						return <tr key={index}>
						  <td>{parseDate(item.date)}</td>
						  {props.category === 'potted' ?
								  <td>{item.moisture ? `${Math.round(item.moisture * 100)}%` : 'N/A'}</td>
								  :
								  <td>{item.ph || 'N/A'}</td>
						  }
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

SoilCompModals.propTypes = {
  updateData: PropTypes.func.isRequired,
  addTrackerDate: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.string,
  tracker: PropTypes.array,
  newDataTracker: PropTypes.object,
  highlightDates: PropTypes.array,
  category: PropTypes.string.isRequired
}

export default SoilCompModals
