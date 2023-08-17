import tvChannelSchm from "../model/tvChannelsSchema.js";

export const insertTvChanel = async (request, response, next) => {
  // console.log("all details")
  // console.log(request.body)
  // console.log(request.files)
  // console.log("all details")
  // process.exit();

  try {
    if (
      
      !request.files["poster"] ||
      !request.files["banner"]
    ) {
      const error = new Error("No file provided!");
      error.statusCode = 422;
      error = "Invalid File";
      return next(error);
    }

    const upcomingData = new tvChannelSchm({
      name: request.body.name,
      categories: JSON.parse(request.body.categories),
      enable: request.body.enable,
      source_url: request.body.source_url0,

      poster: request.files["poster"],
      banner: request.files["banner"],
      rating: request.body.rating,
    });

    const savedChannel = await upcomingData.save();

    response.status(200).json({
      success: true,
      message: "Success",
      data: savedChannel,
    });
  } catch (error) {
    response.status(400).json({
      message: error, //,
    });
  }
};

export const getTvChannel = async (request, response) => {
  const id = request.params.id;

  try {
    const details = await tvChannelSchm.findById(id);
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const getAllTvChannelPagination = async (request, response) => {

  try {
    const page = parseInt(request.query.page) || 1; // Current page, default is 1
    const limit = 12; // Number of records per page
    const skip = (page - 1) * limit; // Number of records to skip
    const searchValue = request.query.searchValue || ''; // Search value from the query parameter

    // Create a search filter based on the searchValue
    const searchFilter = { name: { $regex: searchValue, $options: 'i' } };

    // Get total count of records
    const totalCount = await tvChannelSchm.countDocuments(searchFilter);

    // Get paginated records
    const tvChannelPage = await tvChannelSchm.find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    response.status(200).json({
      success: true,
      message: 'Successful',
      data: tvChannelPage,
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

export const getAllTvChannel = async (request, response) => {
  try {
    const details = await tvChannelSchm.find().sort({ _id: -1 });
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const updateTvChanel = async (request, response, next) => {
  try {
    const document = await tvChannelSchm.findById(request.params.id);

    // check if the document exists
    if (!document) {
      throw new Error("Invalid Id");
    }

    // console.log("all details");
    // console.log(request.body);
    // console.log(request.files);
    // console.log("all details");
    // process.exit();

    // console.log(request.files);
    // console.log("all details");
    // process.exit();
    const update = {
      $set: {
        name: request.body.name,
        categories: JSON.parse(request.body.categories),
        enable: request.body.enable,
        source_url: request.body.source_url0,

        poster: request.files["poster"]
          ? request.files["poster"]
          : undefined,
        banner: request.files["banner"]
          ? request.files["banner"]
          : undefined,
        rating: request.body.rating,
      },
    };

    const updatedTvChannel = await tvChannelSchm.findOneAndUpdate(
      { _id: request.params.id },
      update,
      { new: true, upsert: false }
    );

    if (!updatedTvChannel) {
      throw new Error("Tv Channel not found");
    }

    response.status(200).json({
      success: true,
      message: "successfully updated",
      data: updatedTvChannel,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};

export const deleteTvChannel = async (request, response) => {
  try {
    const deletedChannel = await tvChannelSchm.findByIdAndDelete(
      request.params.id
    );
    response.status(200).json({
      success: true,
      message: "successfully deleted",
      data: deletedChannel,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};
