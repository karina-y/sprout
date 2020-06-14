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
	};
  }

  componentDidMount() {
	Session.set('pageTitle', "Catalogue");
  }

  render() {
	const props = this.props;

	return (
			<div className="PlantCatalogue">
			  {/* TODO add sorting and filtering */}

			  <div className="all-profiles">
				{this.props.catalogue.map(function(profile, index) {
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
