import express from "express";
import { collectDataThroughApi, deletMovie, deleteGenerated, getAllMovies, getAllMoviesPagination, getMovie, insertImportMovie, insertMovie, updateMovie } from "../controller/movieController.js";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const folderName = process.env.FILE_URL_MOVIES;
    // create folder if not exists
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }
    callback(null, folderName);
  },
  filename: (request, file, callback) => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const currentDate = new Date().toISOString().replace(/:/g, '-');
    const fileName = `${currentDate}-${randomNumber}${path.extname(file.originalname)}`;
    callback(null, fileName);
  },
});

// const fileFilter = (request, file, callback) => {

  

//   if (file.fieldname === "banner"  || file.fieldname === "poster" ) {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
//       callback(null, true);
//     }  else {
//       return callback(new Error('Invalid file type. Only JPEG and JPG files are allowed!'));
      
//     }
//   }

//   if (!file.fieldname === "banner"  || !file.fieldname === "poster" || !file.fieldname === "source_url" ) {
//     if (file.originalname.match(/\.(srt)$/)) {
//       callback(null, true);
//     }  else {
//       return callback(new Error('Invalid file type for subtitle!.'));
      
//     }
//   }

//   if (file.fieldname === "source_url") {
//     if (file.mimetype === 'video/mp4') {
//       callback(null, true);
//     } else {
//       return callback(new Error('Invalid file type for source url. Only MP4 files are allowed!'));
      
//     }
//   }
// };

const upload1 = multer({
  storage, // storage : storage
  // checkingFileFilter: function(req, file, cb) {
  //   if (!file) {
  //     // If no file is sent, allow the request to proceed
  //     return cb(null, true);
  //   }else {
  //     ()=>fileFilter
  //   }
  // }
  
});

const upload = multer({ storage: storage });


router.post(
  "/insert-movie",
  upload.any(),
  insertMovie
);


// router.post("/insert-import-movie",importMovie);

router.put("/update-movie/:id",
upload.any()
, updateMovie);

router.post("/insert-import-movie",insertImportMovie);

router.get("/get-movie/:id", getMovie);
router.get("/get-all-movie/", getAllMovies);

router.get("/get-page-movies/", getAllMoviesPagination);

router.delete("/delete-movie/:id", deletMovie);

router.delete("/delete-generated/", deleteGenerated);

//!  Here we just mapping api url.
router.get("/get-api-details/", collectDataThroughApi);


export default router;
