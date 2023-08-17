import express from "express";
import {
    deleteTvChannel,
    getAllTvChannel,
    getAllTvChannelPagination,
    getTvChannel,
  insertTvChanel,
  updateTvChanel,
} from "../controller/tvChannelsController.js";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const folderName = process.env.FILE_URL_CHANNEL;
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
  if (file.fieldname === "banner" || file.fieldname === "poster") {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      callback(null, true);
    } else {
      return callback(
        new Error("Invalid file type. Only JPEG and JPG files are allowed!")
      );
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
  "/insert-tvchannel",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  insertTvChanel
);

router.put(
  "/update-tvchannel/:id",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateTvChanel
);
router.get("/get-all-channel/", getAllTvChannel);
router.get("/get-single-channel/:id", getTvChannel);

router.get("/get-page-tvchannel/", getAllTvChannelPagination);

router.delete("/delete-channel/:id", deleteTvChannel);

export default router;
