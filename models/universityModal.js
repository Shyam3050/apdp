const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A University must have a name"],
    unique: true,
    trim: true,
  },
  shortForm: {
    type: String,
    unique: true,
    trim: true,
    default: "no",
  },
  imageURL: {
    type: String,
    default: "drbrambedkaruniversity.jpg",
  },
  description: {
    type: String,
    required: [true, "Provide university details"],
  },
});

const University = mongoose.model("University", universitySchema);

module.exports = University;
