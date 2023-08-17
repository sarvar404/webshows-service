import express from "express";

import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {
  getAllMoviesHomePage,
  getAllTvChannelHomePage,
  getAllWebShowsHomePage,
  getBannerHome,
  getCategoriesWithFeaturedById,
  getFeaturedCategories,
  setPositionByObjectId,
  updateFeatureByObjectId,
  
} from "../controller/homeController.js";

dotenv.config();

const router = express.Router();

router.get("/get-categories-home/", getFeaturedCategories);
router.get("/get-banner-home/", getBannerHome);
router.get("/get-featured-categories-home/:id", getCategoriesWithFeaturedById);
router.put("/update-featured-categories-home/:id", updateFeatureByObjectId);
router.put("/update-position-categories-home/:id", setPositionByObjectId);

router.get("/get-tv-home/:id", getAllTvChannelHomePage);
router.get("/get-movie-home/:id", getAllMoviesHomePage);
router.get("/get-webshow-home/:id", getAllWebShowsHomePage);

export default router;
