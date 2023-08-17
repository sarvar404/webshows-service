import express from "express";
import { deletWebShow, getAllShows, getAllShowsById, getAllWeb, getAllWebShowsPagination, getWebShow, insertImport, insertWebShow, updateWebShow } from "../../controller/webshow/webShowController.js";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import { insertWebShowActor } from "../../controller/webshow/webshowActorController.js";


dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const folderName = process.env.FILE_URL_WEBSHOW;
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
    file.fieldname === "poster" 
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
  "/insert-webshow",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  insertWebShow
);

router.post("/insert-import",insertImport);




router.put("/update-webshow/:id", upload.fields([
  { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
]),updateWebShow);

router.get("/get-webshow/:id", getWebShow);
router.get("/get-page-webshow/", getAllWebShowsPagination);
router.delete("/delete-webshow/:id", deletWebShow);


// to get all shows by id
router.get("/get-all-shows/:id", getAllShowsById);

router.get("/get-all-shows/", getAllWeb);
// to get all shows
router.get("/total-shows/", getAllShows);

router.post('/actor-insert-for-webshow', insertWebShowActor);

export default router;
