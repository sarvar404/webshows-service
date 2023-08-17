
import mongoose from "mongoose";
var newId = new mongoose.mongo.ObjectId();
const webShowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: [String],
      },
    ],
    categories: [
      {
        type: Object,
      },
    ],

    description: {
      type: String,
      message:
        "Invalid format. Only alphanumeric, spaces, periods, hyphens, underscores, commas, and ampersands allowed",
    },
    year: {
      type: Number,
    },
    trailer: {
      type: String,
    },
    poster: {
      type: Object,
    },
    banner: {
      type: Object,
    },
    rating: {
      type: Number,
      default: 0,
    },
    enable: {
      type: Boolean,
      default: false,
    },
    oldId: {
      type: Number,
    },

  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("all_webshow_root_sr01", webShowSchema);
