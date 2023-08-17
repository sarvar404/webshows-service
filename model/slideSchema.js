import mongoose from "mongoose";

const slideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    typeTitle: {
      type: String,
      
    },
    type: {
      type: Number,
      
    },
    selectedTypes: {
      type: String,
      
    },
    enable: {
      type: Boolean,
      default: false,
      
    },
    banner: {
      type: Array,
      require: true,
    },
    tags: {
      type: Array,
    },
    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("all_sliders_sr01", slideSchema);
