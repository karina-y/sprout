import React from 'react'
import PropTypes from 'prop-types'
import ItemAddEntryModal from '../../Shared/ItemAddEntryModal'
import ItemViewHistoryModal from '../../Shared/ItemViewHistoryModal'
import { parseDate } from '../../../../utils/plantData'
import DatePicker from 'react-datepicker'
import { toast } from 'react-toastify'

const PruningDeadheadingModals = (props) => (
		<React.Fragment>
		  <ItemAddEntryModal save={this.updatePlant}
							 cancel={this.resetModal}
							 show={this.state.modalOpen}
							 type="pruningDeadheadingTracker"
							 header="New pruning or deadheading entry">

			{!this.state.pruneType &&
			<div className="flex-between">
			  <label>Pruned <input type="radio"
								   checked={this.state.pruneType === 'pruningTracker'}
								   onChange={() => this.state.pruneType !== 'pruningTracker' ? this.setState({pruneType: 'pruningTracker'}) : this.setState({
									 pruneType: null,
									 newData: null
								   })}/></label>
			  <label>Deadheaded <input type="radio"
									   checked={this.state.pruneType === 'deadheadingTracker'}
									   onChange={() => this.state.pruneType !== 'deadheadingTracker' ? this.setState({pruneType: 'deadheadingTracker'}) : this.setState({
										 pruneType: null,
										 newData: null
									   })}/></label>
			  <label>Both <input type="radio"
								 checked={this.state.pruneType === 'pruningDeadheadingTracker'}
								 onChange={() => this.state.pruneType !== 'pruningDeadheadingTracker' ? this.setState({pruneType: 'pruningDeadheadingTracker'}) : this.setState({
								   pruneType: null,
								   newData: null
								 })}/></label>
			</div>
			}

			{this.state.pruneType &&
			<DatePicker
					selected={this.state.newData.pruningDeadheadingTracker ? this.state.newData.pruningDeadheadingTracker.date : Date.now()}
					className="react-datepicker-wrapper"
					dateFormat="dd-MMMM-yyyy"
					popperPlacement="bottom"
					inline
					onSelect={(e) => this.state.pruneType ? this.updateData(e, this.state.pruneType, this.state.pruneType) : toast.warning('Please select an action below first.')}
					highlightDates={PlantViewEdit.getHighlightDates(props.plant.pruningDeadheadingTracker, 'pruning')}/>
			}

		  </ItemAddEntryModal>


		  <ItemViewHistoryModal cancel={this.resetModal}
								show={this.state.modalOpen}
								type="pruningDeadheadingTracker-history"
								header="Pruning - Deadheading History">

			{props.plant.pruningDeadheadingTracker && props.plant.pruningDeadheadingTracker.length > 0 ?
					<table>
					  <thead>
					  <tr>
						<th>Date</th>
						<th>Action</th>
					  </tr>
					  </thead>
					  <tbody>

					  {props.plant.pruningDeadheadingTracker.map((item, index) => {
						return <tr key={index}>
						  <td>{parseDate(item.date)}</td>
						  <td>{item.action}</td>
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

PruningDeadheadingModals.propTypes = {
  updateData: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.string,
  diary: PropTypes.array,
  highlightDates: PropTypes.array
}

export default PruningDeadheadingModals
