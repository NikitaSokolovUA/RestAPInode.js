import { conn } from "../../server.js";

export const getDoc = async (req, res, next) => {
  try {
    const { results } = req;
    console.log(results);
    // const { id } = req.params;

    // conn.query(
    //   `SELECT type, state, number, address, registration_date, info FROM Patents.patents_info WHERE id= ${id}`,
    //   (err, results, fields) => {
    //     if (err) {
    //       console.log(err);
    //       res.status(500).json({ error: "Failed to retrieve ID" });
    //       return;
    //     } else {
    //       console.log("type: ", results);
    //       res.status(200).json({ id: "yes" });
    //     }
    //   }
    // );
    res.status(200).json({ id: "yes" });
  } catch (error) {
    next(error);
  }
};
