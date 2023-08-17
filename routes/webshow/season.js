import express from "express";

import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import { deletSeason, getAllSeason, getSeason, getSeasonById, getSeasonsByWebShowId, insertImportSeason, insertSeasonForWebShow, updateSeason } from "../../controller/webshow/webShowSeasonController.js";

dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const folderName = process.env.FILE_URL_SERIES;
    // create folder if not exists
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }
    callback(null, folderName);
  },
  filename: (request, file, callback) => {
    callback(
      null,
      Math.floor(Math.random() * (999 - 100 + 1) + 100) +
        Date.now() +
        file.originalname
    );
  },
});

const fileFilter = (request, file, callback) => {
  if (
    file.fieldname === "banner" ||
    file.fieldname === "poster" ||
    file.fieldname === "season_poster" ||
    file.fieldname === "season_banner"
  ) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      callback(null, true);
    } else {
      return callback(
        new Error("Invalid file type. Only JPEG and JPG files are allowed!")
      );
    }
  }

  if (file.fieldname === "sub_file") {
    if (file.originalname.match(/\.(srt)$/)) {
      callback(null, true);
    } else {
      return callback(new Error("Invalid file type for subtitle!."));
    }
  }

  if (file.fieldname === "source_url") {
    if (file.mimetype === "video/mp4") {
      callback(null, true);
    } else {
      return callback(
        new Error(
          "Invalid file type for source url. Only MP4 files are allowed!"
        )
      );
    }
  }
};

const upload = multer({
  storage, // storage : storage
  fileFilter,
});

router.post(
  "/insert-season-webshow",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  insertSeasonForWebShow
);



router.put(
  "/update-season-webshow/:id",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateSeason
);

router.post("/insert-import-season",insertImportSeason);

router.get("/get-season/:id", getSeason);
router.get("/get-season-by-webshow-id/:id", getSeasonsByWebShowId);
router.get("/get-season-by-id/:id", getSeasonById);
router.get("/get-all-season/", getAllSeason);
router.delete("/delete-season/:id", deletSeason);

export default router;
