import * as fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import * as xlsx from "xlsx";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getXlsx = async (req, res, next) => {
  try {
    const { type, number, address, registration_date, info } = req.results[0];

    const workbook = xlsx.utils.book_new();

    const data = [
      { name: "Номер", credentials: number },
      { name: "Назва", credentials: type },
      { name: "Адрес", credentials: address },
      {
        name: "Дата регистрации:",
        credentials: registration_date.toISOString().slice(0, 10),
      },
      { name: "Информация", credentials: info },
    ];

    const worksheet = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx.writeFile(workbook, `./dist/${number.trim()}.xlsx`);

    const distDir = path.resolve(__dirname, "../..", "dist");
    const filename = `${number.trim()}.xlsx`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.sendFile(filename, { root: distDir });
  } catch (e) {
    next(e);
  }
};
