import mongoose from "mongoose";
// var newId = new mongoose.mongo.ObjectId();
const seasonSchema = new mongoose.Schema(
  {
    webshow_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : 'all_webshow_root_sr01',
    },
    season_number: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    year: {
      type: Number,
    },
    trailer: {
      type: String
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

    created_at: { type: String },
    updated_at: { type: String },
    enable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("all_webshow_seasons_01", seasonSchema);
