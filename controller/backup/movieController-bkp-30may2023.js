import axios from "axios";
import movieSchm from "../model/movieSchema.js";
import { v4 as uuidv4 } from "uuid";

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
    const searchValue = request.query.searchValue || ''; // Search value from the query parameter

    // Create a search filter based on the searchValue
    const searchFilter = { title: { $regex: searchValue, $options: 'i' } };

    // Get total count of matching records
    const totalCount = await movieSchm.countDocuments(searchFilter);

    // Get paginated records
    const moviePagination = await movieSchm.find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    response.status(200).json({
      success: true,
      message: 'Successful',
      data: moviePagination,
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

    const upcomingData = new movieSchm({
      title: request.body.title,

      description: request.body.description,
      year: request.body.year,
      classification: request.body.classification,
      rating: request.body.rating,
      sub_lable: request.body.sub_lable,
      duration: request.body.duration,

      enable_comments:  request.body.enable_comments === 'on' ? true : false,
      

      

      sourceUrl_language_files: sourceUrl_language_files,
      subtitles_language_files: subtitles_language_files,

      categories: JSON.parse(request.body.categories),
      tags: request.body.tags,

      poster_img: namedFiles.poster_img ? namedFiles.poster_img : undefined,
      banner_img: namedFiles.banner_img ? namedFiles.banner_img : undefined,
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
  console.log(request.body);
  console.log(request.files);

  process.exit();

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
        error.message = "Unknown file format";
    
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
    
    
    

    if (sourceFileCount > 0) {
      for (let index = 0; index < sourceFileCount; index++) {

        


        if (request.body[`language${index}`] !== "") {
          sourceUrl_language_files[request.body[`language${index}`]] =
            request.body[`source_url${index}`];
        }
      }
    }

    let sourceFileCountGen = 0;

    for (const key in data) {
      if (key.startsWith("g_source_url")) {
        sourceFileCountGen++;
      }
    }

    if (sourceFileCountGen > 0) {
      for (let index = 0; index < sourceFileCountGen; index++) {
        sourceUrl_language_files[request.body[`g_language${index}`]] =
          request.body[`g_source_url${index}`];
      }
    }

    // console.log(sourceUrl_language_files, "here source url");
    // console.log(subtitles_language_files, "here subtitle");
    // process.exit();

    const update = {
      $set: {
        title: request.body.title,

        description: request.body.description,
        year: request.body.year,
        classification: request.body.classification,
        rating: request.body.rating,
        sub_lable: request.body.sub_lable,
        duration: request.body.duration,

        enable_comments: request.body.enable_comments,

        categories: JSON.parse(request.body.categories),
        tags: request.body.tags,

        sourceUrl_language_files: sourceUrl_language_files,
        subtitles_language_files: subtitles_language_files,

        poster_img: namedFiles.poster_img ? namedFiles.poster_img : undefined,
        banner_img: namedFiles.banner_img ? namedFiles.banner_img : undefined,
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
    response.status(400).json({ success: false, message: error.message });
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
        [`${field}.$[].${language}`]: ""
      }
    };

    const updatedMovie = await movieSchm.findByIdAndUpdate(
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



// we made this for fetching records through apis...

export const collectDataThroughApi = async (request, response) => {
  try {
    const apiRequests = [];
    const records = [];

    for (let i = 0; i <= 1000; i++) {
      const apiUrl = `https://admin.dashmoonmx.com/api/serie/by/filtres/0/created/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
      apiRequests.push(
        axios
          .get(apiUrl)
          .then(response => response.data)
          .catch(error => {
            console.error(`Error fetching data for API ${i}:`, error.message);
            return []; // Return an empty array for failed requests
          })
      );
    }

    const responses = await Promise.all(apiRequests);
    responses.forEach(responseData => {
      if (Array.isArray(responseData) && responseData.length > 0) {
        records.push(responseData);
      }
    });

    const flattenedRecords = records.flat();
    response.json(flattenedRecords);
  } catch (error) {
    console.error('Error:', error.message);
    response.status(500).send('An error occurred.');
  }
};



// export const collectDataThroughApi = async (request, response) => {
//   try {
//     const apiRequests = [];
//     const records = [];
//     let id = 1;

//     for (let i = 0; i <= 3800; i++) {
//       const apiUrl = `https://admin.dashmoonmx.com/api/role/by/poster/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
//       apiRequests.push(
//         axios
//           .get(apiUrl)
//           .then(response => response.data)
//           .catch(error => {
//             // console.error(`Error fetching data for API ${i}:`, error.message);
//             return {}; // Return an empty object for failed requests
//           })
//       );
//     }

//     const responses = await Promise.all(apiRequests);
//     const filteredResponses = responses.filter(response => response && Object.keys(response).length !== 0);
//     const flattenedRecords = filteredResponses.flat();
//     const extractedRecords = flattenedRecords.map(record => ({
//       countingnumber: id++,
//       originalId : record.id,
//       name: record.name,
//       biography: record.bio,
//       poster: record.image,
//       enable: true,
//     }));

//     // console.log(extractedRecords);
//     response.json(extractedRecords);
//   } catch (error) {
//     console.error('Error:', error.message);
//     response.status(500).send('An error occurred.');
//   }
// };















