const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateUserId(data) {
  let errors = {};

  data.userId = !isEmpty(data.userId) ? data.userId : "";
  //data.password = !isEmpty(data.password) ? data.password : "";

  Validator.isEmpty(data.userId) && (errors.user = "userId field is required");

  !Validator.isLength(data.userId, { min: 28, max: 28 }) &&
    !Validator.isEmpty(data.userId) &&
    (errors.user = "userId must be exact 28 characters");

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
