import React from 'react'
import PropTypes from 'prop-types'
import ItemAddEntryModal from '../../Shared/ItemAddEntryModal'
import ItemViewHistoryModal from '../../Shared/ItemViewHistoryModal'
import { parseDate } from '../../../../utils/plantData'

const DiaryModals = (props) => (
		<React.Fragment>
		  <ItemAddEntryModal save={props.save}
							 cancel={props.resetModal}
							 show={props.modalOpen}
							 type="diary">

			<p className="modern-input for-modal">
			  <label>new diary entry</label>
			  <textarea rows="6"
						onChange={(e) => props.updateData(e, 'diary')}/>
			</p>
		  </ItemAddEntryModal>

		  <ItemViewHistoryModal cancel={props.resetModal}
								show={props.modalOpen}
								type="diary-history"
								header="Diary History">

			{props.diary && props.diary.length > 0 ?
					<table>
					  <thead>
					  <tr>
						<th>Date</th>
						<th>Entry</th>
					  </tr>
					  </thead>
					  <tbody>

					  {props.diary.map((item, index) => {
						return <tr key={index}>
						  <td>{parseDate(item.date)}</td>
						  <td>{item.entry || 'N/A'}</td>
						</tr>
					  })}

					  </tbody>
					</table>
					:
					<p>No diary recorded</p>
			}

		  </ItemViewHistoryModal>
		</React.Fragment>
)

DiaryModals.propTypes = {
  updateData: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool,
  diary: PropTypes.array,
  highlightDates: PropTypes.array
}

export default DiaryModals
