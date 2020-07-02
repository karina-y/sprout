import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
// import "./ToDo.scss";
// import profiles  from '../../dummydata/profiles.json';
import ProfilePreview from '../components/Profiles/ProfilePreview'
import { Session } from "meteor/session";
import Profile from '/imports/api/Profile/Profile';
import { getDaysSinceAction } from '../../utils/plantData'

class ToDo extends Component {
  constructor(props) {
	super(props);

	this.state = {
	};
  }

  componentDidMount() {
	Session.set('pageTitle', "To Do");
  }

  render() {
	const props = this.props;

	return (
			<div className="ToDo">
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

ToDo.propTypes = {
  catalogue: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const catalogue = Profile.find({userId: Meteor.userId()}).fetch();
  let needsAttention = [];

  //filter what needs attention today
  //profile.waterSchedule - profile.daysSinceWatered - 1
  for (let i = 0; i < catalogue.length; i++) {
    let currProfile = catalogue[i];
    let waterDue = currProfile.waterSchedule - getDaysSinceAction(currProfile.waterTracker) - 1;
    let fertilizerDue = currProfile.fertilizerSchedule - getDaysSinceAction(currProfile.fertilizerTracker) - 1;
    let pruningDue = currProfile.pruningSchedule - getDaysSinceAction(currProfile.pruningTracker) - 1;
    let deadheadingDue = currProfile.deadheadingSchedule - getDaysSinceAction(currProfile.deadheadingTracker) - 1;

    if (waterDue < 1 || fertilizerDue < 1 || pruningDue < 1 || deadheadingDue < 1) {
      needsAttention.push(currProfile)
	}

  }

  return {
	catalogue: needsAttention
  };
})(ToDo);
