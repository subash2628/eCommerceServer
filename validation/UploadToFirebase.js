//getting bucket
//const fs = require("fs"); //for deleting file
const admin = require("firebase-admin");
const bucket = admin.storage().bucket();

module.exports = async function (ImageLocalPath) {
  //console.log("hello from function");

  //const localPath = `./uploads/${req.file.filename}`;
  //console.log("1");
  const ImageName = ImageLocalPath.split("/").slice(-1)[0];
  const data = await bucket.upload(ImageLocalPath, {
    destination: `ProductImages/${ImageName}`,
  });
  //console.log("2");

  //grabbing uploaded remote link
  //useful_datas.imageLink = data[0].metadata.mediaLink;

  //making uploaded file publicly readable from url
  const file = bucket.file(data[0].metadata.name);
  const public = await file.makePublic();

  //finally deleting from local server storage
  //console.log("3");
  //fs.unlinkSync(localPath);

  //console.log("4");

  return ImageName;
};
