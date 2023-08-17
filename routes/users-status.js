import express from "express";

import dotenv from "dotenv";




dotenv.config();

const router = express.Router();


// router.get("/get-categories-movie/", getMoveCategories);
router.post("/insert-user",insertUser);
router.get("/get-user-search",getAllUsersWithSearch);
router.get("/get-all-user",getAllUsers);
router.get("/get-user-by-id/:id", getUsersById);
router.put("/update-user/:id", updateUser);

router.delete("/delete-user/:id", deleteUser);

// router.get("/get-page-categories/", getAllCategoriesPagination);


export default router;
