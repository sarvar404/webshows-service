import mongoose from "mongoose";
const tvChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    poster: {
      type: Array,
    },
    banner: {
      type: Array,
    },
    source_url: {
      type: String,

    },
    categories: [
      {
        type: Object,
        required: true,
      },
    ],
    rating: {
      type: Number,
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

export default mongoose.model("all_tv_channel_sr01", tvChannelSchema);
