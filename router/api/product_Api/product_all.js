const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

// @route   GET api/product/all
// @desc    get all product from database
// @access  Public
router.get("/", async (req, res) => {
  //TODO => retrive catagories -> retrive each documents -> send all those documents
  // (async () => {
  try {
    const collections = await admin.firestore().listCollections();
    //grabbing all product
    const Products = [];

    for (let collection of collections) {
      //restricting for users collection
      if (collection.id !== "users") {
        const documentRefs = await collection.listDocuments();

        const documentSnapshots = await admin
          .firestore()
          .getAll(...documentRefs);

        for (let documentSnapshot of documentSnapshots) {
          if (documentSnapshot.exists) {
            const data = documentSnapshot.data();

            //making ready for response
            const product = {
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            };
            Products.push(product);
          } else {
            console.log(`Found missing document: ${documentSnapshot.id}`);
          }
        }
      }
    }

    res.status(200).json(Products);
  } catch (error) {
    //console.error(e);
    return res.status(400).json(error);
  }
  //})(); //async functions ends here
});

module.exports = router;
