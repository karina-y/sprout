import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import { withTracker } from 'meteor/react-meteor-data'
import ItemPreview from '../../components/ItemPreview/ItemPreview'
import { Session } from 'meteor/session'
import Plant from '/imports/api/Plant/Plant'
import Seedling from '../../../api/Seedling/Seedling'
import './ItemCatalogue.scss'

class ItemCatalogue extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  catalogue: props.catalogue,
	  filteredOrSortedCatalogue: props.catalogue,
	  catalogueFilter: '',
	  sortBy: ''
	}

	autobind(this)
  }

  componentDidMount () {
	Session.set('pageTitle', 'Catalogue')
  }

  //TODO
  sortCatalogue (property) {
	//TODO sorting allowed by both common and latin name... do i want to display both? make this a user pref? i haven't decided yet....
	//add more sorting options, last watered, last fertilized, etc
	//where to put sorting buttons? next to seach bar?

	const currentSortBy = this.state.sortBy
	const currentSort = this.state.filteredOrSortedCatalogue
	let sortedUsers

	if (currentSortBy === property) {
	  sortedUsers = currentSort.reverse()
	} else {
	  sortedUsers = currentSort.sort(function (a, b) {
		let itemA
		let itemB

		if (property === 'commonName' || property === 'latinName') {
		  itemA = a[property].toString().toLowerCase()
		  itemB = b[property].toString().toLowerCase()
		} else if (property === 'createdAt' || property === 'updatedAt') {
		  itemA = a[property] ? new Date(a[property]) : null
		  itemB = b[property] ? new Date(b[property]) : null
		}

		if (itemB == null) {
		  return -1
		} else if (itemA == null) {
		  return 1
		} else if (property === 'createdAt' || property === 'updatedAt') {
		  return itemB - itemA
		} else if (itemA < itemB) {
		  return -1
		} else if (itemA > itemB) {
		  return 1
		} else {
		  return 0
		}

	  })
	}

	this.setState({
	  sortBy: property,
	  filteredOrSortedCatalogue: sortedUsers
	})
  }

  filterCatalogue (e) {
	//this is overkill but i'm not sure how i want to search/filter in the future so leaving this for now
	//TODO ctrl+a del doesn't reset the filter

	const val = e.target.value
	const catalogue = this.state.catalogue

	if (val) {

	  function checkItem (obj, key) {
		const type = typeof obj[key]
		let item = obj[key]

		switch (type) {
		  case 'string':
			item = obj[key].toString().toLowerCase()
			return item.includes(val)
			break
		  case 'number':
			item = obj[key].toString().toLowerCase()
			return item.includes(val)
			break
		  case 'object':
			return filterObject(item)
			break
		  case 'array':
			return filterArray(item)
			break
		}
	  }

	  const filteredCatalogue = catalogue.filter(function (obj) {
		return Object.keys(obj).some(function (key) {
		  if (key === 'commonName' || key === 'latinName') {
			return checkItem(obj, key)
		  }
		})
	  })

	  function filterArray (arr) {
		arr.filter(function (obj) {
		  return Object.keys(obj).some(function (key) {
			return checkItem(obj, key)
		  })
		})
	  }

	  function filterObject (obj) {
		return Object.keys(obj).some(function (key) {
		  return checkItem(obj, key)
		})
	  }

	  this.setState({
		filteredOrSortedCatalogue: filteredCatalogue,
		catalogueFilter: val
	  })

	} else {
	  this.setState({
		filteredCatalogue: catalogue,
		catalogueFilter: ''
	  })
	}

  }

  render () {
	const props = this.props

	return (
			<div className="ItemCatalogue">
			  {/* TODO add sorting and filtering */}
			  <div>
				<input name="catalogueFilter"
					   type="text"
					   placeholder="Search by latin or common name"
					   className="search-bar"
					   value={this.state.catalogueFilter}
					   onChange={this.filterCatalogue}/>
			  </div>

			  <div className="flex-around flex-wrap">
				{this.props.catalogue && this.props.catalogue.length > 0 ?
						this.state.filteredOrSortedCatalogue.map(function (item, index) {
						  return <ItemPreview item={item}
											   key={index}
											   {...props}/>
						})
						:
						<p className="title-ming"
						   style={{marginTop: '50px', textAlign: 'center', padding: '10px'}}>{this.props.msg}</p>
				}
			  </div>
			</div>
	)
  }
}

ItemCatalogue.propTypes = {
  catalogue: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
}

export default withTracker((props) => {
  const type = props.match.params.type;
  let catalogue = [];
  let msg = `You don't have any ${type}s in your catalogue yet.`

  if (type === "plant") {
	catalogue = Plant.find({userId: Meteor.userId()}).fetch();
  } else if (type === "seedling" && Meteor.isPro) {
	catalogue = Seedling.find({userId: Meteor.userId()}).fetch();
  } else {
    msg = "You need to upgrade to a pro account to use this feature";
  }

  return {
	catalogue,
	type,
	msg
  }
})(ItemCatalogue)
