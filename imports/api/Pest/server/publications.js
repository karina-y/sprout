import Pest from '../Pest'
import Plant from '../../Plant/Plant'

Meteor.publish('pest', function plants () {
  if (Meteor.userId()) {

	const plants = Plant.find({userId: Meteor.userId()}, {fields: { _id: 1}}).fetch();
	const plantIds = plants.map(function(item) {
	  return item['_id'];
	});

	const pests = Pest.find( { plantId : { $in : plantIds } } );

	if (pests) {
	  return pests
	} else {
	  return []
	}
  } else {
	return []
  }
})
