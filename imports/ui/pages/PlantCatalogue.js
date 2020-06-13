import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import "./PlantCatalogue.scss";
// import profiles  from '../../dummydata/profiles.json';
import ProfilePreview from '../components/Profiles/ProfilePreview'
import { Session } from "meteor/session";
import Profile from '/imports/api/Profile/Profile';

class PlantCatalogue extends Component {
  constructor(props) {
	super(props);

	this.state = {
	  catalogue: props.catalogue,
	  filteredOrSortedProfiles: props.catalogue,
	  profileFilter: "",
	  sortBy: ""
	};
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

  render() {
	const filteredOrSortedProfiles = this.state.filteredOrSortedProfiles;
	const props = this.props;

	return (
			<div className="PlantCatalogue">
			  {/* TODO add sorting and filtering */}

			  <div className="all-profiles">
				{filteredOrSortedProfiles.map(function(profile, index) {
				  return <ProfilePreview profile={profile}
										 key={index}
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
  const catalogue = Profile.find().fetch();

  //to test locally without hooking up to db, be sure to uncomment import statement for this
  //const catalogue = profiles;

  return {
	catalogue
  };
})(PlantCatalogue);
