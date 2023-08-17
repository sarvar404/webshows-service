import express from "express";
import multer from "multer";

import dotenv from "dotenv";
import fs from "fs";
import { deleteSlides, getAllSlidesPagination, getSlides, getTypes, insertSlides, updateSlides } from "../controller/slideController.js";

dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const folderName = process.env.FILE_URL_SLIDE;
    // create folder if not exists
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }
    callback(null, folderName);
  },
  filename: (request, file, callback) => {
    callback(null, Math.floor(Math.random()*(999-100+1)+100) + Date.now() + file.originalname);
  },
});

const fileFilter = (request, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    callback(null, true);
  } else {
    return callback(new Error('Invalid file type. Only JPEG and JPG files are allowed!'));
    
  }
};

const upload = multer({
  storage, // storage : storage
  fileFilter,
});

router.post(
  "/insert-slide",
  upload.fields([
    { name: "banner", maxCount: 1 },
  ]),
  insertSlides
);

router.get("/get-types/:id", getTypes);
router.get("/get-slide/:id", getSlides);
router.get("/get-page-slides/", getAllSlidesPagination);

// router.get("/get-page-actors/", getAllActorsPagination);

router.put(
  "/update-slide/:id",
  upload.fields([
    { name: "banner", maxCount: 1 },
  ]),
  updateSlides
);


router.delete("/delete-slide/:id", deleteSlides);

export default router;
