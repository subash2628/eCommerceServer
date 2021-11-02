const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateUserAndProduct(data, productImage) {
  let errors = {};

  //const data = req.body;
  //const productImage = req.file;

  //console.log("body ", data);

  //const productImage = req.file;
  //console.log("image ", !isEmpty(productImage));

  data.name = !isEmpty(data.name) ? data.name : "";
  data.userId = !isEmpty(data.userId) ? data.userId : "";
  data.catagory = !isEmpty(data.catagory) ? data.catagory : "";
  data.price = !isEmpty(data.price) ? data.price : "";
  //data.location = !isEmpty(data.location) ? data.location : "";
  data.quantity = !isEmpty(data.quantity) ? data.quantity : "";

  //userId
  Validator.isEmpty(data.userId) &&
    (errors.userId = "userId field is required");
  !Validator.isLength(data.userId, { min: 28, max: 28 }) &&
    !Validator.isEmpty(data.userId) &&
    (errors.userId = "28 digit userId required.");

  //name
  Validator.isEmpty(data.name) && (errors.name = "name field is required");
  !Validator.isLength(data.name, { min: 3, max: 30 }) &&
    !Validator.isEmpty(data.name) &&
    (errors.name = "name must be atleast 3 character");
  //catagory
  Validator.isEmpty(data.catagory) &&
    (errors.catagory = "catagory field is required");
  !Validator.isLength(data.catagory, { min: 3, max: 30 }) &&
    !Validator.isEmpty(data.catagory) &&
    (errors.catagory = "catagory must be between 3 and 30 characters");

  //price
  Validator.isEmpty(data.price) && (errors.price = "price field is required");
  !Validator.isLength(data.price, { min: 2, max: 10 }) &&
    !Validator.isEmpty(data.price) &&
    (errors.price = "price must be atleast 2 digit");

  //location(NOT ASKED)
  // Validator.isEmpty(data.location) &&
  //   (errors.location = "location field is required");
  // !Validator.isLength(data.location, { min: 4, max: 10 }) &&
  //   !Validator.isEmpty(data.location) &&
  //   (errors.location = "location must be atleast 4 characters");

  //quantity
  Validator.isEmpty(data.quantity) &&
    (errors.quantity = "quantity field is required");
  !Validator.isLength(data.quantity, { min: 2, max: 10 }) &&
    !Validator.isEmpty(data.quantity) &&
    (errors.quantity =
      "quantity must be atleast 2 characters....ie 1 kg, 1 pkg, 1 pathi, 5 aana etc");

  //image
  isEmpty(productImage) && (errors.productImage = "productImage is required");

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
