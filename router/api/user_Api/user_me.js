const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
//const rp = require("request-promise");
const axios = require("axios");

const validateUserId = require("../../../validation/user_id");

// @route   GET api/users/me
// @desc    Get particular registered user
// @access  Private
router.get("/:userId", (req, res) => {
  //console.log(req.body.userId);
  //const userId = req.params.userId;
  const { errors, isValid } = validateUserId(req.params);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  admin
    .auth()
    .getUser(req.params.userId)
    .then((User) => {
      //user is found
      //console.log(User);
      if (User.displayName) {
        var [name, location, company] = User.displayName.split("----");
      }

      //fetching items for sale from databse

      admin
        .firestore()
        .doc(`users/${User.uid}`)
        .get()
        .then((documentSnapshot) => {
          //console.log(documentSnapshot.data());

          //now fetching my products
          //axios.get('').then().catch();
          //prepare for response
          const userData = {
            name: name,
            location: location,
            company: company,
            phone: User.phoneNumber,
            avatar: User.photoURL,
            ItemsForSell: documentSnapshot.data().ItemsId || [],
          };

          // rp('').then(body => {
          //     console.log(body);
          // }).catch(err => {
          //     console.log(err);
          // });

          return res.status(200).json(userData);
        })
        .catch((e) =>
          res.status(404).json({ error: "User document not found" })
        );
    })
    .catch((e) => res.status(404).json({ error: "User not registered" }));

  //fetching user along with data -> sending object in response.
});

module.exports = router;
