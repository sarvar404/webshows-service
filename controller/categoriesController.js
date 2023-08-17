import categorySchema from "../model/categorySchema.js";

export const getCategoriesWithType = async (request, response) => {

  
  try {
    // Fetch records with "id" equal to 2 using the find() method
    const id = request.params.id;
    const details = await categorySchema
      .find({ id })
      .sort({ updated_at: -1 });

    // Check if any records were found
    if (details.length === 0) {
      return response
        .status(404)
        .json({
          success: false,
          message: "No records found with 'id' equal to 2.",
        });
    }

    response.status(200).json({
      success: true,
      message: "Successful",
      data: details,
    });
  } catch (err) {
    response
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getMoveCategories = async (request, response) => {
  try {

    // const conn = mongoose.createConnection(`mongodb+srv://sarvar:8jugMdAG3o9AJnIE@db-sarvar-conexus.n3m7z8m.mongodb.net/?retryWrites=true&w=majority`)

    // const models = conn.mldel('categories',{})
   
    const details = await categorySchema.find()
    
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: false, message: "not found" });
  }
};

export const insertCategory = async (request, response, next) => {
  // console.log(request.body);

  // process.exit();
  try {
    const upcomingData = new categorySchema({
      id: JSON.parse(request.body.type),
      type:
        JSON.parse(request.body.type) === 1
          ? "TV CHANNEL"
          : JSON.parse(request.body.type) === 2
          ? "MOVIES"
          : JSON.parse(request.body.type) === 3
          ? "WEB SERIES"
          : "NULL",
      name: request.body.name,
      enable: request.body.enable,
      feature: request.body.feature,
    });

    // console.log(upcomingData);
    // process.exit();
    const savedSuccess = await upcomingData.save();

    response.status(200).json({
      success: true,
      message: "success",
      data: savedSuccess,
    });
  } catch (error) {
    response.status(400).json({ error: error });
  }
};

export const updateCategory = async (request, response) => {
  // console.log(request.body);
  // console.log(request.params.id);
  // process.exit();

  try {
    // const { type, name } = request.body;
    // const id = type;

    const update = {
      $set: {
        id: JSON.parse(request.body.type),

        type:
          JSON.parse(request.body.type) === 1
            ? "TV CHANNEL"
            : JSON.parse(request.body.type) === 2
            ? "MOVIES"
            : JSON.parse(request.body.type) === 3
            ? "WEB SERIES"
            : "NULL",

        name: request.body.name,

        enable: request.body.enable,
        feature: request.body.feature,
      },
    };
    if (request.body.feature === false) {
      update.$set.position = 0;
    }

    const updatedCategory = await categorySchema.findByIdAndUpdate(
      { _id: request.params.id },
      update,
      { new: true }
    );
    if (!updatedCategory) {
      return response.status(404).json({ error: "Category not found" });
    }

    response.status(200).json({
      success: true,
      message: "success",
      data: updatedCategory,
    });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

export const getCategoryById = async (request, response) => {
  const id = request.params.id;

  try {
    const details = await categorySchema.findById(id);
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: true, message: "not found" });
  }
};

export const getAllCategoriesPagination = async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1; // Current page, default is 1
    const limit = 12; // Number of records per page
    const skip = (page - 1) * limit; // Number of records to skip
    const searchValue = request.query.searchValue || ""; // Search value from the query parameter
    const featured = request.query.featured; // Fetch the "featured" query parameter value

    // Create a search filter based on the searchValue and featured flag
    const searchFilter = { name: { $regex: searchValue, $options: "i" } };

    // Add the condition for "featured" flag
    if (featured === "true") {
      searchFilter.feature = true;
    }

    // Get total count of matching records
    const totalCount = await categorySchema.countDocuments(searchFilter);

    // Get paginated records
    const category = await categorySchema
      .find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    response.status(200).json({
      success: true,
      message: "Successful",
      data: category,
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


export const deleteCategory = async (request, response) => {
  try {
    const details = await categorySchema.findByIdAndDelete(request.params.id);
    response.status(200).json({
      success: true,
      message: "successfully deleted",
      data: details,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};
