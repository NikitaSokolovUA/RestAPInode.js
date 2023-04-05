import { app } from "./app";

(async () => {
  try {
    app.listen(3000, () => {
      console.log("Server is running");
    });
  } catch (e) {
    console.log("Error while conection");
    process.exit(1);
  }
})();
