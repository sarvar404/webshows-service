import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true, // Make the name field unique
    },
    enable: {
      type: Boolean,
      default: false,
    },
    feature: {
      type: Boolean,
      default: false,
    },
    position : {
      type: Number,
    },
    oldId : {
      type: Number,
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);


export default mongoose.model("categories", categorySchema);
