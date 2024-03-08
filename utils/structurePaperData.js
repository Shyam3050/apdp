const fs = require("fs");

exports.convertToDesiredStructure = (papers) => {
  const universities = [];

  papers.forEach((paper) => {
    const universityIndex = universities.findIndex(
      (u) => u._id === paper.universityId._id
    );
    if (universityIndex === -1) {
      // University not found, create a new entry
      universities.push({
        _id: paper.universityId._id,
        name: paper.universityId.name,
        shortForm: paper.universityId.shortForm,
        description: paper.universityId.description,
        imageURL: paper.universityId.imageURL,
        years: [],
      });
    }

    // Find the university index again after possible creation
    const foundUniversity = universities.find(
      (u) => u._id === paper.universityId._id
    );

    const yearIndex = foundUniversity.years.findIndex(
      (y) => y.year === parseInt(paper.yearName)
    );
    if (yearIndex === -1) {
      // Year not found, create a new entry
      foundUniversity.years.push({
        _id: paper.yearName, // You can use any unique identifier for year
        year: parseInt(paper.yearName),
        semesters: [],
      });
    }

    // Find the year index again after possible creation
    const foundYear = foundUniversity.years.find(
      (y) => y.year === parseInt(paper.yearName)
    );

    const semesterIndex = foundYear.semesters.findIndex(
      (s) => s.semName === paper.semName
    );
    if (semesterIndex === -1) {
      // Semester not found, create a new entry
      foundYear.semesters.push({
        _id: paper.semName, // You can use any unique identifier for semester
        semName: paper.semName,
        subjects: [],
      });
    }

    // Find the semester index again after possible creation
    const foundSemester = foundYear.semesters.find(
      (s) => s.semName === paper.semName
    );

    const subjectIndex = foundSemester.subjects.findIndex(
      (sub) => sub.subjectName === paper.subjectName
    );
    if (subjectIndex === -1) {
      // Subject not found, create a new entry
      foundSemester.subjects.push({
        _id: paper.subjectName, // You can use any unique identifier for subject
        subjectName: paper.subjectName,
        papers: [],
      });
    }

    // Find the subject index again after possible creation
    const foundSubject = foundSemester.subjects.find(
      (sub) => sub.subjectName === paper.subjectName
    );

    // Finally, push the paper details into the subject
    foundSubject.papers.push(paper);
  });

  return universities;
};

exports.findPaper = (params) => {
  const { universityId, yearId, semesterId, subjectId, paperId } = params;
  const universities = JSON.parse(fs.readFileSync("data.json"));

  // Find the university with the given ID
  const university = universities.find((u) => u._id === universityId);
  if (!university) {
    return false;
  }

  // Find the year within the university
  const year = university.years.find((y) => y._id === yearId);
  if (!year) {
    return false;
  }

  // Find the semester within the year
  const semester = year.semesters.find((s) => s._id === semesterId);
  if (!semester) {
    return false;
  }

  // Find the subject within the semester
  const subject = semester.subjects.find((sub) => sub._id === subjectId);
  if (!subject) {
    return false;
  }

  // Find the paper within the subject
  const paper = subject.papers.find((p) => p._id === paperId);
  if (!paper) {
    return false;
  }
  return paper;
};

exports.getSemData = (query) => {
  let { university, sem } = query;
  sem = sem + "sem";
  const universities = JSON.parse(fs.readFileSync("data.json"));

  const universityData = universities.find((u) => u.shortForm === university);

  if (!universityData) return false;

  const transformedData = [];
  universityData.years.forEach((year) => {
    // Find the semester with the specified semName
    const semester = year.semesters.find((s) => s.semName === sem);
    if (semester) {
      // Iterate over each subject in the semester
      semester.subjects.forEach((subject) => {
        subject.papers.forEach((paper) => {
          const paperData = {
            paperName: paper.paperTitle,
            subjectName: subject.subjectName,
            years: [
              {
                yearName: year.year,
                paperData: paper,
              },
            ],
          };
          // Check if the paper name already exists in the transformed data
          const existingPaper = transformedData.find(
            (item) => item.paperName === paperData.paperName
          );
          if (existingPaper) {
            // If exists, merge the years data
            existingPaper.years.push(...paperData.years);
          } else {
            // If not, push the paper data to transformed data
            transformedData.push(paperData);
          }
        });
      });
      // Create an object for the paper data
    }
  });

  return [
    {
      name: universityData.name,
      shortForm: universityData.shortForm,
    },
    transformedData,
  ];
};
