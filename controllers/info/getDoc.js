import docx from "docx";
import * as fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getDoc = async (req, res, next) => {
  try {
    const { type, number, address, registration_date, info } = req.results[0];

    const table = new docx.Table({
      rows: [
        new docx.TableRow({
          children: [
            new docx.TableCell({
              children: [new docx.Paragraph("Patent number")],
            }),
            new docx.TableCell({
              children: [new docx.Paragraph(number)],
            }),
          ],
        }),
        new docx.TableRow({
          children: [
            new docx.TableCell({
              children: [new docx.Paragraph("Name")],
            }),
            new docx.TableCell({
              children: [new docx.Paragraph(type)],
            }),
          ],
        }),
        new docx.TableRow({
          children: [
            new docx.TableCell({
              children: [new docx.Paragraph("Registration Date")],
            }),
            new docx.TableCell({
              children: [
                new docx.Paragraph(
                  registration_date.toISOString().slice(0, 10)
                ),
              ],
            }),
          ],
        }),
        new docx.TableRow({
          children: [
            new docx.TableCell({
              children: [new docx.Paragraph("Address")],
            }),
            new docx.TableCell({
              children: [new docx.Paragraph(address)],
            }),
          ],
        }),
        new docx.TableRow({
          children: [
            new docx.TableCell({
              children: [new docx.Paragraph("Owners")],
            }),
            new docx.TableCell({
              children: [new docx.Paragraph(info)],
            }),
          ],
        }),
      ],
    });

    const document = new docx.Document({
      creator: "NS",
      description: "My extremely interesting document",
      title: "My Document",
      encoding: "utf-8",

      sections: [
        {
          properties: {},
          children: [table],
        },
      ],
    });

    const buffer = await docx.Packer.toBuffer(document);

    const filename = `Pattent_${number}.docx`;
    const filepath = `./dist/${filename}`;
    fs.writeFileSync(filepath, buffer);

    const distDir = path.resolve(__dirname, "../..", "dist");

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.sendFile(filename, { root: distDir });
  } catch (error) {
    next(error);
  }
};
