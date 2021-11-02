const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateIsLoggedIn(data) {
  let errors = {};

  data.uniqueId = !isEmpty(data.uniqueId) ? data.uniqueId : "";
  //data.password = !isEmpty(data.password) ? data.password : "";

  Validator.isEmpty(data.uniqueId) &&
    (errors.uniqueId = "uniqueId field is required");
  !Validator.isLength(data.uniqueId, { min: 28, max: 28 }) &&
    !Validator.isEmpty(data.uniqueId) &&
    (errors.uniqueId = "28 digit uniqueId required.");
  //   !Validator.isEmail(data.email) && (errors.email = "Email is Invalid");
  //   Validator.isEmpty(data.password) &&
  //     (errors.password = "Password field is required");

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
