import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sub_lable: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    classification: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    duration: {
      type: Number,
      required: true,
    },

    tags: [
      {
        type: [String],
      },
    ],
    enable_comments: {
      type: Boolean,
      default: true,
      required: true,
    },
    categories: [
      {
        type: Object,
        required: true,
      },
    ],
    trailer: {
      type: String,
      required: true,
      match:
        /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?$/,
      message: "Invalid URL format",
    },
    sourceUrl_language_files: {
      type: mongoose.Schema.Types.Mixed,
    },

    poster_img: {
      type: Array,
      require: true,
    },
    banner_img: {
      type: Array,
      require: true,
    },
    subtitles_language_files: {
      type: mongoose.Schema.Types.Mixed,
    },
    actors: {
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: function (value) {
          // Check if the value is an object with multiple keys and values
          if (typeof value !== "object" || Object.keys(value).length === 0) {
            return false;
          }
          // Check if all keys are numbers and values are strings without special characters
          for (const key in value) {
            if (!/^[a-zA-Z0-9\s\.\-_,&]+$/.test(key)) {
              return false;
            }
          }
          return true;
        },
        message:
          "myField must be an object with numeric keys and string values without special characters",
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("all_movies_sr01", movieSchema);
