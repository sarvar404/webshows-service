import mongoose from "mongoose";
// var newId = new mongoose.mongo.ObjectId();
const seasonSchema = new mongoose.Schema(
  {
    webshow_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : 'all_webshow_root_sr01',
    },
    actor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'all_actors_sr01',
      },
    role: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9\s]*$/,
      message: "Invalid format. Only alphanumeric and spaces allowed",
    },
    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("webshow_actors", seasonSchema);
