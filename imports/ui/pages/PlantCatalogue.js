import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
// import "./PlantCatalogue.scss";
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

			  <div className="flex-around flex-wrap">
				{this.props.catalogue && this.props.catalogue.length > 0 ?
						this.props.catalogue.map(function(profile, index) {
						  return <ProfilePreview profile={profile}
												 key={index}
												 {...props}/>;
						})
						:
						<p className="title-ming"
						   style={{marginTop: '50px', textAlign: 'center', padding: '10px'}}>You don't have any plants in your catalogue yet.</p>
				}
			  </div>
			</div>
	);
  }
}

PlantCatalogue.propTypes = {
  catalogue: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const catalogue = Profile.find({userId: Meteor.userId()}).fetch();
  // const catalogue = Profile.find().fetch();	//TODO remove - for debugging

  //to test locally without hooking up to db, be sure to uncomment import statement for this
  //const catalogue = profiles;

  return {
	catalogue
  };
})(PlantCatalogue);
