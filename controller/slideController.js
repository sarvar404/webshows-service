import allWebShowRoot from "../model/webShowSchema.js";
import movieSchm from "../model/movieSchema.js";
import slidSchm from "../model/slideSchema.js";

// It can be Movie Or Series

export const getTypes = async (request, response) => {
  const id = request.params.id;
  // console.log(id)
  // process.exit();

  try {
    if (id == null || id == undefined) throw new Error("Invalid id");
    let details = null;
    if (id == 2) {
      details = await movieSchm.find({}, '_id title banner tags');
    }
    if (id == 3) {
      details = await allWebShowRoot.find({}, '_id title banner tags');
    }

    

    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const getSlides = async (request, response) => {
  const id = request.params.id;

  try {
    const details = await slidSchm.findById(id);
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const getAllSlides = async (request, response) => {
  try {
    const details = await slidSchm.find();
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const getAllSlidesPagination = async (request, response) => {

  // console.log(request.query)
  // process.exit();
  try {
    const page = parseInt(request.query.page) || 1; // Current page, default is 1
    const limit = 12; // Number of records per page
    const skip = (page - 1) * limit; // Number of records to skip
    const searchValue = request.query.searchValue || ''; // Search value from the query parameter

    // Create a search filter based on the searchValue
    const searchFilter = { title: { $regex: searchValue, $options: 'i' } };

    // Get total count of matching records
    const totalCount = await slidSchm.countDocuments(searchFilter);

    // Get paginated records
    const slidesPagination = await slidSchm.find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    

    response.status(200).json({
      success: true,
      message: 'Successful',
      data: slidesPagination,
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


export const insertSlides = async (request, response, next) => {

 

  // console.log(request.body);
  // console.log(request.files);
  // process.exit();

  try {
    // const genreNames = request.body.tags.map((genre) => genre.name);
    // const tagsArray = genreNames ? genreNames : undefined;
    // console.log(request.body.tags);
    // process.exit();


    // if (!request.files.banner || ) {
    //   const error = new Error("No file provided!");
    //   error.statusCode = 422;
    //   return next(error);
    // }

    const upcomingData = new slidSchm({
      title: request.body.title,
      type: request.body.type,
      selectedTypes: request.body.selectedTypes,
      typeTitle: request.body.type == 2 ? "movie" : request.body.type == 3 ? 'serie' : '',

      banner: request.body.bannerURL !== '' && request.files["banner"] == undefined ? request.body.bannerURL : request.files["banner"],
      enable: request.body.enable,
      tags: request.body.tags,
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

export const updateSlides = async (request, response) => {
  try {
    

    const document = await slidSchm.findById(request.params.id);

    // check if the document exists
    if (!document) {
      throw new Error("Invalid Id");
    }

    // console.log(request.body);
    // console.log(request.files);
    // process.exit();

    const update = {
      $set: {
        title: request.body.title,
        type: request.body.type,
        typeTitle: request.body.type == 2 ? "movie" : request.body.type == 3 ? 'serie' : '',
        selectedTypes: request.body.selectedTypes,
        banner: request.body.bannerURL !== '' && request.files["banner"] == undefined ? request.body.bannerURL : request.files["banner"],
        enable: request.body.enable,
        tags: request.body.tags,
      },
    };

    const updatedActorRecords = await slidSchm.findOneAndUpdate(
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

export const deleteSlides = async (request, response) => {
  try {
    const deletedActor = await slidSchm.findByIdAndDelete(request.params.id);
    response.status(200).json({
      success: true,
      message: "successfully deleted",
      data: deletedActor,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};



