const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  paperTitle: {
    type: String,
    required: [true, "Provide the paper name"],
  },
  paperDescription: {
    type: String,
  },
  yearName: {
    type: String,
    required: [true, "required field"],
  },
  semName: {
    type: String,
    required: [true, "required field"],
  },
  subjectName: {
    type: String,
    required: [true, "required field"],
  },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  uploadDate: { type: Date, default: Date.now },
  pdfFileName: String,
  paperPdfImages: [String],
  pdfFileURL: String,
  paperPdfImagesURL: [String],
});

const Paper = mongoose.model("Paper", paperSchema);



module.exports = Paper;
