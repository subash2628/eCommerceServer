const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};
  //console.log(data.phone, data.password);

  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  Validator.isEmpty(data.phone) &&
    (errors.phone = "phoneNumber field is required");

  !Validator.isLength(data.phone, { min: 10, max: 10 }) &&
    !Validator.isEmpty(data.phone) &&
    (errors.phone = "phoneNumber digit must be 10");

  !Validator.isMobilePhone(data.phone, ["ne-NP"]) &&
    !Validator.isEmpty(data.phone) &&
    Validator.isLength(data.phone, { min: 10, max: 10 }) &&
    (errors.phone = "phoneNumber must be of Nepal");

  //password
  //isEmpty(data.password) && (errors.password = "Password is Required");
  Validator.isEmpty(data.password) &&
    (errors.password = "Password field is required");

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
