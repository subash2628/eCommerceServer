const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require("cors");

const multer = require("multer");
// const upload = multer();
//const formidable = require("express-formidable");

const config = require("./config/firestore-admin").firebaseconfig;
//console.log(config);
admin.initializeApp(config);

//express app
const app = express();

// const formData = require("express-form-data");
// app.use(formData.parse());

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//cors
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors());

//multer
// app.use(
//   multer({
//     dest: "./uploads/",
//     rename: function (fieldname, filename) {
//       return filename.replace(/\W+/g, "-").toLowerCase() + Date.now();
//     },
//     onFileUploadStart: function (file) {
//       console.log(file.fieldname + " is starting ...");
//     },
//     onFileUploadData: function (file, data) {
//       console.log(data.length + " of " + file.fieldname + " arrived");
//     },
//     onFileUploadComplete: function (file) {
//       console.log(file.fieldname + " uploaded to  " + file.path);
//     },
//   })
// );

// for parsing multipart/form-data
//app.use(upload.array());

//Routes paths
const users_register = require("./router/api/user_Api/user_register");
const users_login = require("./router/api/user_Api/user_login");
const product_sell = require("./router/api/product_Api/product_sell");
const product_all = require("./router/api/product_Api/product_all");
const product_id = require("./router/api/product_Api/product_id");
const user_me = require("./router/api/user_Api/user_me");
const product_catagory_all = require("./router/api/product_Api/catagory_all");
const uploadFiles = require("./router/api/test/uploadImage");

//Routes
//user routes
app.use("/api/users/register", users_register);
app.use("/api/users/me", user_me);
app.use("/api/users/login", users_login);

//product routes
app.use("/api/product/sell", product_sell);
app.use("/api/product/all", product_all);
app.use("/api/product/id", product_id);
app.use("/api/product/catagory/all", product_catagory_all);

//test
app.use("/api/product/sell/testImageUpload", uploadFiles);
exports.app = functions.https.onRequest(app);
