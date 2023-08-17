import episodeSchema from "../model/webShowEpisodesSchema.js";
import seasonSchema from "../model/webShowSeasonSchema.js";
import webShowSchema from "../model/webShowSchema.js";

// fetch web id & name

export const webId = async (request, response) => {
  try {
    const details = await webShowSchema.find({}, "_id title");
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: false, message: "not found" });
  }
};

export const seasonId = async (request, response) => {
  try {
    const details = await seasonSchema.find({}, "_id season_number");
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: false, message: "not found" });
  }
};

export const seasonByWebId = async (request, response) => {
  const id = request.params.id;
  
  try {
    const details = await seasonSchema.find({ webshow_id: id }, "_id season_number");
    if (details) {
      
      response.status(200).json({
        success: true,
        message: "successful",
        data: details,
      });
    } else {
      response.status(404).json({
        success: false,
        message: "Season not found",
      });
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

