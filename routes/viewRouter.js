const express = require("express");
const {
  getIndex,
  getSemester,
  renderPaper,
  renderUniversity,
} = require("../controllers/viewController");

const router = express.Router();

router.route("/").get(getIndex);
router.route("/sem").get(getSemester);
router.route("/university").get(renderUniversity);
router.route("/paper").get(renderPaper);

module.exports = router;
