const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const validateRegisterInput = require("../../../validation/register");

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/", async (req, res) => {
  //console.log("req.body ", req.body);

  const { errors, isValid } = validateRegisterInput(req);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //checking if user already exists
  admin
    .auth()
    .getUserByPhoneNumber(`+977${req.body.contact}`)
    .then((userRecord) => {
      //console.log(userRecord);
      return res.status(400).json({
        phone: "User Already Exists with this phoneNumber",
      });
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") {
        //existing user not found with given data, so creating new user
        admin
          .auth()
          .createUser({
            phoneNumber: `+977${req.body.contact}`,
            displayName: `${req.body.name}----${req.body.location}----${req.body.company}----${req.body.password}`,
            password: req.body.password,
            disabled: false,
          })
          .then((userRecord) => {
            //console.log(userRecord);
            return res.status(200).json({
              user: `Successfully created new user`,
              userId: userRecord.uid,
            });
          })
          .catch((e) =>
            res.status(400).json({
              phone: "error registering new user with this phoneNumber",
            })
          );
      } else {
        res.status(400).json({ phone: "invalid phoneNumber" });
      }
    });
});

module.exports = router;
