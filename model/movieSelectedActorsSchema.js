import mongoose from "mongoose";
var newId = new mongoose.mongo.ObjectId();
const movieSelectedActorsSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "all_movies_sr01",
    },
    actors: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "all_actors_sr01",
    },
    biography: {
      type: String,
    },
    born: {
      type: String,
    },
    height: {
      type: String,
    },
    name: {
      type: String,
    },
    poster: {
      type: Array,
    },
    type: {
      type: String,
    },
    role: {
      type: String,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model(
  "list_movie_selected_actors",
  movieSelectedActorsSchema
);
