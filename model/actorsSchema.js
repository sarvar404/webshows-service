import mongoose from "mongoose";
var newId = new mongoose.mongo.ObjectId();
const actorsSchema = new mongoose.Schema(
  {
    id: {
        type : String,
        default : newId
    },
    name: {
      type: String,
      
    },
    poster: {
      type: Array,
      
    },
    born: {
      type: String,
      
    },
    type: {
      type: String,
      
    },
    height: {
      type: String,
      
    },
    biography: {
      type: String,
      
    },
    enable: {
      type: Boolean,
      required: true,
    },
    oldId: {
      type : Number
  },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("all_actors_sr01", actorsSchema);
