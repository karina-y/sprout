import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../../Shared/SwipePanelContent/SwipePanelContent'
import { withTracker } from 'meteor/react-meteor-data'
import Category from '../../../../api/Category/Category'


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
							   defaultValue={props.plant.commonName || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="info" iconTitle="latin name">
					  <p className="modern-input">
						<label>latin name</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'latinName')}
							   defaultValue={props.plant.latinName || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="category">
					  <p className="modern-input">
						<label>category</label>
						<select onChange={(e) => props.updateData(e, 'category')}
								defaultValue={props.plant.category || ''}>
						  <option value='' disabled={true}>- Select a category -</option>
						  {props.categories && props.categories.map((item, index) => {
							return <option value={item.category} key={index}>{item.displayName}</option>
						  })}
						</select></p>
					</SwipePanelContent>

					<SwipePanelContent icon="toxicity">
					  <p className="modern-input">
						<label>toxicity</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'toxicity')}
							   defaultValue={props.plant.toxicity || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="locationBought">
					  <p className="modern-input">
						<label>location bought</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'locationBought')}
							   defaultValue={props.plant.locationBought}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="schedule" iconTitle="date bought">
					  <p className="modern-input">
						<label>date bought</label>
						<input type="date"
							   onBlur={(e) => props.updateData(e, 'dateBought')}
							   defaultValue={props.plant.dateBought ? new Date(props.plant.dateBought).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>

					  {/*<DatePicker selected={props.state.newData.dateBought || Date.now()}
										  className="react-datepicker-wrapper"
										  dateFormat="dd-MMMM-yyyy"
										  inline
										  onSelect={(e) => props.updateData(e, 'dateBought')}
										  highlightDates={PlantViewEdit.getHighlightDates(props.plant.dateBought, 'dateBought')}/>*/}
					</SwipePanelContent>

					<SwipePanelContent icon="schedule"
									   iconTitle={props.plant.category === 'potted' ? 'Date Potted' : 'Date Planted'}>
					  <p className="modern-input">
						<label>{props.plant.category === 'potted' ? 'date potted' : 'date planted'}</label>
						<input type="date"
							   placeholder={props.plant.category === 'potted' ? 'Date Potted' : 'Date Planted'}
							   onBlur={(e) => props.updateData(e, 'datePlanted')}
							   defaultValue={props.plant.datePlanted ? new Date(props.plant.datePlanted).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="plantLocation">
					  <p className="modern-input">
						<label>plant location</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'location')}
							   defaultValue={props.plant.location}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="companions">
					  <p className="modern-input">
						<label>companions</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'companions')}
							   defaultValue={props.plant.companions ? props.plant.companions.join(', ') : null}/></p>
					</SwipePanelContent>
				  </React.Fragment>
				  :
				  <React.Fragment>

					<SwipePanelContent icon="category">
					  <p>{props.plant.category}</p>
					</SwipePanelContent>

					{props.plant.toxicity &&
					<SwipePanelContent icon="toxicity">
					  <p>{props.plant.toxicity || 'N/A'}</p>
					</SwipePanelContent>
					}

					{props.plant.locationBought &&
					<SwipePanelContent icon="locationBought">
					  <p>{props.plant.locationBought || 'N/A'}</p>
					</SwipePanelContent>
					}

					{props.plant.dateBought &&
					<SwipePanelContent icon="schedule" iconTitle="date bought">
					  <p>{props.plant.dateBought ? new Date(props.plant.dateBought).toLocaleDateString() : 'N/A'}</p>
					</SwipePanelContent>
					}

					{props.plant.datePlanted &&
					<SwipePanelContent icon="schedule" iconTitle="date planted">
					  <p>{props.plant.datePlanted ? new Date(props.plant.datePlanted).toLocaleDateString() : 'N/A'}</p>
					</SwipePanelContent>
					}

					<SwipePanelContent icon="plantLocation">
					  <p>{props.plant.location || 'N/A'}</p>
					</SwipePanelContent>

					{props.plant.companions && props.plant.companions.length > 0 &&
					<SwipePanelContent icon="companions">
					  <p>{props.plant.companions.join(', ')}</p>
					</SwipePanelContent>
					}
				  </React.Fragment>
		  }

		</div>
)



Etc.propTypes = {
  plant: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.string,
  categories: PropTypes.array.isRequired
};

export default withTracker((props) => {
  const categories = Category.find({}).fetch()

  return {
	categories
  }
})(Etc)
