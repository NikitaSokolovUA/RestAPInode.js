import axios from "axios";
import { conn } from "../../server.js";

export const getInfo = async (req, res, next) => {
  try {
    const { number } = req.params;
    const SEARCH_URL = `https://sis.ukrpatent.org/api/v1/open-data/${number}/`;

    const { data } = await axios.get(SEARCH_URL);
    const [lan, info] = Object.values(data.data.DE[0]);

    const sql = `INSERT INTO Patents.patents_info ( type, state, number, address, registration_date, info) VALUES(?, ?, ?, ?, ?, ?);`;

    conn.query(
      sql,
      [
        data.obj_type,
        data.obj_state,
        data.app_number,
        data.data.I_98,
        data.data.I_24,
        info,
      ],
      (err, results, field) => {
        if (err) {
          if (err.message.includes("Duplicate entry")) {
            res.status(400).json({ error: "Is already exist" });
            return;
          }

          res.status(500).json({ error: "Failed to insert data" });
          return;
        } else {
          conn.query(
            `SELECT (id) FROM Patents.patents_info WHERE number = ${number}`,
            (err, results, fields) => {
              if (err) {
                console.error("ALOHA", err);

                res.status(500).json({ error: "Failed to retrieve ID" });
                return;
              } else {
                const id = results[0].id;
                res.status(200).json({ id: id });
              }
            }
          );
        }
      }
    );
  } catch (e) {
    next(e);
  }
};
