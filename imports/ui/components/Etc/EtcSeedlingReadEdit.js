import React from 'react';
import PropTypes from 'prop-types';
import SwipePanelContent from '../Shared/SwipePanelContent/SwipePanelContent'
import { withTracker } from 'meteor/react-meteor-data'
import Category from '../../../api/Category/Category'
import UpdateTypes from '../../../utils/constants/updateTypes'

const EtcSeedlingReadEdit = (props) => (
		<div className="swipe-slide adjust-icons">

		  <p className="swipe-title title-ming">
			Etc
		  </p>

		  {props.editing === UpdateTypes.etc.etcEditModal ?
				  <React.Fragment>
					<SwipePanelContent icon="info" iconTitle="common name">
					  <p className="modern-input">
						<label>common name *</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'commonName')}
							   value={props.seedling.commonName || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="info" iconTitle="latin name">
					  <p className="modern-input">
						<label>latin name *</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'latinName')}
							   value={props.seedling.latinName || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="category">
					  <p className="modern-input">
						<label>category *</label>
						<select onChange={(e) => props.updateData(e, 'category')}
								value={props.seedling.category || ''}>
						  <option value='' disabled={true}>- Select a category -</option>
						  {props.categories && props.categories.map((item, index) => {
							return <option value={item.category} key={index}>{item.displayName}</option>
						  })}
						</select>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="toxicity">
					  <p className="modern-input">
						<label>toxicity</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'toxicity')}
							   defaultValue={props.seedling.toxicity || ''}/></p>
					</SwipePanelContent>

					<SwipePanelContent icon="methodSeedStart">
					  <p className="modern-input">
						<label>method to start seed *</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'method')}
							   value={props.seedling.method || ''}/>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="indoorOutdoor">
					  <p className="modern-input">
						<label>started indoor or outdoor</label>
						<select onChange={(e) => props.updateData(e, 'startedIndoorOutdoor')}
								value={props.seedling.startedIndoorOutdoor || ''}>
						  <option value='' disabled={true}>- Select a start location -</option>
						  <option value="indoor">Indoor</option>
						  <option value="outdoor">Outdoor</option>

						</select>
					  </p>
					</SwipePanelContent>

					<SwipePanelContent icon="seedBrand">
					  <p className="modern-input">
						<label>seed brand</label>
						<input type="text"
							   onChange={(e) => props.updateData(e, 'seedBrand')}
							   value={props.seedling.seedBrand || ''}/></p>
					</SwipePanelContent>

					{/*<SwipePanelContent icon="dateExpires">
					  <p className="modern-input">
						<label>date expires</label>
						<input type="date"
							   onBlur={(e) => props.updateData(e, 'dateExpires')}
							   defaultValue={props.seedling.dateExpires ? new Date(props.seedling.dateExpires).toJSON().slice(0, 10) : new Date().toJSON().slice(0, 10)}/>
					  </p>
					</SwipePanelContent>*/}

				  </React.Fragment>
				  :
				  <React.Fragment>

					<SwipePanelContent icon="category">
					  <small>category</small>
					  <p>{props.seedling.category || 'N/A'}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="methodSeedStart">
					  <small>method to start seed</small>
					  <p>{props.seedling.methodSeedStart || 'N/A'}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="indoorOutdoor">
					  <small>started indoor or outdoor</small>
					  <p>{props.seedling.indoorOutdoor || 'N/A'}</p>
					</SwipePanelContent>

					<SwipePanelContent icon="seedBrand">
					  <small>seed brand</small>
					  <p>{props.seedling.seedBrand || 'N/A'}</p>
					</SwipePanelContent>

					{/*<SwipePanelContent icon="dateExpires">
					  <small>date seed expires</small>
					  <p>{parseDate(props.seedling.dateExpires)}</p>
					</SwipePanelContent>*/}

					{props.seedling.toxicity &&
					<SwipePanelContent icon="toxicity">
					  <small>toxicity</small>
					  <p>{props.seedling.toxicity || 'N/A'}</p>
					</SwipePanelContent>
					}

				  </React.Fragment>
		  }
		</div>
)



EtcSeedlingReadEdit.propTypes = {
  seedling: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  editing: PropTypes.string,
  categories: PropTypes.array.isRequired
};

export default withTracker((props) => {
  const categories = Category.find({}).fetch()

  return {
	categories
  }
})(EtcSeedlingReadEdit)
