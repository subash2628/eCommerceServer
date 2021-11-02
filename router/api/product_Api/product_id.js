const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const validatePrductsId = require("../../../validation/product_id");

// @route   GET api/product/id
// @desc    get specific product from database
// @access  Public
router.get("/:productsId", async (req, res) => {
  //array of product id is required
  //this api will product details os those product

  //decode params
  const productsId = req.params.productsId.split("&");
  console.log("productsId ", productsId);

  const { errors, isValid } = validatePrductsId(productsId);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //for collecting product
  const found_products = [];

  const collections = await admin.firestore().listCollections();
  // .then((collections) => {
  for (let collection of collections) {
    //restricting for users collection
    if (collection.id !== "users") {
      const documentRefs = await collection.listDocuments();
      const documentSnapshots = await admin.firestore().getAll(...documentRefs);

      for (let documentSnapshot of documentSnapshots) {
        //matching id here
        //if (productsId.length) {
        if (productsId.includes(documentSnapshot.id)) {
          //product is found
          if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            //making ready for response
            const product = {
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            };
            //console.log(product);

            //uploading in array
            found_products.push(product);
          }
        }
      }
    }
  }
  if (found_products.length) {
    return res.status(200).json(found_products);
  } else {
    return res.status(404).json({ error: "no match found" });
  }
});

module.exports = router;
