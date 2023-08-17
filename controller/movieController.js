import axios from "axios";
import https from "https";
import movieSchm from "../model/movieSchema.js";
import allWebShowRoot from "../model/webShowSchema.js";
import seasonSchema from "../model/webShowSeasonSchema.js";
import episodeSchema from "../model/webShowEpisodesSchema.js";
import actorsSchm from "../model/actorsSchema.js";
import movieSelectedActorsSchema from "../model/movieSelectedActorsSchema.js";
import tvChannelSchm from "../model/tvChannelsSchema.js";
import categorySchema from "../model/categorySchema.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

const downloadImage = async (url, destinationFolder) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const fileData = Buffer.from(response.data, "binary");

    // Generate a unique filename for the image based on current timestamp in seconds
    const fileName = `${(Date.now() / 1000) | 0}${path.extname(url)}`;
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

const dt = new Date();
const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
const customeDate = `${padL(dt.getMonth() + 1)}/${padL(
  dt.getDate()
)}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(
  dt.getSeconds()
)}`;

export const getMovie = async (request, response) => {
  const id = request.params.id;

  try {
    const details = await movieSchm.findById(id);
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const getAllMoviesPagination = async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1; // Current page, default is 1
    const limit = 12; // Number of records per page
    const skip = (page - 1) * limit; // Number of records to skip
    const searchValue = request.query.searchValue || ""; // Search value from the query parameter

    // Create a search filter based on the searchValue
    const searchFilter = { title: { $regex: searchValue, $options: "i" } };

    // Get total count of matching records
    const totalCount = await movieSchm.countDocuments(searchFilter);

    // Get paginated records
    const moviePagination = await movieSchm
      .find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    response.status(200).json({
      success: true,
      message: "Successful",
      data: moviePagination,
      totalPages: totalPages,
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getAllMovies = async (request, response) => {
  try {
    const details = await movieSchm.find();
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const insertImportMovie = async (request, response, next) => {
  // console.log(request.body.data);
  // console.log(request.body.path);
  // process.exit();

  try {
    const destinationFolder = path.join(
      __dirname,
      "public",
      "upload",
      "url_imgs"
    );
    const importPoster = await downloadImage(
      `https://image.tmdb.org/t/p/w500${request.body.data.poster_path}`,
      destinationFolder
    );
    const importBanner = await downloadImage(
      `https://image.tmdb.org/t/p/w500${request.body.data.backdrop_path}`,
      destinationFolder
    );
    const locationPath = request.body.path;

    const genreNames = request.body.data.genres.map((genre) => genre.name);
    const tagsArray = genreNames ? genreNames : undefined;

    const upcomingData = new movieSchm({
      title: request.body.data.title,

      description: request.body.data.overview,
      year: parseInt(request.body.data.release_date.substring(0, 4)),
      classification: "",
      rating: request.body.data.vote_average,
      sub_lable: "",
      duration: request.body.data.runtime,

      enable_comments: true,

      sourceUrl_language_files: [],
      subtitles_language_files: [],

      categories: [],
      tags: tagsArray,
      poster: importPoster === undefined ? "" : locationPath + importPoster,
      banner: importBanner === undefined ? "" : locationPath + importBanner,
    });

    // console.log(upcomingData);
    // process.exit();

    const savingUpcomingData = await upcomingData.save();

    response.status(200).json({
      success: true,
      message: "success",
      data: savingUpcomingData,
    });
  } catch (error) {
    response
      .status(400)
      .json({ success: false, message: error + " internal server error" });
  }
};

export const insertMovie = async (request, response, next) => {
  // console.log(request.body);
  // console.log(request.files);

  // process.exit();

  try {
    // some intialized objects

    const subtitles_language_files = new Object();
    const sourceUrl_language_files = new Object();

    // assigning files name here

    const files = request.files;
    const namedFiles = {};

    const srtFile = request.files.filter((file) =>
      file.originalname.endsWith(".srt")
    );

    const mp4Files = request.files.filter((file) =>
      file.originalname.endsWith(".mp4")
    );

    const jpegFiles = request.files.filter((file) =>
      file.originalname.endsWith(".jpeg")
    );

    const jpgFiles = request.files.filter((file) =>
      file.originalname.endsWith(".jpg")
    );

    if (
      !srtFile.length &&
      !mp4Files.length &&
      !jpegFiles.length &&
      !jpgFiles.length
    ) {
      const error = new Error("No file provided!");
      error.statusCode = 422;
      error = "Unknown file format";
      return next(error);
    }

    // this loop will assign name to poster and banner

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fieldName = file.fieldname;

      namedFiles[fieldName] = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        destination: file.destination,
        filename: file.filename,
        path: file.path,
        size: file.size,
      };
    }

    const srtFiles = request.files.filter((file) =>
      file.originalname.endsWith(".srt")
    );
    const totalsrt = srtFiles.length;

    if (totalsrt > 0) {
      for (let index = 0; index < totalsrt; index++) {
        subtitles_language_files[request.body[`lang${index}`]] =
          srtFiles[index];
      }
    }

    // const vidFiles = request.files.filter((file) =>
    //   file.originalname.endsWith(".mp4")
    // );

    const data = request.body;

    let sourceFileCount = 0;

    for (const key in data) {
      if (key.startsWith("source_url")) {
        sourceFileCount++;
      }
    }

    // console.log("File count:", sourceFileCount);
    // process.exit();

    if (sourceFileCount > 0) {
      for (let index = 0; index < sourceFileCount; index++) {
        sourceUrl_language_files[request.body[`language${index}`]] =
          request.body[`source_url${index}`];
        // console.log(subtitles_language_files, "here subtitle");
      }
    }

    // console.log(sourceUrl_language_files, "here source url");
    // console.log(subtitles_language_files, "here subtitle");
    // process.exit();

    const tagsArray = request.body.tags
      ? request.body.tags.split(",")
      : undefined;

    const upcomingData = new movieSchm({
      title: request.body.title,

      description: request.body.description,
      year: request.body.year,
      classification: request.body.classification,
      rating: request.body.rating,
      sub_lable: request.body.sub_lable,
      duration: request.body.duration,

      enable_comments: request.body.enable_comments == "true" ? true : false,

      sourceUrl_language_files: sourceUrl_language_files,
      subtitles_language_files: subtitles_language_files,

      categories: JSON.parse(request.body.categories),
      tags: tagsArray,

      poster:
        namedFiles.poster === undefined
          ? request.body.URLposter
          : namedFiles.poster,
      banner:
        namedFiles.banner === undefined
          ? request.body.URLbanner
          : namedFiles.banner,

      // poster: namedFiles.poster ? namedFiles.poster : undefined,
      // banner: namedFiles.banner ? namedFiles.banner : undefined,
    });

    // console.log(upcomingData);
    // process.exit();

    const savingUpcomingData = await upcomingData.save();

    response.status(200).json({
      success: true,
      message: "success",
      data: savingUpcomingData,
    });
  } catch (error) {
    response.status(400).json({
      message: error.message, //,
    });
  }
};

export const updateMovie = async (request, response) => {
  // console.log(request.body);
  // console.log(request.files);

  // process.exit();

  try {
    const document = await movieSchm.findById(request.params.id);

    // some intialized objects

    const subtitles_language_files = new Object();
    const sourceUrl_language_files = new Object();

    // assigning files name here

    const files = request.files;
    const namedFiles = {};

    // check if the document exists
    if (!document) {
      throw new Error("Invalid Id");
    }

    if (Object.values(request.files).length !== 0) {
      const files = Array.from(request.files);

      const srtFiles = files.filter((file) => file.filename.endsWith(".srt"));
      const mp4Files = files.filter((file) => file.filename.endsWith(".mp4"));
      const jpegFiles = files.filter((file) => file.filename.endsWith(".jpeg"));
      const jpgFiles = files.filter((file) => file.filename.endsWith(".jpg"));

      // Check if any of the required file formats are present
      if (
        srtFiles.length === 0 &&
        mp4Files.length === 0 &&
        jpegFiles.length === 0 &&
        jpgFiles.length === 0
      ) {
        const error = new Error("No file provided!");
        error.statusCode = 422;
        error = "Unknown file format";

        return next(error);
      }
    }

    // console.log(request.body);
    // console.log(request.files);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fieldName = file.fieldname;

      namedFiles[fieldName] = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        destination: file.destination,
        filename: file.filename,
        path: file.path,
        size: file.size,
      };
    }

    const srtFiles = request.files.filter((file) =>
      file.originalname.endsWith(".srt")
    );
    const totalsrt = srtFiles.length;

    if (totalsrt > 0) {
      for (let index = 0; index < totalsrt; index++) {
        subtitles_language_files[request.body[`lang${index}`]] =
          srtFiles[index];
      }
    }

    const data = request.body;

    let subtitleFileCount = 0;

    for (const key in data) {
      if (key.startsWith("g_subtitle")) {
        subtitleFileCount++;
      }
    }

    if (subtitleFileCount > 0) {
      for (let index = 0; index < subtitleFileCount; index++) {
        subtitles_language_files[request.body[`g_lang${index}`]] =
          request.body[`g_subtitle${index}`];
      }
    }
    // ================================================================

    let sourceFileCount = 0;

    for (const key in data) {
      if (key.startsWith("source_url")) {
        sourceFileCount++;
      }
    }

    sourceUrl_language_files[request.body[`language0`]] =
      request.body[`source_url0`];

    // console.log(sourceUrl_language_files, "here source url");
    // console.log(subtitles_language_files, "here subtitle");
    // process.exit();

    const tagsArray = request.body.tags
      ? request.body.tags.split(",")
      : undefined;

    const update = {
      $set: {
        title: request.body.title,

        description: request.body.description,
        year: request.body.year,

        rating: request.body.rating,

        duration: request.body.duration,

        enable_comments: request.body.enable_comments == "true" ? true : false,

        categories: JSON.parse(request.body.categories),
        tags: tagsArray,

        sourceUrl_language_files: sourceUrl_language_files,
        subtitles_language_files: subtitles_language_files,

        poster: namedFiles.poster ? namedFiles.poster : undefined,
        banner: namedFiles.banner ? namedFiles.banner : undefined,
      },

      // $push: {
      //   sourceUrl_language_files: sourceUrl_language_files,
      //   subtitles_language_files: subtitles_language_files,
      // },
    };

    // console.log(update)
    // process.exit();

    const updatedMovie = await movieSchm.findOneAndUpdate(
      { _id: request.params.id },
      update,
      { new: true, upsert: false }
    );

    if (!updatedMovie) {
      throw new Error("Episode not found");
    }

    response.status(200).json({
      success: true,
      message: "successfully updated",
      data: updatedMovie,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};

export const deletMovie = async (request, response) => {
  try {
    const deletedMovie = await movieSchm.findByIdAndDelete(request.params.id);
    response.status(200).json({
      success: true,
      message: "successfully deleted",
      data: deletedMovie,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};

// export const deleteGenerated = async (request, response) => {
//   const id = request.query.id;
//   const index = request.query.index;
//   const language = request.query.language;
//   const field = request.query.field;

//   console.log(request.query)
//   process.exit();

//   try {
//     const updatedMovie = await movieSchm.findByIdAndUpdate(
//       { _id: id },
//       { $unset: { [`${field}.${index}.${language}`]: 1 } },
//       { new: true }
//     ).lean(); // Use the lean() method to return plain JavaScript objects instead of Mongoose documents

//     if (!updatedMovie) {
//       return response.status(404).json({
//         success: false,
//         message: "Record not found",
//       });
//     }

//     response.status(200).json({
//       success: true,
//       message: "Successfully deleted",
//       data: updatedMovie,
//     });
//   } catch (error) {
//     response.status(400).json({ success: false, message: error });
//   }
// };

export const deleteGenerated = async (request, response) => {
  const id = request.query.id;
  const language = request.query.language;
  const field = request.query.field;

  try {
    const updateQuery = {
      $unset: {
        [`${field}.$[].${language}`]: "",
      },
    };

    const updatedMovie = await movieSchm.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    response.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: updatedMovie,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

// we made this for fetching records through apis...

// Function to extract domain up to top-level domain
function extractDomain(url) {
  const regex = /^(https?:\/\/(?:[\w-]+\.)*[\w-]+)\.\w+\/.*$/i;
  const match = url.match(regex);
  return match ? match[1] : url;
}
const convertTrailerFormat = (trailerUrl) => {
  // You can replace "English" with the desired language if you have that information available
  return [{ English: trailerUrl }];
};
const extractTagsFromGenres = (genres) => {
  return genres.map((genre) => genre.title);
};
//-- tv channel with categories
const updateTvChannelCategories = async (idi, lastId, categoryNames) => {
    try {
      const updatedCategories = categoryNames.map((name, index) => ({
        _id: idi[index],
        name: name,
      }));
  
      const updatedTvChannel = await tvChannelSchm.findOneAndUpdate(
        { _id: lastId },
        { $set: { categories: updatedCategories } },
        { new: true }
      );
  
      if (!updatedTvChannel) {
        console.log("TV channel record not found.");
        return null;
      }
  
      return updatedTvChannel;
    } catch (error) {
      console.error("Error while updating TV channel categories:", error);
      throw error; // Rethrow the error to propagate it
    }
  };
  
  const updateOrCreateCategory = async (id, categoryName, lastId) => {
    try {
      const existingRecord = await categorySchema.findOne({
        name: categoryName,
      });
  
      if (existingRecord) {
        return existingRecord._id;
      } else {
        const newCategory = new categorySchema({
          oldId: id,
          name: categoryName,
          type: "TV CHANNEL",
          enable: true,
          feature: false,
          position: 0,
          id: 1,
        });
  
        const savedCategory = await newCategory.save();
        return savedCategory._id;
      }
    } catch (error) {
      console.error("Error while updating or creating category:", error);
      throw error;
    }
  };
  
  const categories1 = async (lastId, id, categoryNames) => {
    try {
      const lastIdStored = [];
      const idi = [];
  
      for (const categoryName of categoryNames) {
        const categoryId = await updateOrCreateCategory(id, categoryName, lastId);
        idi.push(categoryId);
      }
  
      if (idi.length > 0) {
        await updateTvChannelCategories(idi, lastId, categoryNames);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  
  
  
  export const collectDataThroughApi = async (request, response) => {
    try {
      const apiUrl = `https://admin.dashmoonmx.com/api/first/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  
      const apiResponse = await axios.get(apiUrl);
  
      const responseData = apiResponse.data.channels;
  
      
  
      for (const record of responseData) {
        const {
          id,
          title,
          label,
          sublabel,
          description,
          website,
          classification,
          views,
          shares,
          rating,
          playas,
          comment,
          image,
          sources,
          categories,
        } = record;
  
        // Extract the source URLs directly
        const source_url = sources.map((source) => source.url);
  
        
        const category = extractTagsFromGenres(categories);
  
        const combinedSourceUrl = source_url.join(', ');
  
        
  
        const tvChannelDocument = {
          oldId: id,
          name: title,
          source_url : combinedSourceUrl,
          rating : rating,
          enable: true,
          poster: image,
          banner: image,
        };
        
        const insertedRecord = await tvChannelSchm.create(tvChannelDocument);
        categories1(insertedRecord._id, id, category);
  
        // process.exit();
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  };
