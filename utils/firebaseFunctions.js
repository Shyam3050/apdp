const app = require("../firebase.config");
const { getDownloadURL } = require("firebase-admin/storage");
const AppError = require("./appError");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const { Buffer } = require("buffer");

exports.uploadResource = async (resource, fileDestination, contentType) => {
  const bucket = app.storage().bucket();

  let resourceURL = "";
  try {
    const result = await bucket.upload(resource, {
      metadata: {
        destination: fileDestination,
        contentType: "application/pdf", // Adjust contentType based on your image type
      },
    });
    resourceURL = await getDownloadURL(result[0]);
  } catch (err) {
    new AppError("server Error try again", 500);
  }
  return resourceURL;
};
exports.uploadImagesToFirebase = async (imageUrls) => {
  const uploadedImageUrls = [];
  const uploadedImageNames = [];
  const bucket = admin.storage().bucket();

  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i].Url;
    const uniqueId = uuidv4();
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Generate a unique filename for the image
    const imageName = `image_${i + 1}_${uniqueId}.webp`;

    const file = bucket.file(`images/${imageName}`);
    await file.save(buffer, {
      metadata: {
        contentType: "image/webp",
      },
    });
    // Get the public URL of the uploaded image
    const [_imageUrl] = await bucket.file(`images/${imageName}`).getSignedUrl({
      action: "read",
      expires: "01-01-2100",
    });

    uploadedImageUrls.push(_imageUrl);
    uploadedImageNames.push(`image_${i + 1}_${uniqueId}.webp`);
  }

  return [uploadedImageUrls, uploadedImageNames];
};
