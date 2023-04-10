import express from "express";
import morgan from "morgan";
import cors from "cors";
import { routerInfo } from "./routes/info.js";

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(morgan(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api", routerInfo);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  console.log("err:    ", err.message);
  console.log(err.name);

  if (err.message === "Request failed with status code 404") {
    res.status(404).json({ message: "not found" });
  }
  res.status(500).json({ message: "Internal server error" });
});

export default app;
