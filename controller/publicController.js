import mongoose from 'mongoose';
import movieSchm from "../model/movieSchema.js";
import allWebShowRoot from "../model/webShowSchema.js";
import seasonSchema from "../model/webShowSeasonSchema.js";
import episodeSchema from "../model/webShowEpisodesSchema.js";
import categorySchema from "../model/categorySchema.js";
import tvChannelSchm from "../model/tvChannelsSchema.js";
import slidSchm from "../model/slideSchema.js";
import vidoeProgressSchema from "../model/videoProgressSchema.js"

import credentialInfo from "../model/credentialInfo.js";

import { v4 as uuidv4 } from "uuid";
import { setUser } from "../service/auth.js";

export const getPublicMoviesByCategory = async (request, response) => {
  try {
    const { category, page, limit, order } = request.query;

    // Assuming you have a mongoose model named `Movie` defined using `movieSchm`
    const moviesPerPage = parseInt(limit) || 10; // Number of records per page
    const pageNumber = parseInt(page) || 1; // Page number
    const skipCount = (pageNumber - 1) * moviesPerPage;

    const query = {
      "categories.name": category, // Assuming "categories" is the array of categories in your schema
    };

    let sortCriteria = { title: 1 }; // Default sorting by title in ascending order

    if (order === "latest_order") {
      sortCriteria = { updated_at: -1, title: 1 }; // Sort by latest order (descending), then by title (ascending)
    } else if (order === "recent_order") {
      sortCriteria = { updated_at: 1, title: -1 }; // Sort by recent order (ascending), then by title (descending)
    }

    // Query to find movies by category with pagination and sorting
    const movies = await movieSchm
      .find(query)
      .sort(sortCriteria)
      .skip(skipCount)
      .limit(moviesPerPage)
      .exec();

    // Count the total number of records for pagination
    const totalCount = await movieSchm.countDocuments(query);

    const totalPages = Math.ceil(totalCount / moviesPerPage);

    response.status(200).json({
      success: true,
      message: "Successful",
      movies,
      currentPage: pageNumber,
      totalPages,
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getPublicMovieDetails = async (request, response) => {
  try {
    const { _id } = request.query;
    if (!_id) {
      response
        .status(400)
        .json({ success: false, message: "Missing _id parameter" });
      return;
    }
    const details = await movieSchm.findById(_id);
    if (!details) {
      response.status(404).json({ success: false, message: "Movie not found" });
      return;
    }

    response.status(200).json({
      success: true,
      message: "Successful",
      data: details,
    });
  } catch (err) {
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getPublicWebShowsByCategory = async (request, response) => {
  console.log("called");
  try {
    const { category, page, limit, order } = request.query;

    // Assuming you have a mongoose model named `Movie` defined using `allWebShowRoot`
    const webshowsPerPage = parseInt(limit) || 10; // Number of records per page
    const pageNumber = parseInt(page) || 1; // Page number
    const skipCount = (pageNumber - 1) * webshowsPerPage;

    const query = {
      "categories.name": category, // Assuming "categories" is the array of categories in your schema
    };

    let sortCriteria = { title: 1 }; // Default sorting by title in ascending order

    if (order === "latest_order") {
      sortCriteria = { updated_at: -1, title: 1 }; // Sort by latest order (descending), then by title (ascending)
    } else if (order === "recent_order") {
      sortCriteria = { updated_at: 1, title: -1 }; // Sort by recent order (ascending), then by title (descending)
    }

    // Query to find movies by category with pagination and sorting
    const webshows = await allWebShowRoot
      .find(query)
      .sort(sortCriteria)
      .skip(skipCount)
      .limit(webshowsPerPage)
      .exec();

    // Count the total number of records for pagination
    const totalCount = await allWebShowRoot.countDocuments(query);

    const totalPages = Math.ceil(totalCount / webshowsPerPage);

    response.status(200).json({
      success: true,
      message: "Successful",
      webshows,
      currentPage: pageNumber,
      totalPages,
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getPublicWebshowDetails = async (request, response) => {
  try {
    const { _id } = request.query;
    if (!_id) {
      response
        .status(400)
        .json({ success: false, message: "Missing _id parameter" });
      return;
    }
    const details = await allWebShowRoot.findById(_id);
    if (!details) {
      response
        .status(404)
        .json({ success: false, message: "Web Show not found" });
      return;
    }

    response.status(200).json({
      success: true,
      message: "Successful",
      data: details,
    });
  } catch (err) {
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getPublicCategories = async (request, response) => {
  try {
    const { type } = request.query;
    const query = type ? { type } : {};

    const details = await categorySchema.find(query);

    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: false, message: "not found" });
  }
};

export const regsiteration = async (request, response) => {
  try {
    const { email, password } = request.body;
    const savedSuccess = await credentialInfo.create({
      email: email,
      password: password,
    });

    response.status(200).json({
      success: true,
      message: "success",
      data: savedSuccess,
    });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

export const login = async (request, response) => {
  try {
    const { email, password, role } = request.body;

    const details = await credentialInfo.findOne({ email, password, role });
    if (!details) {
      throw new Error("Invalid user & password");
    }

    const token = setUser(details);
    // response.cookie("uid", token);
    response.cookie("token", token);
    response.json({
      success: true,
      message: "Login Success",
      // token: token, // Include the token in the response if needed
    });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

export const getSources = async (request, response) => {

  // console.log(request.query);
  // process.exit();
  try {
    const { _id, type } = request.query;

    if (!["movie", "episode"].includes(type)) {
      response
        .status(400)
        .json({ success: false, message: "Invalid type parameter" });
      return;
    }

    let details;

    if (_id === "0") {
      // Fetch all records with selective fields
      if (type === "movie") {
        details = await movieSchm.find().select("title sourceUrl_language_files");
      } else if (type === "episode") {
        details = await episodeSchema.find().select("title sourceUrl_language_files");
      }
    } else {
      // Fetch a specific record
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        response
          .status(400)
          .json({ success: false, message: "Invalid _id parameter" });
        return;
      }

      if (type === "movie") {
        details = await movieSchm.findById(_id).select("title sourceUrl_language_files");
      } else if (type === "episode") {
        details = await episodeSchema.findById(_id).select("title sourceUrl_language_files");
      }
      
      if (!details) {
        response
          .status(404)
          .json({ success: false, message: `${type.capitalize()} not found` });
        return;
      }
    }

    response.status(200).json({
      success: true,
      message: "Successful",
      data: details,
    });
  } catch (err) {
    console.error("Error:", err);
    response.status(500).json({ success: false, message: "Internal server error" });
  }
  
};


export const getTotalLiveTv = async (request, response) => {
  try {
    // Fetch records with categories not equal to "Sports"
    const records = await tvChannelSchm.find({
      'categories.name': { $ne: 'Sports' }
    });

    // Get the count of records
    const count = records.length;

    response.status(200).json({
      success: true,
      message: "Successful",
      count: count
    });
  } catch (err) {
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getTotalSportTv = async (request, response) => {
  try {
    // Fetch records with categories containing the name "Sports"
    const recordsCount = await tvChannelSchm.countDocuments({
      'categories.name': 'Sports'
    });

    response.status(200).json({
      success: true,
      message: "Successful",
      count: recordsCount
    });
  } catch (err) {
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

