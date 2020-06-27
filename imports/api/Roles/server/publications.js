Meteor.publish('roles', function () {
  if (this.userId) {

	return Meteor.roleAssignment.find({ 'user._id': this.userId });
	// return Meteor.roleAssignment.find({});
  } else {
	this.ready()
  }
})
