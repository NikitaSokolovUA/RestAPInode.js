import * as fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getPdf = async (req, res, next) => {
  try {
    const { type, number, address, registration_date, info } = req.results[0];

    let doc = new PDFDocument({ margin: 30, size: "A4" });

    const fontPath = path.join(
      __dirname,
      "../../fonts",
      "OpenSans-Regular.ttf"
    );

    const borderWidth = 2;
    const borderColor = "#000";

    doc.pipe(fs.createWriteStream(`./dist/${number.trim()}.pdf`));

    doc
      .font(fontPath)
      .fontSize(20)
      .text(`Патент № ${number} `)
      .strokeColor(borderColor)
      .lineWidth(borderWidth)
      .stroke();
    doc.moveDown();

    doc.font(fontPath).fontSize(20).text(`Назва патенту: ${type}`);
    doc.moveDown();
    doc
      .font(fontPath)
      .fontSize(20)
      .text(`Дата реєстрації: ${registration_date.toISOString().slice(0, 10)}`);
    doc.moveDown();

    doc.font(fontPath).fontSize(20).text(`Адреса: ${address}`);
    doc.moveDown();
    doc.font(fontPath).fontSize(20).text(`Власники: ${info}`);

    const pdfBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);
      doc.end();
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${number.trim()}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (e) {
    next(e);
  }
};
