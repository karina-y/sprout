import React, { Component } from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';
import "./PlantCatalogue.scss";
// import profiles  from '../../dummydata/profiles.json';
import ProfilePreview from '../components/Profiles/ProfilePreview'
import { Session } from "meteor/session";
import Profile from '/imports/api/Profile/Profile';
// import { useHistory } from "react-router-dom";

class PlantCatalogue extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  catalogue: props.catalogue,
	  filteredOrSortedProfiles: props.catalogue,
	  profileFilter: "",
	  sortBy: ""
	};

	autoBind(this);
  }

  componentDidMount() {
	Session.set('pageTitle', "Catalogue");
  }

  //this hits when a profile is deleted
  static getDerivedStateFromProps(nextProps, prevState) {
	if (nextProps.catalogue && nextProps.catalogue.length !== prevState.catalogue.length) {
	  // console.log("*********UPDATING");
	  let newState = prevState;

	  newState.catalogue = nextProps.catalogue;
	  newState.filteredOrSortedProfiles = nextProps.catalogue;
	  newState.profileFilter = "";
	  newState.sortBy = "";

	  return newState;
	} else {
	  return null
	}
  }


  sortProfiles(property) {

	const currentSortBy = this.state.sortBy;
	const currentSort = this.state.filteredOrSortedProfiles;
	let sortedProfiles;

	if (currentSortBy === property) {
	  sortedProfiles = currentSort.reverse();
	} else {
	  sortedProfiles = currentSort.sort(function(a, b) {
		let itemA;
		let itemB;

		if (property === "commonName" || property === "latinName") {
		  itemA = a.profile[property].toString().toLowerCase();
		  itemB = b.profile[property].toString().toLowerCase();
		} else if (property === "roles") {
		  itemA = a[property][0].toString().toLowerCase();
		  itemB = b[property][0].toString().toLowerCase();
		}  else if (property === "location") {
		  itemA = a[property][0].address.toString().toLowerCase();
		  itemB = b[property][0].address.toString().toLowerCase();
		} else if (property === "createdAt" || property === "updatedAt") {
		  itemA = a[property] ? new Date(a[property]) : null;
		  itemB = b[property] ? new Date(b[property]) : null
		}

		if (itemB == null) {
		  return -1;
		} else if (itemA == null) {
		  return 1;
		} else if (property === "createdAt" || property === "updatedAt") {
		  return itemB - itemA;
		} else if (itemA < itemB) {
		  return -1;
		} else if (itemA > itemB) {
		  return 1;
		} else {
		  return 0;
		}

	  });
	}


	this.setState({
	  sortBy: property,
	  filteredOrSortedProfiles: sortedProfiles
	});
  }

  filterProfiles(e) {

	const val = e.target.value;
	const catalogue = this.state.catalogue;

	if (val) {

	  function checkItem(obj, key) {
		const type = typeof obj[key];
		let item = obj[key];

		switch (type) {
		  case "string":
			item = obj[key].toString().toLowerCase();
			return item.includes(val);
			break;
		  case "number":
			item = obj[key].toString().toLowerCase();
			return item.includes(val);
			break;
		  case "object":
			return filterObject(item);
			break;
		  case "array":
			return filterArray(item)
			break;
		}
	  }

	  const filteredProfiles = catalogue.filter(function(obj) {
		return Object.keys(obj).some(function(key) {
		  if (val.indexOf(' ') >= 0 && key === "profile") {
			let item = obj[key].commonName.toString().toLowerCase() + " " + obj[key].latinName.toString().toLowerCase();
			return item.includes(val);
		  } else {
			return checkItem(obj, key);
		  }
		})
	  });


	  function filterArray(arr) {
		arr.filter(function(obj) {
		  return Object.keys(obj).some(function(key) {
			return checkItem(obj, key);
		  });
		});
	  }

	  function filterObject(obj) {
		return Object.keys(obj).some(function(key) {
		  return checkItem(obj, key);
		});
	  }


	  this.setState({
		filteredOrSortedProfiles: filteredProfiles,
		profileFilter: val
	  });

	} else {
	  this.setState({
		filteredProfiles: catalogue,
		profileFilter: ""
	  })
	}

  }

  render() {
	const filteredOrSortedProfiles = this.state.filteredOrSortedProfiles;
	// const viewProfiles = this.props.viewProfiles;
	const sortBy = this.state.sortBy;
	const editProfile = this.editProfile;
	const props = this.props;

	return (
			<div className="PlantCatalogue">
			  <Row style={{display:'none'}}>
				<Col sm={12}>
				  <FormGroup>
					<FormControl name="profileFilter"
								 type="text"
								 placeholder="Search Catalogue"
								 value={this.state.profileFilter}
								 onChange={this.filterProfiles}>
					</FormControl>
				  </FormGroup>
				</Col>
			  </Row>

			  <Row style={{display:'none'}}>
				<Col sm={12}>
				  <Table striped bordered responsive hover>
					<thead>
					<tr>
					  <th onClick={() => this.sortProfiles('_id')} className={sortBy === '_id' ? 'active' : ''}>_id</th>
					  <th onClick={() => this.sortProfiles('commonName')} className={sortBy === 'commonName' ? 'active' : ''}>Common Name</th>
					  <th onClick={() => this.sortProfiles('latinName')} className={sortBy === 'latinName' ? 'active' : ''}>Latin Name</th>
					  <th onClick={() => this.sortProfiles('location')} className={sortBy === 'location' ? 'active' : ''}>Location</th>
					  <th onClick={() => this.sortProfiles('dateBought')} className={sortBy === 'dateBought' ? 'active' : ''}>Date Bought</th>
					  <th onClick={() => this.sortProfiles('locationBought')} className={sortBy === 'locationBought' ? 'active' : ''}>Location Bought</th>
					  <th onClick={() => this.sortProfiles('fertilizer')} className={sortBy === 'fertilizer' ? 'active' : ''}>Fertilizer</th>
					  <th onClick={() => this.sortProfiles('companions')} className={sortBy === 'companions' ? 'active' : ''}>Companions</th>
					  {/*<th onClick={() => this.sortProfiles('location')} className={sortBy === 'location' ? 'active' : ''}>HERE</th>*/}
					  {/*<th onClick={() => this.sortProfiles('location')} className={sortBy === 'location' ? 'active' : ''}>HERE</th>*/}
					  {/*<th onClick={() => this.sortProfiles('location')} className={sortBy === 'location' ? 'active' : ''}>HERE</th>*/}
					  {/*<th onClick={() => this.sortProfiles('location')} className={sortBy === 'location' ? 'active' : ''}>HERE</th>*/}
					  {/*<th onClick={() => this.sortProfiles('location')} className={sortBy === 'location' ? 'active' : ''}>HERE</th>*/}
					  {/*<th onClick={() => this.sortProfiles('location')} className={sortBy === 'location' ? 'active' : ''}>HERE</th>*/}
					  {/*<th onClick={() => this.sortProfiles('roles')} className={sortBy === 'roles' ? 'active' : ''}>Role(s)</th>*/}
					  {/*<th onClick={() => this.sortProfiles('createdAt')} className={sortBy === 'createdAt' ? 'active' : ''}>Date Added</th>*/}
					  {/*<th onClick={() => this.sortProfiles('updatedAt')} className	={sortBy === 'updatedAt' ? 'active' : ''}>Date Updated</th>*/}
					  <th>Actions</th>
					</tr>
					</thead>

					<tbody>

					</tbody>
				  </Table>
				</Col>
			  </Row>

			  <div className="all-profiles">
				{filteredOrSortedProfiles.map(function(profile, index) {
				  return <ProfilePreview profile={profile}
										 key={index}
										 editProfile={editProfile}
										 {...props}/>;
				})}
			  </div>
			</div>
	);
  }
}

PlantCatalogue.propTypes = {
  catalogue: PropTypes.array.isRequired,
};

export default withTracker(() => {
  let catalogue;

  // if (Meteor.isCordova) {
	// catalogue = profiles;
  // } else {
	catalogue = Profile.find().fetch();
  // }

  return {
	catalogue
  };
})(PlantCatalogue);
