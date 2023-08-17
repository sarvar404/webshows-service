import express from "express";
import dotenv from "dotenv";
import { seasonByWebId, seasonId, webId } from "../controller/idFetchController.js";


dotenv.config();

const router = express.Router();

router.get("/wid", webId);
router.get("/sid", seasonId);
router.get("/sid/:id", seasonByWebId);



export default router;
