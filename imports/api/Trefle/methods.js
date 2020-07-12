import rateLimit from '../../modules/rate-limit';
import logger from '/imports/utils/logger';

Meteor.methods({
  'trefle.get': function profileDelete(data) {
	try {

	  //https://trefle.io/api/plants/?token=WjVkVytwSU1rYzNGNUNpS24rSmxPZz09&common_name=monstera


	  if (typeof data.commonName !== "string" || typeof data.latinName !== "string"){
		logger('danger', "Validation failed");
		throw new Meteor.Error('500', "Invalid arguments passed");
	  } else {
		const commonPlants = HTTP.call("GET", `https://trefle.io/api/plants/?token=${Meteor.settings.private.apiTokens.trefleToken}&common_name=${data.commonName}`, {
		  headers: {
			"Accept": "application/json"
		  }
		});

		const latinPlants = HTTP.call("GET", `https://trefle.io/api/plants/?token=${Meteor.settings.private.apiTokens.trefleToken}&scientific_name=${data.latinName}`, {
		  headers: {
			"Accept": "application/json"
		  }
		});

		logger('info', "commonPlants", commonPlants)
		logger('info', "latinPlants", latinPlants)

		return null;
	  }
	} catch(e) {
	  logger('danger', e.message);
	  throw new Meteor.Error('500', "Please check your inputs and try again.");

	}

  }
});


rateLimit({
  methods: [
	'trefle.get'
  ],
  limit: 5,
  timeRange: 1000,
});

