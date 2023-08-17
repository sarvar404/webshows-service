import seasonSchema from "../../model/webShowSeasonSchema.js";
import episodeSchema from "../../model/webShowEpisodesSchema.js";

import fetch from "node-fetch";

import axios from "axios";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid'; 

const __dirname = path.resolve();
const destinationFolder = path.join(__dirname, 'public', 'upload', 'url_imgs');
const downloadImage = async (url, destinationFolder) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const fileData = Buffer.from(response.data, "binary");

    // Generate a unique identifier for the image
    const uniqueId = uuidv4();

    // Extract the file extension from the URL
    const fileExtension = path.extname(url);

    // Construct the filename using the unique identifier and the current timestamp in seconds
    const fileName = `${uniqueId}_${(Date.now() / 1000) | 0}${fileExtension}`;
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

const getLastSeasonId = async (titleId) => {
  try {
    const details = await webShowSchm.findById(titleId);
    if (!details) {
      throw new Error("Season not found");
    }

    return details.seasons.season_number + 1;
  } catch (err) {
    console.error(err);
    return 1;
  }
};
const getLastEpisodeId = async (titleId) => {
  try {
    const details = await webShowSchm.findById(titleId);
    if (!details) {
      throw new Error("Episode not found");
    }

    // const lastSeason = title.seasons.length > 0 ? details.seasons.episodes[details.seasons.episodes.length - 1] : null;

    console.log(Object.entries(details.seasons.episodes));

    // const lastSeason = details?.seasons?.episodes?.episode_number > 0 ? ails.seasons.episodes.episode_number : 0;
    // const lastSeasonNumber = lastSeason ? lastSeason : 0;
    // return lastSeasonNumber + 1;

    // return details.seasons.episodes.episode_number + 1;
  } catch (err) {
    console.error(err);
    return 1;
  }
};

// adding a date here
const dt = new Date();
const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
const customeDate = `${padL(dt.getMonth() + 1)}/${padL(
  dt.getDate()
)}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(
  dt.getSeconds()
)}`;

function isFileEmpty(file) {
  return new Promise((resolve, reject) => {
    fs.stat(file.path, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.size === 0) {
        reject(new Error("File is empty."));
      } else {
        resolve(true);
      }
    });
  });
}

// Function to import a season and its episodes
async function importSeasonAndEpisodes(requestedSeasonData, webShowId,tvId, locationPath) {
  // console.log("called")
  // console.log(requestedSeasonData)
  // console.log(webShowId)
  // console.log(locationPath)

  
  
  const importBanner = await downloadImage(
    `https://image.tmdb.org/t/p/w500${requestedSeasonData.backdrop_path}`,
    destinationFolder
  );

  let seasonNumber = 1;
  let seasonsImported = [];

  for (const seasonData of requestedSeasonData.seasons) {

    

    if (seasonData.name === 'Specials') {
      continue; // Skip 'Specials' season
    }
    
      const importPoster = await downloadImage(
        `https://image.tmdb.org/t/p/w500${seasonData.poster_path}`,
        destinationFolder
      );

      const webSeriesDocument = {
        webshow_id: webShowId,
        season_number: seasonNumber,
        title: seasonData.name,
        description: seasonData.overview,
        year: parseInt(seasonData.air_date.substring(0, 4)),
        trailer: "",
        poster: importPoster === undefined || importPoster == null ? "" : locationPath + importPoster,
        banner: importBanner === undefined || importBanner == null ? "" : locationPath + importBanner,
        rating: seasonData.vote_average,
        created_at: customeDate,
        updated_at: customeDate,
        enable: true,
      };

      

      const season = new seasonSchema(webSeriesDocument);
      const seasonSaved = await season.save();
      seasonsImported.push(seasonSaved);

      if (seasonSaved.enable === true) {
        // console.log(seasonData)
        await importEpisodes(seasonSaved._id, tvId, seasonSaved.webshow_id,seasonSaved.season_number, importPoster, locationPath);
      }

      seasonNumber ++;
   

    

  }

  return seasonsImported;
}

