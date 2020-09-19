import Water from '../Water'
import Plant from '../../Plant/Plant'

Meteor.publish('water', function plants () {
  if (Meteor.userId()) {

	const plants = Plant.find({userId: Meteor.userId()}, {fields: { _id: 1}}).fetch();
	const plantIds = plants.map(function(item) {
	  return item['_id'];
	});

	const water = Water.find( { plantId : { $in : plantIds } } );

	if (water) {
	  return water
	} else {
	  return []
	}
  } else {
	return []
  }
})
