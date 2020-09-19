import PruningDeadheading from '../PruningDeadheading'
import Plant from '../../Plant/Plant'

Meteor.publish('pruningDeadheading', function plants () {
  if (Meteor.userId()) {

	const plants = Plant.find({userId: Meteor.userId()}, {fields: { _id: 1}}).fetch();
	const plantIds = plants.map(function(item) {
	  return item['_id'];
	});

	const pruningDeadheading = PruningDeadheading.find( { plantId : { $in : plantIds } } );

	if (pruningDeadheading) {
	  return pruningDeadheading
	} else {
	  return []
	}
  } else {
	return []
  }
})
