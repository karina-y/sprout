import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTracker } from 'meteor/react-meteor-data'
import { Session } from 'meteor/session'
import Profile from '/imports/api/Profile/Profile'
import { getDaysSinceAction } from '../../utils/plantData'
import TaskListPreview from '../components/TaskList/TaskListPreview'

class ToDo extends Component {
  constructor (props) {
	super(props)

	this.state = {}
  }

  componentDidMount () {
	Session.set('pageTitle', 'Today\'s Tasks')
  }

  render () {
	const props = this.props

	return (
			<div className="ToDo">
			  {/* TODO add sorting and filtering */}

				{this.props.catalogue && this.props.catalogue.length > 0 ?
						this.props.catalogue.map(function (profile, index) {
						  return <TaskListPreview profile={profile}
												  key={index}
												  {...props}/>
						})
						:
						<p className="title-ming"
						   style={{marginTop: '50px', textAlign: 'center', padding: '10px'}}>You don't have any plants that need attention today!</p>
				}
			</div>
	)
  }
}

ToDo.propTypes = {
  catalogue: PropTypes.array.isRequired,
}

export default withTracker(() => {
  const catalogue = Profile.find({userId: Meteor.userId()}).fetch()
  let needsAttention = []

  //filter what needs attention today
  //profile.waterSchedule - profile.daysSinceWatered - 1
  for (let i = 0; i < catalogue.length; i++) {
	let currProfile = catalogue[i]
	let waterDue = currProfile.waterSchedule - getDaysSinceAction(currProfile.waterTracker) - 1
	let fertilizerDue = currProfile.fertilizerSchedule - getDaysSinceAction(currProfile.fertilizerTracker) - 1
	let pruningDue = currProfile.pruningSchedule - getDaysSinceAction(currProfile.pruningTracker) - 1
	let deadheadingDue = currProfile.deadheadingSchedule - getDaysSinceAction(currProfile.deadheadingTracker) - 1

	if (waterDue < 1 || fertilizerDue < 1 || pruningDue < 1 || deadheadingDue < 1) {
	  currProfile.attentionNeeded = {
		water: waterDue < 1,
		fertilizer: fertilizerDue < 1,
		pruning: pruningDue < 1,
		deadheading: deadheadingDue < 1
	  }

	  //for testing
	  /*currProfile.attentionNeeded = {
		water: true,
		fertilizer: true,
		pruning: true,
		deadheading: true
	  }*/

	  needsAttention.push(currProfile)
	}

  }

  return {
	catalogue: needsAttention
  }
})(ToDo)
