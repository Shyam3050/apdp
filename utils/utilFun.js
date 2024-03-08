const fs = require("fs");
const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");

exports.addWatermarkToPDF = async (
  uploadedPDFPath,
  watermarkText,
  watermarkedPDFPath
) => {
  // Read the uploaded PDF file
  const pdfBytes = fs.readFileSync(uploadedPDFPath);
  // Add watermark to the PDF
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const firstPage = pages[i];
    firstPage.drawText(watermarkText, {
      x: 30,
      y: 40,
      size: 20,
      font: helveticaFont,
      color: rgb(0, 0, 0, 0.1),
      rotate: degrees(0),
    });
  }
  // Save the watermarked PDF
  fs.writeFileSync(watermarkedPDFPath, await pdfDoc.save());
};
