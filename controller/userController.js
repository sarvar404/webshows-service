import userSchema from "../model/userSchema.js";
import bcrypt from 'bcrypt';


export const getMoveCategories = async (request, response) => {
  try {

    // const conn = mongoose.createConnection(`mongodb+srv://sarvar:8jugMdAG3o9AJnIE@db-sarvar-conexus.n3m7z8m.mongodb.net/?retryWrites=true&w=majority`)

    // const models = conn.mldel('categories',{})
   
    const details = await userSchema.find()
    
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (err) {
    response.status(404).json({ success: false, message: "not found" });
  }
};

export const getAllUsers = async (request, response) => {
  try {
    const details = await userSchema.find();
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





export const insertUser = async (request, response, next) => {
  

  try {
    const saltRounds = 10; // Number of salt rounds for bcrypt

    // Hash the password
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds);

    const upcomingData = new userSchema({
      fname: request.body.fname,
      lname: request.body.lname,
      email: request.body.email,
      password: request.body.password, // Store the original password
      passwordHash: passwordHash, // Store the hashed password
      enable: request.body.enable,
      subscriptionStart: request.body.subscriptionStart,
      subscriptionEnd: request.body.subscriptionEnd,
    });

    const savedSuccess = await upcomingData.save();

    response.status(200).json({
      success: true,
      message: 'success',
      data: savedSuccess,
    });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

export const updateUser = async (request, response) => {
  try {
    // console.log(request.body);
    // console.log(request.params.id);
    // process.exit();

    const saltRounds = 10; // Number of salt rounds for bcrypt

    // Hash the password
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds);

    const document = await userSchema.findById(request.params.id);

    // check if the document exists
    if (!document) {
      throw new Error("Invalid Id");
    }

    const update = {
      $set: {
        fname: request.body.fname,
        lname: request.body.lname,
        email: request.body.email,
        password: request.body.password, // Store the original password
        passwordHash: passwordHash, // Store the hashed password
        enable: request.body.enable,
      },
    };

    // console.log(update);
    // process.exit();

    const updatedUser = await userSchema.findOneAndUpdate(
      { _id: request.params.id },
      update,
      { new: true }
    );
    response.status(200).json({
      success: true,
      message: "successfully updated",
      data: updatedUser,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};

export const getAllUsersWithSearch = async (request, response) => {
  
  try {
    const page = parseInt(request.query.page) || 1; // Current page, default is 1
    const limit = 10; // Number of records per page
    const skip = (page - 1) * limit; // Number of records to skip
    const searchValue = request.query.searchValue || ""; // Search value from the query parameter

    // Create a search filter based on the searchValue
    
    const searchFilter = {
      $or: [
        { fname: { $regex: searchValue, $options: 'i' } },
        { lname: { $regex: searchValue, $options: 'i' } },
        { email: { $regex: searchValue, $options: 'i' } }
      ]
    };

    // Get total count of matching records
    const totalCount = await userSchema.countDocuments(searchFilter);

    // Get paginated records
    const usersDetails = await userSchema
      .find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    

    response.status(200).json({
      success: true,
      message: "Successful",
      data: usersDetails,
      totalPages: totalPages,
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
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

        type: JSON.parse(request.body.type) === 1 ? 'TV CHANNEL' :
        JSON.parse(request.body.type) === 2 ? 'MOVIES' :
        JSON.parse(request.body.type) === 3 ? 'WEB SERIES' :
        'NULL',


        name: request.body.name,

        enable: request.body.enable,
      },
    };

    const updatedCategory = await categorySchema.findByIdAndUpdate(
      { _id: request.params.id },
      update,
      { new: true });
    if (!updatedCategory) {
      return response.status(404).json({ error: 'Category not found' });
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

export const getUsersById = async (request, response) => {
  const id = request.params.id;
  // console.log(id)
  try {
    const details = await userSchema.findById(id);
    
    response.status(200).json({
      success: true,
      message: "successful",
      data: details,
    });
  } catch (error) {
    response.status(404).json({ success: true, message: error });
  }
};

export const getAllCategoriesPagination = async (request, response) => {

  try {
    const page = parseInt(request.query.page) || 1; // Current page, default is 1
    const limit = 12; // Number of records per page
    const skip = (page - 1) * limit; // Number of records to skip
    const searchValue = request.query.searchValue || ''; // Search value from the query parameter

    // Create a search filter based on the searchValue
    const searchFilter = { name: { $regex: searchValue, $options: 'i' } };

    

    // Get total count of matching records
    const totalCount = await categorySchema.countDocuments(searchFilter);

    // Get paginated records
    const category = await categorySchema.find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);


    const totalPages = Math.ceil(totalCount / limit);

    response.status(200).json({
      success: true,
      message: 'Successful',
      data: category,
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

export const deleteUser = async (request, response) => {
  try {
    const details = await userSchema.findByIdAndDelete(request.params.id);
    response.status(200).json({
      success: true,
      message: "successfully deleted",
      data: details,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error });
  }
};

