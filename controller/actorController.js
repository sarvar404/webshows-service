import actorsSchm from "../model/actorsSchema.js";
import movieSchema from "../model/movieSchema.js";
import movieSelectedActorsSchema from "../model/movieSelectedActorsSchema.js";
import { v4 as uuidv4 } from 'uuid';

export const getActors = async (request, response) => {

  
  const id = request.params.id;
  // console.log(id)
  try {
    const details = await actorsSchm.findById(id);
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: true, message: error });
  }
};

// export const getAllActors = async (request, response) => {
//   try {
//     const details = await actorsSchm.find();
//     response.status(200).json({
//       success: true,
//       message: "successful",
//       data: details,
//     });
//   } catch (err) {
//     response.status(404).json({ success: true, message: "not found" });
//   }
// };

export const getAllActors = async (request, response) => {
  try {
    const details = await actorsSchm.find();
    const totalRecords = details.length;
    response.status(200).json({
      success: true,
      message: "successful",
      totalRecords: totalRecords,
    });
  } catch (err) {
    response.status(404).json({ success: false, message: "not found" });
  }
};


export const getAllActorsPagination = async (request, response) => {

  try {
    const page = parseInt(request.query.page) || 1; // Current page, default is 1
    const limit = 12; // Number of records per page
    const skip = (page - 1) * limit; // Number of records to skip
    const searchValue = request.query.searchValue || ''; // Search value from the query parameter

    // Create a search filter based on the searchValue
    const searchFilter = { name: { $regex: searchValue, $options: 'i' } };

    

    // Get total count of matching records
    const totalCount = await actorsSchm.countDocuments(searchFilter);

    // Get paginated records
    const actors = await actorsSchm.find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);


    const totalPages = Math.ceil(totalCount / limit);

    response.status(200).json({
      success: true,
      message: 'Successful',
      data: actors,
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

export const getAllActorsOnlyForSearch = async (request, response) => {

  try {
    const page = parseInt(request.query.page) || 1; // Current page, default is 1
    const limit = 4; // Number of records per page
    const skip = (page - 1) * limit; // Number of records to skip
    const searchValue = request.query.searchValue || ''; // Search value from the query parameter

    // Create a search filter based on the searchValue
    const searchFilter = { name: { $regex: searchValue, $options: 'i' } };

    

    // Get total count of matching records
    const totalCount = await actorsSchm.countDocuments(searchFilter);

    // Get paginated records
    const actors = await actorsSchm.find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);


    const totalPages = Math.ceil(totalCount / limit);

    response.status(200).json({
      success: true,
      message: 'Successful',
      data: actors,
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

export const getAllActorsWithSearchFilter = async (request, response) => {
  try {
    const searchValue = request.query.searchValue || ''; // Search value from the query parameter

    // Create a search filter based on the searchValue
    const searchFilter = { name: { $regex: searchValue, $options: 'i' } };

    // Get all matching records
    const actors = await actorsSchm
      .find(searchFilter)
      .sort({ _id: -1 });

    response.status(200).json({
      success: true,
      message: 'Successful',
      data: actors,
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};



export const getActorIds = async (request, response) => {
  try {
    const details = await actorsSchm.find({}, '_id name')
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: true, message: "not found" });
  }
};
export const insertActor = async (request, response, next) => {

  // console.log(request.body);
  // console.log(request.files);
  // process.exit();

  try {
    if (!request.files.poster) {
      const error = new Error("No file provided!");
      error.statusCode = 422;
      return next(error);
    }

    const upcomingData = new actorsSchm({
      name: request.body.name,
      biography: request.body.biography,
      type: request.body.type,
      height: request.body.height,
      born: request.body.born,
      poster: request.files["poster"],
      enable: request.body.enable,
    });
    const savedSuccess = await upcomingData.save();

    response.status(200).json({
      success: true,
      message: "success",
      data: savedSuccess,
    });
  } catch (error) {
    response.status(400).json({ error: error });
    // if (error.code === 'FILE_TYPE') {
    //   response.status(400).json({ error: error.message });
    // } else if (error.code === 'LIMIT_FILE_SIZE') {
    //   response.status(400).json({ error: 'File size limit exceeded!' });
    // } else if (error.code === 'NO_FILE') {
    //   response.status(400).json({ error: error.message });
    // } else {
    //   response.status(500).json({ error: 'Something went wrong!' });
    // }
  }

  // console.log(request.files);
};

export const updateActor = async (request, response) => {
  try {
    // console.log(request.body);
    // console.log(request.files);
    // process.exit();

    const document = await actorsSchm.findById(request.params.id);

    // check if the document exists
    if (!document) {
      throw new Error("Invalid Id");
    }

    const update = {
      $set: {
        name: request.body.name,
        biography: request.body.biography,
        type: request.body.type,
        height: request.body.height,
        born: request.body.born,
        poster: request.files["poster"] ? request.files["poster"] : undefined,
        enable: request.body.enable,
      },
    };

    const updatedActorRecords = await actorsSchm.findOneAndUpdate(
      { _id: request.params.id },
      update,
      { new: true }
    );
    response.status(200).json({
      success: true,
      message: "successfully updated",
      data: updatedActorRecords,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};

export const deleteActor = async (request, response) => {
  try {
    const deletedActor = await actorsSchm.findByIdAndDelete(request.params.id);
    response.status(200).json({
      success: true,
      message: "successfully deleted",
      data: deletedActor,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};

// export const movieActors = async (request, response) => {
//   try {
//     const actorData = request.body;
//     const id = request.query.id;

//     const savedData = [];
//     for (const actor of actorData) {
//       const { _id, name, poster, born, type, height, biography } = actor;

//       const upcomingData = new movieSelectedActorsSchema({
//         movieId: id,
//         actors: _id,
//         name,
//         poster,
//         born,
//         type,
//         height,
//         biography,
//       });

//       const savedSuccess = await upcomingData.save();
//       savedData.push(savedSuccess);
//     }

//     response.status(200).json({
//       success: true,
//       message: "Success",
//       data: savedData,
//     });
//   } catch (error) {
//     response.status(400).json({ success: false, message: error });
//   }
// };

export const movieActors = async (request, response) => {
  try {
    const actorData = request.body;
    const id = request.query.id;

    const savedData = [];
    const existingData = [];

    for (const actor of actorData) {
      const { _id, name, poster, born, type, height, biography } = actor;

      // Check if the actor already exists for the given movie
      const existingActor = await movieSelectedActorsSchema.findOne({
        movieId: id,
        actors: _id,
      });

      if (existingActor) {
        // Actor already exists, add it to existingData
        existingData.push(existingActor);
      } else {
        const newActor = new movieSelectedActorsSchema({
          movieId: id,
          actors: _id,
          name,
          poster,
          born,
          type,
          height,
          biography,
        });

        const savedSuccess = await newActor.save();
        savedData.push(savedSuccess);
      }
    }

    let message = "Actors saved successfully.";

    if (existingData.length > 0) {
      message += " Some actors already exist for this movie.";
    }

    response.status(200).json({
      success: true,
      message: message,
      savedData: savedData,
      existingData: existingData.length > 0 ? true : false,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};







export const getMovieActorsById = async (request, response) => {
  const id = request.params.id;
  // console.log(id)
  try {
    const details = await movieSelectedActorsSchema.find({ movieId: id });
    // console.log(details)
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


export const updateActorRole = async (request, response) => {
  try {
    const { _id, role, UniverSalId } = request.body;
    // console.log(_id, role, UniverSalId);
    // process.exit();
    const update = {
      $set: {
        role: role,
      },
    };

    const updatedActorRecords = await movieSelectedActorsSchema.findOneAndUpdate(
      { movieId: UniverSalId, _id: _id },
      update,
      { new: true }
    );

    if (!updatedActorRecords) {
      // If no matching actor record found, return an error
      return response.status(404).json({ success: false, message: 'Actor record not found' + updatedActorRecords });
    }

    response.status(200).json({
      success: true,
      message: 'Actor role updated successfully',
      data: updatedActorRecords,
    });
  } catch (error) {
    // Handle any errors that occur during the update process
    response.status(400).json({ success: false, message: error });
  }
};

export const deleteMovieActor = async (request, response) => {

  // console.log(request.params.id);
  // process.exit();
  try {
    const deletedActor = await movieSelectedActorsSchema.findByIdAndDelete(request.params.id);
    response.status(200).json({
      success: true,
      message: "successfully deleted",
      data: deletedActor,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};




