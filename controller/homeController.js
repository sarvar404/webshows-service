import allWebShowRoot from "../model/webShowSchema.js";
import seasonSchema from "../model/webShowSeasonSchema.js";
import episodeSchema from "../model/webShowEpisodesSchema.js";
import movieSchm from "../model/movieSchema.js";
import categorySchema from "../model/categorySchema.js";
import tvChannelSchm from "../model/tvChannelsSchema.js";
import slidSchm from "../model/slideSchema.js";

import axios from "axios";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

export const getBannerHome = async (request, response) => {
  try {
    const details = await slidSchm.find({}, "_id title banner tags");
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const getFeaturedCategories = async (request, response) => {
  try {
    const featuredCategories = await categorySchema.find({ feature: true });

    response.status(200).json({
      success: true,
      message: "successful",
      data: featuredCategories,
    });
  } catch (err) {
    response.status(404).json({ success: false, message: "not found" });
  }
};

export const getCategoriesWithFeaturedById = async (request, response) => {
  try {
    // Fetch records with "id" equal to 2 using the find() method
    const id = request.params.id;
    const details = await categorySchema
      .find({ id, feature: true })
      .sort({ updated_at: -1 });

    // Check if any records were found
    if (details.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No records found with 'id' equal to 2.",
      });
    }

    response.status(200).json({
      success: true,
      message: "Successful",
      data: details,
    });
  } catch (err) {
    response
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const updateFeatureByObjectId = async (request, response) => {
  try {
    const id = request.params.id;

    // Find the document with the given _id and update the "feature" field to false
    const updatedCategory = await categorySchema.findOneAndUpdate(
      { _id: id },
      { $set: { feature: false, position: 0 } },
      { new: true }
    );

    // Check if the document with the given _id was found
    if (!updatedCategory) {
      return response
        .status(404)
        .json({
          success: false,
          message: "No records found with the provided ObjectID.",
        });
    }

    response.status(200).json({
      success: true,
      message: "Successfully updated the 'feature' field to false.",
      data: updatedCategory,
    });
  } catch (err) {
    response
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const setPositionByObjectId = async (request, response) => {
  try {
    const id = request.params.id;
    // console.log(request.body.position);
    // process.exit();

    // Use the "_id" field in the query instead of "id"
    const updatedCategory = await categorySchema.findOneAndUpdate(
      { _id: id },
      { $set: { position: request.body.position } },
      { new: true }
    );

    if (!updatedCategory) {
      return response
        .status(404)
        .json({
          success: false,
          message: "No records found with the provided ObjectID.",
        });
    }

    response.status(200).json({
      success: true,
      message: "Successfully updated the 'position' field.",
      data: updatedCategory,
    });
  } catch (err) {
    response
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getAllTvChannelHomePage = async (request, response) => {
  try {
    const categoryId = request.params.id;

    const details = await tvChannelSchm
      .find({ "categories._id": categoryId })
      .sort({ _id: -1 });

    const filteredData = details.filter((channel) => {
      return channel.categories.some((category) => category._id === categoryId);
    });

    response.status(200).json({
      success: true,
      message: "successful",
      data: filteredData,
    });
  } catch (err) {
    response.status(404).json({ success: false, message: "not found" });
  }
};

export const getAllMoviesHomePage = async (request, response) => {
  try {
    const categoryId = request.params.id;

    const details = await movieSchm
      .find({ "categories._id": categoryId })
      .sort({ _id: -1 });

    const filteredData = details.filter((channel) => {
      return channel.categories.some((category) => category._id === categoryId);
    });

    response.status(200).json({
      success: true,
      message: "successful",
      data: filteredData,
    });
  } catch (err) {
    response.status(404).json({ success: false, message: "not found" });
  }
};

export const getAllWebShowsHomePage = async (request, response) => {
  try {
    const categoryId = request.params.id;

    const details = await allWebShowRoot
      .find({ "categories._id": categoryId })
      .sort({ _id: -1 });

    const filteredData = details.filter((channel) => {
      return channel.categories.some((category) => category._id === categoryId);
    });

    response.status(200).json({
      success: true,
      message: "successful",
      data: filteredData,
    });
  } catch (err) {
    response.status(404).json({ success: false, message: "not found" });
  }
};
