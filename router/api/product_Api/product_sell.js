const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");
const path = require("path");
const os = require("os");
const fs = require("fs");
const Busboy = require("busboy");

const validateUserAndProduct = require("../../../validation/ProductDetails");
const uploadFile = require("../../../validation/UploadToFirebase");

router.post("/", (req, res) => {
  if (req.method !== "POST") {
    // Return a "method not allowed" error
    return res.status(405).end();
  }
  const busboy = new Busboy({ headers: req.headers });
  const tmpdir = os.tmpdir();

  // This object will accumulate all the fields, keyed by their name
  const fields = {};

  // This object will accumulate all the uploaded files, keyed by their name.
  const uploads = {};

  // This code will process each non-file field in the form.
  busboy.on("field", (fieldname, val) => {
    // TODO(developer): Process submitted field values here
    //console.log(`Processed field ${fieldname}: ${val}.`);
    fields[fieldname] = val;
  });

  const fileWrites = [];

  // This code will process each file uploaded.
  busboy.on("file", (fieldname, file, filename) => {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    //console.log(`Processed file ${filename}`);
    const filepath = path.join(tmpdir, filename);
    uploads[fieldname] = filepath;

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    // File was processed by Busboy; wait for it to be written.
    // Note: GCF may not persist saved files across invocations.
    // Persistent files must be kept in other locations
    // (such as Cloud Storage buckets).
    const promise = new Promise((resolve, reject) => {
      file.on("end", () => {
        writeStream.end();
      });
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
    fileWrites.push(promise);
  });

  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.
  busboy.on("finish", async () => {
    await Promise.all(fileWrites);

    // TODO(developer): Process saved files here
    //console.log("validating!!!");
    //validating elements here
    const { errors, isValid } = validateUserAndProduct(
      fields,
      uploads.productImage
    );

    if (!isValid) {
      ///fs.unlinkSync(`./uploads/${req.file.filename}`);
      //   for (const file in uploads) {
      //     fs.unlinkSync(uploads[file]);
      //   }
      //   busboy.end(req.rawBody);
      res.status(400).json(errors);
      //now uploadinf to google cloud
    } else {
      //Global = {};
      //res.send("upload success");
      //now uploading to google cloud
      try {
        const userRecord = await admin.auth().getUser(fields.userId);
        //console.log(userRecord);
        //first upload image using IIFE
        const imageName = await uploadFile(uploads.productImage);
        const imageLink = `https://storage.googleapis.com/e-nawalpur.appspot.com/ProductImages/${imageName}`;
        //create a document of the product under particular catagory
        const collectionRef = admin.firestore().collection(fields.catagory);
        //const collectionRef = admin.firestore().collection("hey");
        //console.log(collectionRef);

        if (userRecord.displayName) {
          const [, location, company] = userRecord.displayName.split("----");
          //Global.name = name;
          fields[location] = location;
          fields[company] = company;
        }

        const document = await collectionRef.add({
          name: fields.name,
          imageLink: imageLink,
          price: fields.price,
          quantity: fields.quantity,
          location: fields.location || "",
          contact: userRecord.phoneNumber,
          vendor: fields.company || "",
        });

        //now adding uploaded document to respective user's profile
        admin.firestore().runTransaction((transaction) => {
          const documentRef = admin.firestore().doc(`users/${userRecord.uid}`);
          return transaction.get(documentRef).then((doc) => {
            if (doc.exists) {
              const newItems = [...doc.data().ItemsId, document.id];
              //console.log(newItems);
              transaction.update(documentRef, {
                ItemsId: newItems,
              });
            } else {
              //console.log("doc not found, now creating");
              //ErrorSelling.UserDoc = "User Document Not Found";
              admin
                .firestore()
                .doc(`users/${userRecord.uid}`)
                .set({
                  ItemsId: [document.id],
                });
            }
          });
        });

        //console.log("uploaded document: ", document.id);
        res.status(200).json({ msg: "uploaded document:", id: document.id });
      } catch (error) {
        //req.file && fs.unlinkSync(`./uploads/${req.file.filename}`);
        //console.log("error ", error);
        res.status(400).json({ error: "error selling this product" });
        //if not valid user , remove uploaded image.
      }
    }

    for (const file in uploads) {
      fs.unlinkSync(uploads[file]);
    }
    //res.send("upload success");
    //console.log("also deleted");
  });

  busboy.end(req.rawBody);
});

module.exports = router;
