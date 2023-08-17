import express from "express";
import multer from "multer";

import dotenv from "dotenv";
import fs from "fs";
import { deleteCategory, getAllCategoriesPagination, getCategoriesWithType, getCategoryById, getMoveCategories, insertCategory, updateCategory } from "../controller/categoriesController.js";

dotenv.config();

const router = express.Router();


router.get("/get-categories-movie/:id", getCategoriesWithType);
router.post("/insert-category",insertCategory);
router.get("/get-cateogory/:id", getCategoryById);
router.get("/get-cateogory", getMoveCategories);
router.put("/update-cateogory/:id", updateCategory);

router.delete("/delete-category/:id", deleteCategory);

router.get("/get-page-categories/", getAllCategoriesPagination);


export default router;
