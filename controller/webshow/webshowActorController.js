import allWebShowRoot from "../../model/webShowSchema.js";
import seasonSchema from "../../model/webShowSeasonSchema.js";
import episodeSchema from "../../model/webShowEpisodesSchema.js";
import webShowActor from "../../model/webShowActor.js";

export const insertWebShowActor = async (request, response, next) => {
//   console.log(request.body);
//   console.log(request.files);
//   process.exit();

  try {
    const webSeriesDocument = {
      role: request.body.role,
      actor_id: request.body.actor,
      webshow_id: request.body.id,
    };

    const result = new webShowActor(webSeriesDocument);

    const savedWebShow = await result.save();

    response.status(200).json({
      success: true,
      message: "success",
      data: savedWebShow,
    });
  } catch (error) {
    response
      .status(400)
      .json({ success: false, message: error + " internal server error" });
  }
};

// export const updateWebShow = async (request, response) => {

//   // console.log(request.body);
//   // console.log(request.files);
//   // console.log(request.params.id)

//   // process.exit();

//   try {
//     const document = await allWebShowRoot.findById(request.params.id);

//     // check if the document exists
//     if (!document) {
//       throw new Error("Invalid Id");
//     }

//     if (Object.values(request.files).length !== 0) {
//       if (!request.files["poster"]) {
//         const error = new Error("No file provided!");
//         error.statusCode = 422;
//         error.message = "file not found";
//         return next(error);
//       }
//     }

//     const update = {

//       $set: {
//         title: request.body.title,
//         categories: JSON.parse(request.body.categories),
//         tags: request.body.tags ? request.body.tags : undefined,
//         actors: request.body.actors ? JSON.parse(request.body.actors) : undefined,
//         poster : request.files["poster"] ? request.files["poster"] : undefined,
//       },
//     };

//     const updatedEpisode = await allWebShowRoot.findOneAndUpdate(
//       { _id: request.params.id },
//       update,
//       { new: true }
//     );
//     response.status(200).json({
//       success: true,
//       message: "successfully updated",
//       data: updatedEpisode,
//     });
//   } catch (error) {
//     response.status(400).json({ success: false, message: error.message });
//   }
// };

// export const getWebShow = async (request, response) => {
//   const id = request.params.id;

//   try {
//     const details = await allWebShowRoot.findById(id);
//     response.status(200).json({
//       success: true,
//       message: "successful",
//       data: details,
//     });
//   } catch (error) {
//     response.status(404).json({ success: true, message: "not found" });
//   }
// };

// export const getAllWebShows = async (request, response) => {

//   try {
//     const page = parseInt(request.query.page) || 1; // Current page, default is 1
//     const limit = 12; // Number of records per page
//     const skip = (page - 1) * limit; // Number of records to skip

//     // Get total count of records
//     const totalCount = await allWebShowRoot.countDocuments();

//     // Get paginated records
//     const webShows = await allWebShowRoot.find()
//       .sort({ _id: -1 })
//       .skip(skip)
//       .limit(limit);

//     const totalPages = Math.ceil(totalCount / limit);

//     response.status(200).json({
//       success: true,
//       message: 'Successful',
//       data: webShows,
//       totalPages: totalPages,
//     });
//   } catch (err) {
//     response.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//       error: err.message,
//     });
//   }

// }

// // export const getAllWebShows = async (request, response) => {
// //   try {
// //     const details = await allWebShowRoot.find().sort({ _id: -1 });

// //     response.status(200).json({
// //       success: true,
// //       message: "successful",
// //       data: details,
// //     });
// //   } catch (err) {
// //     response.status(404).json({ success: true, message: "not found" });
// //   }
// // };

// export const deletWebShow = async (request, response) => {
//   try {
//     const deletedEpisode = await allWebShowRoot.findByIdAndDelete(
//       request.params.id
//     );
//     response.status(200).json({
//       success: true,
//       message: "successfully deleted",
//       data: deletedEpisode,
//     });
//   } catch (error) {
//     response.status(400).json({ success: false, message: error });
//   }
// };

// // to get all show
// export const getAllShows = async (request, response) => {
//   try {
//     // console.log(request.params.id);

//     // process.exit();

//     const details = await allWebShowRoot.aggregate([
//       {
//         $lookup: {
//           from: "all_webshow_seasons_01",
//           localField: "_id",
//           foreignField: "webshow_id",
//           as: "all_webshow_seasons_01",
//         },
//       },
//       {
//         $lookup: {
//           from: "all_webshow_episodes_sr01",
//           localField: "_id",
//           foreignField: "webshow_id",
//           as: "all_webshow_episodes_sr01",
//         },
//       },
//     ]);

//     response.status(200).json({
//       success: true,
//       message: "successful",
//       data: details,
//     });
//   } catch (err) {
//     response.status(404).json({ success: false, message: "not found" });
//   }
// };

// // to get all show
// export const getAllShowsById = async (request, response) => {
//   try {
//     const details = await allWebShowRoot.find();
//     response.status(200).json({
//       success: true,
//       message: "successful",
//       data: details,
//     });
//   } catch (err) {
//     response.status(404).json({ success: true, message: "not found" });
//   }
// };
