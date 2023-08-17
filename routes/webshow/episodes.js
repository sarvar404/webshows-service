import express from "express";

import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import { deletEpisode, deleteGenerated, getAllEpisodes, getEpisode, getEpisodeById, getEpisodesBySeasonId, insertEpisodesForSeasons, updateEpisodesForSeasons } from "../../controller/webshow/episodesController.js";



dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const folderName = process.env.FILE_URL_EPISODES;
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

  

  if (file.fieldname === "banner"  || file.fieldname === "poster" ) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      callback(null, true);
    }  else {
      return callback(new Error('Invalid file type. Only JPEG and JPG files are allowed!'));
      
    }
  }

  if (!file.fieldname === "banner"  || !file.fieldname === "poster" || !file.fieldname === "source_url" ) {
    if (file.originalname.match(/\.(srt)$/)) {
      callback(null, true);
    }  else {
      return callback(new Error('Invalid file type for subtitle!.'));
      
    }
  }

  if (file.fieldname === "source_url") {
    if (file.mimetype === 'video/mp4') {
      callback(null, true);
    } else {
      return callback(new Error('Invalid file type for source url. Only MP4 files are allowed!'));
      
    }
  }
};

const upload1 = multer({
  storage, // storage : storage
  checkingFileFilter: function(req, file, cb) {
    if (!file) {
      // If no file is sent, allow the request to proceed
      return cb(null, true);
    }else {
      ()=>fileFilter
    }
  }
  
});

const upload = multer({ storage: storage });



router.post("/insert-episode-webshow",upload.any(), insertEpisodesForSeasons);

router.put("/update-episode-webshow/:id",upload.any(), updateEpisodesForSeasons);

router.get("/get-episode/:id", getEpisode);
router.get("/get-episode-by-id/:id", getEpisodeById);
router.get("/get-all-episode/", getAllEpisodes);
router.delete("/delete-episode/:id", deletEpisode);
router.get("/get-episodes-by-season-id/:id", getEpisodesBySeasonId);

router.delete("/delete-generated/", deleteGenerated);

export default router;
