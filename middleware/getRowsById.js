import { conn } from "../server.js";

const getRowsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    conn.query(
      `SELECT type, state, number, address, registration_date, info FROM Patents.patents_info WHERE id= ${id}`,
      (err, results, fields) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Failed to retrieve ID" });
          return;
        } else {
          req.results = results;
          // console.log("type: ", results);
          next();
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

export default getRowsById;
