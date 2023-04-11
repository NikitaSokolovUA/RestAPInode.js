import axios from "axios";
import { conn } from "../../server.js";

export const getInfo = async (req, res, next) => {
  try {
    const { number } = req.params;
    const SEARCH_URL = `https://sis.ukrpatent.org/api/v1/open-data/${number}/`;

    const { data } = await axios.get(SEARCH_URL);
    // const [lan, info] = Object.values(data.data.DE[0]);

    const pattentName = data.data.I_54[0]["I_54.U"];
    const b = data.data.I_71;
    const owners = [];

    b.flatMap((el) => {
      if (el["I_71.N.R"] && !owners.includes(el["I_71.N.R"])) {
        owners.push(el["I_71.N.R"]);
      }
    });

    const strOwners = owners.join(", ");

    const sql = `INSERT INTO Patents.patents_info ( type, state, number, address, registration_date, info) VALUES(?, ?, ?, ?, ?, ?);`;
    let id;
    conn.query(
      sql,
      [
        pattentName,
        data.obj_state,
        data.app_number,
        data.data.I_98,
        data.data.I_24,
        strOwners,
      ],

      (err, results, field) => {
        if (err) {
          console.log(err);

          if (err.message.includes("Duplicate entry")) {
            res.status(400).json({ error: "Is already exist" });
            return;
          }

          res.status(500).json({ error: "Failed to insert data" });
          return;
        } else {
          conn.query(
            `SELECT (id) FROM Patents.patents_info WHERE number = ?`,
            [number],
            (err, results, fields) => {
              if (err) {
                res.status(500).json({ error: "Failed to retrieve ID" });
                return;
              } else {
                id = results[0];
              }
            }
          );
        }
      }
    );
    res
      .status(200)
      .json({
        id,
        name: pattentName,
        state: data.obj_state,
        number: data.app_number,
        address: data.data.I_98,
        registrationDate: data.data.I_24,
        owners: strOwners,
      });
  } catch (e) {
    next(e);
  }
};