// Function to import episodes for a given season
async function importEpisodes(savedSeasonId , tvId, webshowId,seasonNumber, importPoster, locationPath) {
  // console.log(tvId + ">>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<" + seasonNumber)
  const episodeUrl = `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDc1YTcyNjY0NmM3NWI2OTljNjZmYzZmM2MwZGY5ZSIsInN1YiI6IjY0YjY1Yjk5ZTBjYTdmMDBjOGNmY2ViZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BC5lhKXIIdGdMpywJ26jNyFuq-PTSY5R7PZiHr-PSBc", // Replace with your access token
    },
  };
  const episodeResponse = await fetch(episodeUrl, options);
  const episodeData = await episodeResponse.json();
  
  if (episodeData && episodeData.episodes && episodeData.episodes.length > 0) {
    let episodeNumber = 1;
    for (const episode of episodeData.episodes) {

      const importBanner = await downloadImage(
        `https://image.tmdb.org/t/p/w500${episode.still_path}`,
        destinationFolder
      );

      const episdoeDocument = {
        webshow_id: webshowId,
        season_id: savedSeasonId,
        episode_number: episodeNumber,
        title: episode.name != null ? episode.name : "",
        description: episode.overview ? episode.overview : "",
        year: episode.air_date ? parseInt(episode.air_date.substring(0, 4)) : 0,
        trailer: "",
        duration: episode.runtime ? episode.runtime : 0,
        rating: episode.vote_average ? episode.vote_average : 0,
        poster: importPoster === undefined || importPoster == null ? "" : locationPath + importPoster,
        banner: importBanner === undefined || importBanner == null ? "" : locationPath + importBanner,
        sourceUrl_language_files: [],
        subtitles_language_files: [],
        created_at: customeDate,
        updated_at: customeDate,
        enable: true,
      };

      

      if (episdoeDocument) {
        // console.log(episdoeDocument)
        // console.log("================================================")
        const importedEpisode = new episodeSchema(episdoeDocument);
        await importedEpisode.save();
      }

      episodeNumber++;
    }
  }
}

export const insertImportSeason = async (request, response, next) => {
  try {
    const locationPath = request.body.path;
    const seasonsImported = await importSeasonAndEpisodes(
      request.body.data,
      request.body.webShowId,
      request.body.tvId,
      locationPath
    );

    response.status(200).json({
      success: true,
      message: "Seasons and episodes imported successfully",
      data: seasonsImported,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

export const insertSeasonForWebShow = async (request, response, next) => {
  // console.log(request.query.id)
  // console.log(request.body);
  // console.log(request.files);
  // process.exit();

  try {
    if (!request.body.URLposter && !request.body.URLbanner) {
      const error = new Error("No file provided!");
      error.statusCode = 422;
      error.message = "file not found";
      return next(error);
    }

    const webSeriesDocument = {
      webshow_id: request.body.webshow_id,
      season_number: request.body.season_number,
      title: request.body.title,
      description: request.body.description,
      year: request.body.year,
      trailer: request.body.trailer,

      poster:
        request.files["poster"] === undefined
          ? request.body.URLposter
          : request.files["poster"],
      banner:
        request.files["banner"] === undefined
          ? request.body.URLbanner
          : request.files["banner"],
      rating: request.body.rating,
      created_at: customeDate,
      updated_at: customeDate,
      enable: request.body.enable,
    };
    const season = new seasonSchema(webSeriesDocument);

    const seasonSaved = await season.save();

    response.status(200).json({
      success: true,
      message: "success",
      data: seasonSaved,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

export const updateSeason = async (request, response) => {
  // console.log(request.params.id)
  // console.log(request.body);
  // console.log(request.files);
  // process.exit();

  try {
    const document = await seasonSchema.findById(request.params.id);

    // check if the document exists
    if (!document) {
      throw new Error("Invalid Id");
    }

    const update = {
      $set: {
        webshow_id: request.body.webshow_id,
        season_number: request.body.season_number,
        title: request.body.title,
        description: request.body.description,
        year: request.body.year,
        trailer: request.body.trailer,

        poster:
          request.files["poster"] === undefined
            ? request.body.URLposter
            : request.files["poster"],
        banner:
          request.files["banner"] === undefined
            ? request.body.URLbanner
            : request.files["banner"],
        rating: request.body.rating,
        created_at: customeDate,
        updated_at: customeDate,
        enable: request.body.enable,
      },
    };

    const updatedEpisode = await seasonSchema.findOneAndUpdate(
      { _id: request.params.id },
      update,
      { new: true, upsert: false }
    );
    response.status(200).json({
      success: true,
      message: "successfully updated",
      data: updatedEpisode,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};

export const getSeason = async (request, response) => {
  const id = request.params.id;

  try {
    const details = await seasonSchema.findById(id);
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const getSeasonsByWebShowId = async (request, response) => {
  const webshowId = request.params.id;

  try {
    const details = await seasonSchema.find({ webshow_id: webshowId });
    if (details.length > 0) {
      response.status(200).json({
        success: true,
        message: "Records found",
        data: details,
      });
    } else {
      response.status(404).json({
        success: false,
        message: "Records not found",
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

export const getSeasonById = async (request, response) => {
  const id = request.params.id;

  try {
    const details = await seasonSchema.find({ _id: id }); // Constructing a filter object with the id
    if (details.length > 0) {
      response.status(200).json({
        success: true,
        message: "Records found",
        data: details,
      });
    } else {
      response.status(404).json({
        success: false,
        message: "Records not found",
      });
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllSeason = async (request, response) => {
  try {
    const details = await seasonSchema.find().sort({ _id: -1 });
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const deletSeason = async (request, response) => {
  try {
    const deletedSeasons = await seasonSchema.findByIdAndDelete(
      request.params.id
    );
    await episodeSchema.deleteMany({ season_id: request.params.id });
    response.status(200).json({
      success: true,
      message: "successfully deleted",
      data: deletedSeasons,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};
