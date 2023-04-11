import express from "express";
import { getInfo } from "../controllers/info/getInfo.js";
import { getDoc } from "../controllers/info/getDoc.js";
import getRowsById from "../middleware/getRowsById.js";
import { getPdf } from "../controllers/info/getPdf.js";
import { getXlsx } from "../controllers/info/getXlsx.js";
import { parcing } from "../controllers/info/parcing.js";

export const routerInfo = express.Router();

routerInfo.get("/info/:number", getInfo);
routerInfo.get("/info/get-docx/:id", getRowsById, getDoc);
routerInfo.get("/info/get-pdf/:id", getRowsById, getPdf);
routerInfo.get("/info/get-xlsx/:id", getRowsById, getXlsx);
routerInfo.get("/pars", parcing);
