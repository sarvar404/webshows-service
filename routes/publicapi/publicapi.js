import express from "express";
import dotenv from "dotenv";
import { getPublicCategories, getPublicMovieDetails, getPublicMoviesByCategory, getPublicWebShowsByCategory, getPublicWebshowDetails, getSources, getTotalLiveTv, getTotalSportTv, login, regsiteration } from "../../controller/publicController.js";
import { checkAuth, restrictToLoggedinUserOnly } from "../../middlewares/middlewareAuth.js";

dotenv.config();

const router = express.Router();



router.get("/get-movies-category", getPublicMoviesByCategory);
router.get("/get-single-movie-detail", getPublicMovieDetails);


router.get("/get-webshows-category", getPublicWebShowsByCategory);
router.get("/get-single-webshow-detail", getPublicWebshowDetails);
router.get("/get-categories-by-choice", getPublicCategories);


router.get("/regsiteration", regsiteration);
router.get("/login", login);

router.get("/get-sources", getSources);

router.get("/get-live-tv-total", getTotalLiveTv);
router.get("/get-sport-tv-total", getTotalSportTv);


export default router;
