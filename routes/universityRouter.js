const express = require("express");
const {
  getAllUniversity,
  createUniversity,
  getAllUniversityData,
  uploadPhoto,
  getLocalUniversityData,
} = require("../controllers/universityController");

const router = express.Router();

router.route("/").get(getAllUniversity).post(uploadPhoto, createUniversity);
router.route("/getalluniversitydata").get(getAllUniversityData);
router.route("/getlocaldata").get(getLocalUniversityData);
module.exports = router;
