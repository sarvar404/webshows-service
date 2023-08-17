import express from "express";
import multer from "multer";
import { deleteActor, deleteMovieActor, getActorIds, getActors, getAllActors, getAllActorsOnlyForSearch, getAllActorsPagination, getAllActorsWithSearchFilter, getMovieActorsById, insertActor, movieActors, updateActor, updateActorRole } from "../controller/actorController.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const folderName = process.env.FILE_URL_ACTORS;
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
  "/insert-actor",
  upload.fields([
    { name: "poster", maxCount: 1 },
  ]),
  insertActor
);

// Addtional router for movies
router.post("/insert-actors-movies", movieActors);
router.get("/get-actors-movies/:id", getMovieActorsById);
router.put("/update-actors-movies", updateActorRole);
router.delete("/delete-actors-movies/:id", deleteMovieActor);

router.get("/get-actor/:id", getActors);
router.get("/get-all-actor/", getAllActors);
router.get("/get-actor-id", getActorIds);

router.put(
  "/update-actor/:id",
  upload.fields([
    { name: "poster", maxCount: 1 },
  ]),
  updateActor
);


router.delete("/delete-actor/:id", deleteActor);

router.get("/get-page-actors/", getAllActorsPagination);
router.get("/get-page-actors-search-only/", getAllActorsOnlyForSearch);
router.get("/get-search-actors/", getAllActorsWithSearchFilter);

export default router;
