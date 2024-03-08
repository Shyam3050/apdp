const { findPaper, getSemData } = require("../utils/structurePaperData");
const localUniversityData = require("../data.json");

exports.getIndex = (req, res) => {
  res.status(200).render("", {
    title: "All tours",
  });
};

exports.renderPaper = (req, res) => {
  const paperData = findPaper(req.query);
  console.log(paperData);
  if (!paperData) {
    return res.status(400).json({
      data: "invalid",
    });
  }
  // Return the paper data

  res.status(200).render("paper", {
    data: paperData,
  });
  // res.status(200).json({
  //   data: paperData,
  // });
};

exports.getSemester = (req, res) => {
  const [universityData, transformedData] = getSemData(req.query);

  res.status(200).render("semester", {
    universityData,
    data: transformedData,
    semName: req.query.sem + "sem",
  });
};

exports.renderUniversity = async (req, res) => {
  const university_data = localUniversityData.find(
    (unv) => unv.shortForm === req.query.university
  );
  console.log(university_data);
  if (!university_data) {
    return res.status(200).render("university", {
      data: {
        name: "select university",
        description: "all the university exam papers here.",
        imageURL: "",
        shortForm: "",
      },
    });
  }
  res.status(200).render("university", {
    data: university_data,
  });
};
