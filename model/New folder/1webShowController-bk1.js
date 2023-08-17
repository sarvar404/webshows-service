
import mongoose from "mongoose";
var newId = new mongoose.mongo.ObjectId();
const webShowSchema = new mongoose.Schema(
  {
    // title: {
    //   type: String,
    //   required: true,
    //   match: /^[a-zA-Z0-9\s]*$/,
    //   message: 'Invalid format. Only alphanumeric and spaces allowed'
    // },
    // tags: [
    //   {
    //     type: Array,
    //   },
    // ],
    // categories: [
    //   {
    //     type: Array,
    //   },
    // ],
    seasons: {
      // id: {
      //   type : String,
      //   default : newId
      // },
      // season_number: {
      //   type: Number,
      //   required: true,
      //   unique: true,
      // },
      // title: {
      //   type: String,
      //   required: true,
      //   match: /^[a-zA-Z0-9\s]*$/,
      //   message: 'Invalid format. Only alphanumeric and spaces allowed'
      // },
      // description: {
      //   type: String,
      //   required: true,
      //   match: /^[a-zA-Z0-9\s\.\-_,&]+$/,
      //   message: 'Invalid format. Only alphanumeric, spaces, periods, hyphens, underscores, commas, and ampersands allowed'
      // },
      // year: {
      //   type: Number,
      //   min: 1000,
      //   max: 9999,
      //   required: true,
      // },
      // trailer: {
      //   type: String,
      //   required: true,
      //   match: /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?$/,
      //   message: 'Invalid URL format'
      // },
      // poster: {
      //   type: Object,
      // },
      // banner: {
      //   type: Object,
      // },
      // rating: {
      //   type: Number,
      //   required: true,
      //   min: 0,
      //   max: 5,
      //   default: 0,
      // },

      // created_at: {type : String}, 
      // updated_at: {type : String}, 
      // removed_at: {
      //   type: Boolean,
      //   default: false,
      // },

      episodes: {
        id: {
          type : String,
          default : newId
        },
        episode_number: {
          type: Number,
          required: true,
          unique: true,
        },
        // title: {
        //   type: String,
        //   required: true,
        //   match: /^[a-zA-Z0-9\s]*$/,
        //   message: 'Invalid format. Only alphanumeric and spaces allowed'
        // },
        // description: {
        //   type: String,
        //   required: true,
        //   match: /^[a-zA-Z0-9\s\.\-_,&]+$/,
        //   message: 'Invalid format. Only alphanumeric, spaces, periods, hyphens, underscores, commas, and ampersands allowed'
        // },
        // year: {
        //   type: Number,
        //   min: 1000,
        //   max: 9999,
        //   required: true,
        // },
        // trailer: {
        //   type: String,
        //   required: true,
        //   match: /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?$/,
        //   message: 'Invalid URL format'
        // },
        // poster: {
        //   type: Object,
        // },
        // banner: {
        //   type: Object,
        // },
        // duration: {
        //   type: Number,
        //   required: true,
        // },
        // rating: {
        //   type: Number,
        //   required: true,
        //   min: 0,
        //   max: 5,
        //   default: 0,
        // },
        // source : {
        //   source_url: {
        //     type: Object,
        //     require: true,
        //   },
        //   language : {
        //     type : Array,
        //     require: true,
        //     default : "English",
        //   },
        // },
        // subtitles : {
        //   language : Array,
        //   sub_file : Object,
        // },
        // created_at: {type : String}, 
        // updated_at: {type : String}, 
        // removed_at: {
        //   type: Boolean,
        //   default: true,
        // },
      }, 
    },
    // actors : {
    //   id : {
    //     type: Number,
    //     required : true,
    //     unique : true,
    //   },
    //   role : {
    //     type: String,
    //     required: true,
    //     match: /^[a-zA-Z0-9\s\.\-_,&]+$/,
    //     message: 'Invalid format. Only alphanumeric, spaces, periods, hyphens, underscores, commas, and ampersands allowed'
    //   }
    // }
    // actors : {
    //   type: Object,
    //   validate: {
    //     validator: function(obj) {
    //       const regex = /^[a-zA-Z0-9\s\.\-_,&]+$/;
    //       for (const key in obj) {
    //         if (obj.hasOwnProperty(key) && !regex.test(obj[key])) {
    //           return false;
    //         }
    //       }
    //       return true;
    //     },
    //     message: 'Invalid format. Only alphanumeric, spaces, periods, hyphens, underscores, commas, and ampersands allowed'
    //   }
    // },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("all_webshow_sr011", webShowSchema);
