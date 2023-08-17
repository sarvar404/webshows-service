import mongoose from "mongoose";
const episodeSchema = new mongoose.Schema(
  {
    webshow_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : 'all_webshow_root_sr01',
      
    },
    season_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : 'all_webshow_seasons_01',
      
    },
    episode_number: {
      type: Number,
      required: true,
    
    },
    title: {
      type: String,
    },
    description: {
      type: String,
      },
    year: {
      type: Number,
    },
    trailer: {
      type: String,
      match:
        /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?$/,
      message: "Invalid URL format",
    },
    
    duration: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    poster: {
      type: Object,
    },
    banner: {
      type: Object,
    },
    

    sourceUrl_language_files: {
      type: Array,
    },

    subtitles_language_files: {
      type: Array,
    },
    
    created_at: { type: String },
    updated_at: { type: String },
    enable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("all_webshow_episodes_sr01", episodeSchema);
