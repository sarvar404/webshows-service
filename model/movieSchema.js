import { Decimal128 } from "mongodb";
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    year: {
      type: Number,
      
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    duration: {
      type: Number,
    },

    tags: [
      {
        type: [String],
      },
    ],
    enable_comments: {
      type: Boolean,
      default: false,
    },
    categories: [
      {
        type: Object,

      },
    ],
   
    sourceUrl_language_files: {
      type: Array,
    },

    poster: {
      type: Object,
    },
    banner: {
      type: Object,
    },
    subtitles_language_files: {
      type: Array,
    },
    actors: {
      type: Object,
      default: {},
    },
    oldId : {
      type: Number,
    },
    trailer : {
      type: String,
    },

    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("all_movies_sr01", movieSchema);
