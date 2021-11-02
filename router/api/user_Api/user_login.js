const express = require("express");
const router = express.Router();
//const gravatar = require("gravatar");
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
//const keys = require("../../config/keys");
//const passport = require("passport");
const admin = require("firebase-admin");

//const validateRegisterInput = require("../../../validation/register");
const validateLoginInput = require("../../../validation/login");

//const User = require("../../models/User");

//router.get("/test", (req, res) => res.json({ msg: "users works" }));

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.get("/:phoneAndPassword", (req, res) => {
  //console.log("before ", req.params.phoneAndPassword);
  const [phone, password] = req.params.phoneAndPassword.split("----");
  //console.log("after ", phone, password);
  const { errors, isValid } = validateLoginInput({ phone, password });

  if (!isValid) {
    return res.status(400).json(errors);
  }

  //const phone = req.body.phone;
  //res.json({ msg: "correct number" });
  admin
    .auth()
    .getUserByPhoneNumber(`+977${phone}`)
    .then(function (userRecord) {
      const [
        name,
        location,
        company,
        UserPassword,
      ] = userRecord.displayName.split("----");
      if (password === UserPassword) {
        //logged in...
        //checking if any product
        //const products = {};

        let userData = {
          id: userRecord.uid,
          name: name,
          location: location,
          company: company,
          phone: userRecord.phoneNumber,
          avatar: userRecord.photoURL || "",
          Products: [],
        };
        function response(products = null, userProfile = userData) {
          if (products) {
            userProfile.Products = products;
          }
          return res.status(200).json({
            msg: "You are logged in",
            user: userProfile,
          });
        }

        admin
          .firestore()
          .doc(`users/${userRecord.uid}`)
          .get()
          .then((documentSnapshot) => {
            return response((products = documentSnapshot.data().ItemsId));
          })
          .catch((e) => {
            console.log(e.message);
            return response();
          });

        //response here
      } else {
        return res.status(404).json({ password: "password incorrect" });
      }
    })
    .catch(function (error) {
      return res.status(404).json({ phone: "phoneNumber Not Found" });
    });
});

module.exports = router;

//   User.findOne({ email }).then((user) => {
//     if (!user) {
//       errors.email = "User not found";
//       return res.status(404).json(errors);
//     }

//     bcrypt.compare(password, user.password).then((isMatch) => {
//       if (isMatch) {
//         const payload = { id: user.id, name: user.name, avatar: user.avatar };
//         jwt.sign(
//           payload,
//           keys.secretOrKey,
//           { expiresIn: 3600 },
//           (err, token) => {
//             // console.log(token);
//             res.json({
//               success: true,
//               token: "Bearer " + token,
//             });
//           }
//         );
//       } else {
//         return res.status(400).json({ password: "Password incorrect" });
//       }
//     });
//   });
// });

// router.get(
//   "/current",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.json({
//       id: req.user.id,
//       name: req.user.name,
//       email: req.user.email,
//     });
//   }
// );

// User.findOne({ phone: req.body.phone })
//   .then((user) => {
//     if (user) {
//       errors.email = "Email already Exists";
//       return res.status(400).json(errors);
//     } else {
//       const avatar = gravatar.url(req.body.email, {
//         s: "200",
//         r: "pg",
//         d: "mm",
//       });
//       const newUser = new User({
//         name: req.body.name,
//         email: req.body.email,
//         avatar,
//         password: req.body.password,
//         date: Date.now(),
//       });

//       bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//           if (err) throw err;
//           newUser.password = hash;
//           newUser
//             .save()
//             .then((user) => res.json(user))
//             .catch((err) => res.status(400).json({ error: err }));
//         });
//       });
//     }
//   })
//   .catch((err) => res.status(400).json({ error: err }));
