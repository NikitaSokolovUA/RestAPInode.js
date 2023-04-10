import express from "express";
import { getInfo } from "../controllers/info/getInfo.js";
import { getDoc } from "../controllers/info/getDoc.js";
import getRowsById from "../middleware/getRowsById.js";

export const routerInfo = express.Router();

routerInfo.get("/info/:number", getInfo);
routerInfo.get("/info/get-docx/:id", getRowsById, getDoc);
// routerInfo.get("/info/get-docx/:id", getDoc);
