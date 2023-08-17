import allWebShowRoot from "../../model/webShowSchema.js";
import seasonSchema from "../../model/webShowSeasonSchema.js";
import episodeSchema from "../../model/webShowEpisodesSchema.js";

import axios from "axios";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

const downloadImage = async (url, destinationFolder) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const fileData = Buffer.from(response.data, 'binary');

    // Generate a unique filename for the image based on current timestamp in seconds
    const fileName = `${Date.now() / 1000 | 0}${path.extname(url)}`;
    const filePath = path.join(destinationFolder, fileName);

    // Check if the destination folder exists, if not, create it
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    fs.writeFileSync(filePath, fileData);

    // Extract the file name from the file path
    const fileNameOnly = path.basename(filePath);

    return fileNameOnly;
  } catch (error) {
    // console.error('Error downloading image:', error);
    return null;
  }
};

export const insertWebShow = async (request, response, next) => {
  // console.log(request.body)
  // console.log(Object.keys(request.files).length === 0)
  // console.log(request.files["poster"])
  // process.exit();

  try {

    if (!request.body.URLposter && !request.body.URLbanner) {
      const error = new Error("No file provided!");
      error.statusCode = 422;
      error.message = "file not found";
      return next(error);
    }

    const tagsArray = request.body.tags
      ? request.body.tags.split(",")
      : undefined;

    const webSeriesDocument = {
      title: request.body.title,
      description: request.body.description.replace(/['`]/g, ""), // Remove backticks from the description
      year: parseInt(request.body.year),
      trailer: decodeURIComponent(request.body.trailer.replace(/['"]/g, "")), // Remove backticks and single quotes from the trailer and then decode special characters

      categories: JSON.parse(request.body.categories),
      tags: tagsArray,
      actors: request.body.actors ? JSON.parse(request.body.actors) : undefined,
      poster:
        request.files["poster"] === undefined
          ? request.body.URLposter
          : request.files["poster"],
      banner:
        request.files["banner"] === undefined
          ? request.body.URLbanner
          : request.files["banner"],

      rating: parseFloat(request.body.rating),
      enable: request.body.enable === "true" ? true : false,
    };

    // console.log(webSeriesDocument);
    // process.exit();

    const result = new allWebShowRoot(webSeriesDocument);

    const savedWebShow = await result.save();

    response.status(200).json({
      success: true,
      message: "success",
      data: savedWebShow,
    });
  } catch (error) {
    response
      .status(400)
      .json({ success: false, message: error.message + " internal server error" });
  }
};

export const insertImport = async (request, response, next) => {
  // console.log(request.body.data);
  // console.log(request.body.path);
  // process.exit();

  try {

    const destinationFolder = path.join(__dirname, 'public', 'upload', 'url_imgs');
    const importPoster = await downloadImage(`https://image.tmdb.org/t/p/w500${request.body.data.poster_path}`, destinationFolder);
    const importBanner = await downloadImage(`https://image.tmdb.org/t/p/w500${request.body.data.backdrop_path}`, destinationFolder);
    const locationPath = request.body.path;

   

    const genreNames = request.body.data.genres.map((genre) => genre.name);
    const tagsArray = genreNames
      ? genreNames
      : undefined;

    const webSeriesDocument = {
      title: request.body.data.name,
      description: request.body.data.overview.replace(/['`]/g, ""), // Remove backticks from the description
      year: parseInt(request.body.data.first_air_date.substring(0, 4)),
      trailer: request.body.trailer ? decodeURIComponent(request.body.trailer.replace(/['"]/g, "")) : '',

      categories: request.body.categories ? JSON.parse(request.body.categories) : undefined,
      tags: tagsArray,
      actors: request.body.data.actors ? JSON.parse(request.body.data.actors) : undefined,
      poster:
      importPoster === undefined
          ? ''
          : locationPath + importPoster,
      banner:
        importBanner === undefined
          ? ''
          : locationPath + importBanner,

      rating: parseFloat(request.body.data.vote_average),
      enable: true,
    };

    // console.log(webSeriesDocument);
    // process.exit();

    const result = new allWebShowRoot(webSeriesDocument);

    const savedWebShow = await result.save();

    response.status(200).json({
      success: true,
      message: "success",
      data: savedWebShow,
    });
  } catch (error) {
    response
      .status(400)
      .json({ success: false, message: error.message + " internal server error" });
  }
};

export const updateWebShow = async (request, response) => {

  // console.log(request.body);
  // console.log(request.files);
  // console.log(request.params.id)

  // process.exit();

  try {
    const document = await allWebShowRoot.findById(request.params.id);

    // check if the document exists
    if (!document) {
      throw new Error("Invalid Id");
    }

    

    

    const update = {


      $set: {
        title: request.body.title ? request.body.title : undefined,
        description: request.body.description ? request.body.description : undefined,
        year: request.body.year ? request.body.year : undefined,
        trailer: request.body.trailer ? request.body.trailer : undefined,

        categories: request.body.categories ? JSON.parse(request.body.categories) : undefined,
        tags: request.body.tags ? request.body.tags : undefined,
        actors: request.body.actors ? JSON.parse(request.body.actors) : undefined,
        poster: request.files["poster"] === undefined ? request.body.URLposter : request.files["poster"],
      banner: request.files["banner"] === undefined ? request.body.URLbanner : request.files["banner"],

        rating: request.body.rating ? request.body.rating : undefined,
        enable: request.body.enable ? request.body.enable : undefined,
      },
    };

    const updatedEpisode = await allWebShowRoot.findOneAndUpdate(
      { _id: request.params.id },
      update,
      { new: true }
    );
    response.status(200).json({
      success: true,
      message: "successfully updated",
      data: updatedEpisode,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

export const getWebShow = async (request, response) => {
  const id = request.params.id;

  try {
    const details = await allWebShowRoot.findById(id);
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const getAllWebShowsPagination = async (request, response) => {

  try {
    const page = parseInt(request.query.page) || 1; // Current page, default is 1
    const limit = 12; // Number of records per page
    const skip = (page - 1) * limit; // Number of records to skip
    const searchValue = request.query.searchValue || ''; // Search value from the query parameter

    // Create a search filter based on the searchValue
    const searchFilter = { title: { $regex: searchValue, $options: 'i' } };

    

    // Get total count of matching records
    const totalCount = await allWebShowRoot.countDocuments(searchFilter);

    // Get paginated records
    const webShows = await allWebShowRoot.find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);


    const totalPages = Math.ceil(totalCount / limit);

    response.status(200).json({
      success: true,
      message: 'Successful',
      data: webShows,
      totalPages: totalPages,
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }


}


// export const getAllWebShows = async (request, response) => {
//   try {
//     const details = await allWebShowRoot.find().sort({ _id: -1 });

//     response.status(200).json({
//       success: true,
//       message: "successful",
//       data: details,
//     });
//   } catch (err) {
//     response.status(404).json({ success: true, message: "not found" });
//   }
// };

export const deletWebShow = async (request, response) => {
  try {
    const deletedEpisode = await allWebShowRoot.findByIdAndDelete(
      request.params.id
    );
    await seasonSchema.deleteMany({ webshow_id: request.params.id });
    await episodeSchema.deleteMany({ webshow_id: request.params.id });
    response.status(200).json({
      success: true,
      message: "successfully deleted",
      data: deletedEpisode,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};

// to get all show
export const getAllShows = async (request, response) => {
  try {
    // console.log(request.params.id);

    // process.exit();

    const details = await allWebShowRoot.aggregate([
      {
        $lookup: {
          from: "all_webshow_seasons_01",
          localField: "_id",
          foreignField: "webshow_id",
          as: "all_webshow_seasons_01",
        },
      },
      {
        $lookup: {
          from: "all_webshow_episodes_sr01",
          localField: "_id",
          foreignField: "webshow_id",
          as: "all_webshow_episodes_sr01",
        },
      },
    ]);

    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: false, message: "not found" });
  }
};

// to get all show
export const getAllShowsById = async (request, response) => {
  try {
    const details = await allWebShowRoot.find();
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: true, message: "not found" });
  }
};


export const getAllWeb = async (request, response) => {
  try {
    const details = await allWebShowRoot.find();
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: true, message: "not found" });
  }
};