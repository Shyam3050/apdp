const multer = require("multer");
const admin = require("firebase-admin");
const pdfToImg = require("../utils/pdftojpeg");
const University = require("../models/universityModal");
const Paper = require("../models/paperModal");

const { uploadImagesToFirebase } = require("../utils/firebaseFunctions");
//   });

// };

const upload = multer({ storage: multer.memoryStorage() }).single("pdfFile");
const bucket = admin.storage().bucket();

exports.addPaper = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading PDF:", err);
        return res.status(500).json({ error: "Failed to upload PDF" });
      }

      //start
      const uniqueFileName = `${req.body.selectUniversity}-${req.body.selectSubject}-${req.body.paperName}-${req.body.selectSem}-${req.body.addYear}`;
      console.log(uniqueFileName);
      const [universityData] = await University.find({
        name: req.body.selectUniversity,
      }).lean();
      console.log(universityData);

      const checkPaper = await Paper.find({
        paperTitle: req.body.paperName,
        universityId: universityData._id,
        yearName: req.body.addYear,
        semName: req.body.selectSem,
        subjectName: req.body.selectSubject,
      });

      console.log(checkPaper);

      if (checkPaper.length > 0) {
        return res.status(200).json({
          status: "success",
          data: "This paper already have. For editing go to update section",
        });
      }

      //stop

      const pdfBuffer = req.file.buffer;

      try {
        const file = bucket.file(`pdf/${uniqueFileName}.pdf`);
        await file.save(pdfBuffer, {
          metadata: {
            contentType: "application/pdf",
          },
        });

        // Generate a signed URL for the uploaded file
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: "01-01-2100",
        });

        const pdf_img_result = await pdfToImg(url);

        const [savedImageURL, savedImageNames] = await uploadImagesToFirebase(
          pdf_img_result.response.Files
        );
        const paperData = await Paper.create({
          paperTitle: req.body.paperName,
          paperDescription: req.body.paperDescription,
          pdfFileName: `${uniqueFileName}.pdf`,
          pdfFileURL: url,
          paperPdfImages: savedImageNames,
          paperPdfImagesURL: savedImageURL,
          universityId: universityData._id,
          yearName: req.body.addYear,
          semName: req.body.selectSem,
          subjectName: req.body.selectSubject,
        });
        res.status(200).json({ data: { paperData } });
      } catch (err) {
        console.error("Error uploading PDF to Firebase Storage:", err);
        res
          .status(500)
          .json({ error: "Failed to upload PDF to Firebase Storage" });
      }
    });
  } catch (err) {
    console.error("Error uploading PDF:", err);
    return res.status(500).json({ error: "Failed to upload PDF" });
  }
};
