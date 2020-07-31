import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTracker } from 'meteor/react-meteor-data'
import { Session } from 'meteor/session'
import Plant from '/imports/api/Plant/Plant'
import { getDaysSinceAction } from '../../../utils/plantData'
import PlantTaskList from '../../components/PlantTaskList/PlantTaskList'

class PlantToDo extends Component {
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
						this.props.catalogue.map(function (plant, index) {
						  return <PlantTaskList plant={plant}
												key={index}
												{...props}/>
						})
						:
						<p className="title-ming"
						   style={{marginTop: '50px', textAlign: 'center', padding: '45px'}}>You don't have any plants that need attention today!</p>
				}
			</div>
	)
  }
}

PlantToDo.propTypes = {
  catalogue: PropTypes.array.isRequired,
}

export default withTracker(() => {
  const catalogue = Plant.find({userId: Meteor.userId()}).fetch()
  let needsAttention = []

  //filter what needs attention today
  //plant.waterSchedule - plant.daysSinceWatered - 1
  for (let i = 0; i < catalogue.length; i++) {
	let currPlant = catalogue[i]
	let waterDue = currPlant.waterScheduleAuto ? 2 : currPlant.waterSchedule - getDaysSinceAction(currPlant.waterTracker) - 1
	let fertilizerDue = currPlant.fertilizerSchedule - getDaysSinceAction(currPlant.fertilizerTracker) - 1
	// let pruningDue = currPlant.pruningSchedule - getDaysSinceAction(currPlant.pruningTracker) - 1
	// let deadheadingDue = currPlant.deadheadingSchedule - getDaysSinceAction(currPlant.deadheadingTracker) - 1

	if (waterDue < 1 || fertilizerDue < 1/* || pruningDue < 1 || deadheadingDue < 1*/) {
	  currPlant.attentionNeeded = {
		water: waterDue < 1,
		fertilizer: fertilizerDue < 1,
		// pruning: pruningDue < 1,
		// deadheading: deadheadingDue < 1
	  }

	  needsAttention.push(currPlant)
	}

  }

  return {
	catalogue: needsAttention
  }
})(PlantToDo)
