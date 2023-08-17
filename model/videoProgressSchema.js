import mongoose from "mongoose";
// var newId = new mongoose.mongo.ObjectId();
const videoProgressSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "all_movies_sr01",
    },
    episodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "all_webshow_episodes_sr01",
    },
    type: { 
      type: String, 
      required: true 
    },
    duration: { 
      type: Number
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("video_progress", videoProgressSchema);
