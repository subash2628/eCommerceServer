const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProductId(productsId) {
  let errors = {};

  //console.log("typeof ", productsId.length);

  if (!productsId) {
    errors.productsId = "productsId is either undefined or null";
  } else if (!productsId.length) {
    errors.productsId = "atleast one productsId is required in GET URL";
  } else {
    productsId.forEach((productId) => {
      //console.log("id ", productId);
      !Validator.isLength(productId, { min: 20, max: 20 }) &&
        (errors[productId] =
          "is not valid. length must be exact 20 characters");
    });
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
