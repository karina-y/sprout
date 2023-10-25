export default (exception: any) => {
  const message =
    exception.sanitizedError && exception.sanitizedError.message
      ? exception.sanitizedError.message
      : exception.message || exception.reason || exception;

  throw new Meteor.Error(500, message);
};
