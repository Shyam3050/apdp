const fs = require("fs");
const University = require("../models/universityModal");
const multer = require("multer");
const AppError = require("../utils/appError");
const Paper = require("../models/paperModal");
const { convertToDesiredStructure } = require("../utils/structurePaperData");
const universityLocalData = require("../data.json");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/university");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(
      null,
      `${req.body.name ? req.body.name : "university"}${Date.now()}.${ext}`
    );
  },
});

const multerFilter = (req, file, cb) => {
  // only jpg, jpeg & png allowed
  if (["image/jpeg", "image/png"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("not a image please upload only image", 400), false);
  }
};
const upload = multer({
  fileFilter: multerFilter,
  storage: multerStorage,
});
exports.uploadPhoto = upload.single("imageURL");

exports.getAllUniversity = async (req, res) => {
  const universitys = await University.find();
  res.status(200).json({
    status: "success",
    data: universitys,
  });
};

exports.createUniversity = async (req, res) => {
  req.body.imageURL = req.file.filename;
  const university = await University.create(req.body);

  res.status(200).json({
    status: "success",
    data: university,
  });
};

exports.getAllUniversityData = async (req, res) => {
  const papers = await Paper.find().populate("universityId");
  const structedPaers = convertToDesiredStructure(papers);
  const jsonData = JSON.stringify(structedPaers, null, 2);

  // Write JSON string to a file
  fs.writeFile("data.json", jsonData, (err) => {
    if (err) {
      res.status(500).send("Error writing to file");
    } else {
      res.status(200).send("Data has been successfully updated.");
    }
  });
};

exports.getLocalUniversityData = (req, res) => {
  const university = universityLocalData.find(
    (unv) => unv.shortForm === req.query.university
  );
  res.status(200).json({
    status: "success",
    data: university ? university : false,
  });
};
