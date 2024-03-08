const express = require("express");
const {
  addPaper,
} = require("../controllers/paperController");

const router = express.Router();

// router.route("/").post(upload, addPapaer);
router.route("/").post(addPaper);

module.exports = router;
