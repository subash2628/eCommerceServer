const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.get("/", async (req, res) => {
  const catagories = {};
  try {
    const collections = await admin.firestore().listCollections();

    for (let collection of collections) {
      // console.log("1");
      if (collection.id !== "users") {
        //one collection === one catagory === one array
        catagories[collection.id] = [];

        const documentRefs = await collection.listDocuments();

        const documentSnapshots = await admin
          .firestore()
          .getAll(...documentRefs);

        for (let documentSnapshot of documentSnapshots) {
          if (documentSnapshot.exists) {
            //making ready for response
            const product = {
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            };

            //collecting products under catagory array
            catagories[collection.id].push(product);
          } else {
            //console.log(`Found missing document: ${documentSnapshot.id}`);
            return res.status(400).json({
              error: `Found missing document: ${documentSnapshot.id}`,
            });
          }
        }
      }
    }

    return res.status(200).json(catagories);
  } catch (e) {
    //console.log(e.message);
    return res.status(400).json({ err: e.message });
  }
});

module.exports = router;
