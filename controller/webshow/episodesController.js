import episodeSchema from "../../model/webShowEpisodesSchema.js";

// adding a date here
const dt = new Date();
const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
const customeDate = `${padL(dt.getMonth() + 1)}/${padL(
  dt.getDate()
)}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(
  dt.getSeconds()
)}`;

export const insertEpisodesForSeasons = async (request, response, next) => {
  // console.log(request.body);
  // console.log(request.files);
  // console.log("insert");
  // process.exit();

  try {
    const totalFiles = request.files.map((file) => file.fieldname);

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
      error.message = "Unknown file format";
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
    // const totalmp4 = vidFiles.length;

    // if (totalmp4 > 0) {
    //   for (let index = 0; index < totalmp4; index++) {
    //     sourceUrl_language_files[request.body[`language${index}`]] =
    //       vidFiles[index];
    //   }
    // }

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

    const webSeriesDocument = {
      webshow_id: request.body.webshow_id,
      season_id: request.body.season_id,

      episode_number: request.body.episode_number,
      title: request.body.title,
      description: request.body.description,
      year: request.body.year,
      trailer: request.body.trailer,
      duration: request.body.duration,
      rating: request.body.rating,
      poster: namedFiles.poster ? namedFiles.poster : undefined,
      banner: namedFiles.banner ? namedFiles.banner : undefined,

      sourceUrl_language_files: sourceUrl_language_files,
      subtitles_language_files: subtitles_language_files,

      created_at: customeDate,
      updated_at: customeDate,
      enable: request.body.enable,
    };

    // console.log("response")

    const episode = new episodeSchema(webSeriesDocument);

    const episodeSaved = await episode.save();

    response.status(200).json({
      success: true,
      message: "success",
      data: episodeSaved,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

export const updateEpisodesForSeasons = async (request, response, next) => {
  // console.log(request.body);
  // console.log(request.files);
  // console.log(request.params.id);
  // console.log("updated");
  // process.exit();

  try {
    const document = await episodeSchema.findById(request.params.id);

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
        error.message = "Unknown file format";

        return next(error);
      }
    }

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
    // console.log(namedFiles, "namedFiles")
    // process.exit();

    const webSeriesDocument = {
      $set: {
        webshow_id: request.body.webshow_id,
        season_id: request.body.season_id,

        episode_number: request.body.episode_number,
        title: request.body.title,
        description: request.body.description,
        year: request.body.year,
        trailer: request.body.trailer,
        duration: request.body.duration,
        rating: request.body.rating,

        sourceUrl_language_files: sourceUrl_language_files,
        subtitles_language_files: subtitles_language_files,

        poster: namedFiles.poster ? namedFiles.poster : undefined,
        banner: namedFiles.banner ? namedFiles.banner : undefined,

        created_at: customeDate,
        updated_at: customeDate,
        enable: request.body.enable,
      },

      // $push : {
      //   sourceUrl_language_files: sourceUrl_language_files ? sourceUrl_language_files : undefined,
      //   subtitles_language_files: subtitles_language_files ? subtitles_language_files : undefined,
      // }
    };

    // console.log(request.params.id, "update Id")
    // console.log(webSeriesDocument)
    // process.exit();

    const episode = await episodeSchema.findOneAndUpdate(
      { _id: request.params.id },
      webSeriesDocument,
      { new: true, upsert: false }
    );

    if (!episode) {
      throw new Error("Episode not found");
    }

    response.status(200).json({
      success: true,
      message: "successfully updated",
      data: episode,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

export const getEpisode = async (request, response) => {
  const id = request.params.id;

  try {
    const details = await episodeSchema.findById(id);
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const getEpisodeById = async (request, response) => {
  const id = request.params.id;

  // console.log(id)

  try {
    const details = await episodeSchema.find({ _id: id }); // Constructing a filter object with the id
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
      message: "Internal server error........",
      error: error,
    });
  }
};

export const getEpisodesBySeasonId = async (request, response) => {
  const seasonId = request.params.id;
  // console.log(seasonId);
  // process.exit();
  try {
    const details = await episodeSchema.find({ season_id: seasonId });
    // console.log(details.length)
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
      message: "Internal server error...",
      error: error.message,
    });
  }
};

export const getAllEpisodes = async (request, response) => {
  try {
    const details = await episodeSchema.find();
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const deletEpisode = async (request, response) => {
  try {
    const deletedEpisode = await episodeSchema.findByIdAndDelete(
      request.params.id
    );
    response.status(200).json({
      success: true,
      message: "successfully deleted",
      data: deletedEpisode,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};

export const deleteGenerated = async (request, response) => {
  const id = request.query.id;
  const language = request.query.language;
  const field = request.query.field;

  try {
    const updateQuery = {
      $unset: {
        [`${field}.$[].${language}`]: ""
      }
    };

    const updatedMovie = await episodeSchema.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true }
    );

    response.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: updatedMovie,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};
