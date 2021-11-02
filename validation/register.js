const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(req) {
  let errors = {};

  //avatar of user
  //const avatar = req.file;
  const data = req.body;
  //console.log(data);
  //these datas should be posted
  data.name = !isEmpty(data.name) ? data.name : "";
  data.location = !isEmpty(data.location) ? data.location : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.contact = !isEmpty(data.contact) ? data.contact : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.conformPassword = !isEmpty(data.conformPassword)
    ? data.conformPassword
    : "";

  //name
  Validator.isEmpty(data.name) && (errors.name = "name field is required");
  !Validator.isLength(data.name, { min: 2, max: 30 }) &&
    !Validator.isEmpty(data.name) &&
    (errors.name = "Name must be between 2 and 30 characters");

  //location
  Validator.isEmpty(data.location) &&
    (errors.location = "location field is required");
  //   !Validator.islocation(data.location) &&
  //     !Validator.isEmpty(data.location) &&
  //     (errors.location = "location is invalid");

  //company
  Validator.isEmpty(data.company) &&
    (errors.company = "company field is required");
  !Validator.isLength(data.company, { min: 6, max: 30 }) &&
    !Validator.isEmpty(data.company) &&
    (errors.company = "company must be at least 6 characters");

  //contact
  Validator.isEmpty(data.contact) &&
    (errors.contact = "contact field is required");
  !Validator.isLength(data.contact, { min: 10, max: 30 }) &&
    !Validator.isEmpty(data.contact) &&
    (errors.contact = "contact must be 10 digit");

  //password
  Validator.isEmpty(data.password) &&
    (errors.password = "password field is required");
  !Validator.isLength(data.password, { min: 6, max: 30 }) &&
    !Validator.isEmpty(data.password) &&
    (errors.password = "password must be atleast 6 digit");

  //conform password
  Validator.isEmpty(data.conformPassword) &&
    !Validator.isEmpty(data.password) &&
    (errors.conformPassword = "conformPassword field is required");

  !Validator.equals(data.password, data.conformPassword) &&
    !Validator.isEmpty(data.conformPassword) &&
    (errors.conformPassword = "conform password should match password");
  // !Validator.isLength(data.password, { min: 5, max: 30 }) &&
  //   !Validator.isEmpty(data.password) &&
  //   (errors.password = "password must be atleast 5 digit");

  //avatar
  //isEmpty(avatar) && (errors.avatar = "avatar is required");

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
