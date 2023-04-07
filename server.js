import app from "./app.js";
import * as dotenv from "dotenv";
import mariadb from "mariadb/callback.js";

dotenv.config();

export const conn = mariadb.createConnection({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "12345678",
});

(async () => {
  try {
    conn.connect((err) => {
      if (err) {
        console.log("не удалось подключиться из-за ошибки: " + err);
      } else {
        console.log(
          "подключено ! идентификатор соединения равен " + conn.threadId
        );
      }
    });

    app.listen(3000, () => {
      console.log("Server is running");
    });
  } catch (e) {
    console.log("Error while conection");
    process.exit(1);
  }
})();
