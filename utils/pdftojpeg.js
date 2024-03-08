require("dotenv").config();
var convertapi = require("convertapi")(process.env.CONVERTAPIKEY);

//pdf to jpeg
const pdfToImage = async (rawPdf) => {
  const result = await convertapi.convert(
    "webp",
    {
      File: rawPdf,
      //   watermarkedPDFPath
    },
    "pdf"
  );

  return result;
};

module.exports = pdfToImage;
