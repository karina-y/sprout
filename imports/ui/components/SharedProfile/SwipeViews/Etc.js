import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../../Shared/SwipePanelContent'


const Etc = (props) => (
		<div className="swipe-slide">
		  <p className="swipe-title title-ming">Etc</p>

		  {props.editing === 'etc' ?
				  <React.Fragment>
					<SwipePanelContent icon="info" iconTitle="common name">
					  <p className="modern-input">
						<label>common name</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'commonName')}
							   defaultValue={props.profile.commonName || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="info" iconTitle="latin name">
					  <p className="modern-input">
						<label>latin name</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'latinName')}
							   defaultValue={props.profile.latinName || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="category">
					  <p className="modern-input">
						<label>category</label>
						<select onChange={(e) => props.updateData(e, 'category')}
								defaultValue={props.profile.category || ''}>
						  <option value='' disabled={true}>- Select a category -</option>
						  {props.props.categories && props.props.categories.map((item, index) => {
							return <option value={item.category} key={index}>{item.displayName}</option>
						  })}
						</select></p>
					</SwipePanelContent>

					<SwipePanelContent icon="toxicity">
					  <p className="modern-input">
						<label>toxicity</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'toxicity')}
							   defaultValue={props.profile.toxicity || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="locationBought">
					  <p className="modern-input">
						<label>location bought</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'locationBought')}
							   defaultValue={props.profile.locationBought}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="date bought">
					  <p className="modern-input">
						<label>date bought</label>
						<input type="date"
							   onBlur={(e) => props.updateData(e, 'dateBought')}
							   defaultValue={props.profile.dateBought ? new Date(props.profile.dateBought).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>

					  {/*<DatePicker selected={props.state.newData.dateBought || Date.now()}
										  className="react-datepicker-wrapper"
										  dateFormat="dd-MMMM-yyyy"
										  inline
										  onSelect={(e) => props.updateData(e, 'dateBought')}
										  highlightDates={ProfileViewEdit.getHighlightDates(props.profile.dateBought, 'dateBought')}/>*/}
					</SwipePanelContent>

					<SwipePanelContent icon="schedule"
									   iconTitle={props.profile.category === 'potted' ? 'Date Potted' : 'Date Planted'}>
					  <p className="modern-input">
						<label>{props.profile.category === 'potted' ? 'date potted' : 'date planted'}</label>
						<input type="date"
							   placeholder={props.profile.category === 'potted' ? 'Date Potted' : 'Date Planted'}
							   onBlur={(e) => props.updateData(e, 'datePlanted')}
							   defaultValue={props.profile.datePlanted ? new Date(props.profile.datePlanted).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="plantLocation">
					  <p className="modern-input">
						<label>plant location</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'location')}
							   defaultValue={props.profile.location}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="companions">
					  <p className="modern-input">
						<label>companions</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'companions')}
							   defaultValue={props.profile.companions ? props.profile.companions.join(', ') : null}/></p>
					</SwipePanelContent>
				  </React.Fragment>
				  :
				  <React.Fragment>

					<SwipePanelContent icon="category">
					  <p>{props.profile.category}</p>
					</SwipePanelContent>

					{props.profile.toxicity &&
					<SwipePanelContent icon="toxicity">
					  <p>{props.profile.toxicity || 'N/A'}</p>
					</SwipePanelContent>
					}

					{props.profile.locationBought &&
					<SwipePanelContent icon="locationBought">
					  <p>{props.profile.locationBought || 'N/A'}</p>
					</SwipePanelContent>
					}

					{props.profile.dateBought &&
					<SwipePanelContent icon="schedule" iconTitle="date bought">
					  <p>{props.profile.dateBought ? new Date(props.profile.dateBought).toLocaleDateString() : 'N/A'}</p>
					</SwipePanelContent>
					}

					{props.profile.datePlanted &&
					<SwipePanelContent icon="schedule" iconTitle="date planted">
					  <p>{props.profile.datePlanted ? new Date(props.profile.datePlanted).toLocaleDateString() : 'N/A'}</p>
					</SwipePanelContent>
					}

					<SwipePanelContent icon="plantLocation">
					  <p>{props.profile.location || 'N/A'}</p>
					</SwipePanelContent>

					{props.profile.companions && props.profile.companions.length > 0 &&
					<SwipePanelContent icon="companions">
					  <p>{props.profile.companions.join(', ')}</p>
					</SwipePanelContent>
					}
				  </React.Fragment>
		  }

		</div>
)



Etc.propTypes = {
  profile: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.string
};

export default Etc;
