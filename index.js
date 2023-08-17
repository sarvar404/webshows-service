import express from "express";
import helmet from 'helmet';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import axios from "axios";
import fs from "fs";
// import { WEBSHOWS_SERVICE_PORT } from "../PORTS.js"
// external imports
import cookieParser from "cookie-parser";
import Connection from "./database/db.js";
import userRouter from "./routes/users.js";
import homeRouter from "./routes/home.js";
import movieRouter from "./routes/movies.js";
import webShowRouter from "./routes/webshow/webshow.js";
import webShowSeasonRouter from "./routes/webshow/season.js";
import episodeRouter from "./routes/webshow/episodes.js";
import tvChannelRouter from "./routes/tvchannel.js";
import actorsRouter from "./routes/actors.js";
import categoriesRouter from "./routes/categories.js";
import idsRouter from "./routes/idFetcher.js";
import slideRouter from "./routes/slide.js";

import publicAPIs from "./routes/publicapi/publicapi.js"
import { checkForAuthentication, restrictTo } from "./middlewares/middlewareAuth.js";


dotenv.config();
const app = express();
app.use(helmet());
const PORT = process.env.PORT || 8005;

const corsOptions = {
  origin: true,
  credentials: true,
};

// middleware
// we have use body parser here to see the output in console
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static("public")); // publically we can access all the fines into here
app.use(express.static("public/upload/movies_files"));
app.use(checkForAuthentication);
app.get("/", async (request, response) => {
  response.send("APIs working");
});


app.use("/api/public/movies", restrictTo(["NORMAL"]), publicAPIs);

app.use("/api/public/webshows", publicAPIs);

app.use("/api/public/categories", publicAPIs);

app.use("/api/public", publicAPIs);

app.use("/api/public", publicAPIs);

app.use("/api/public", publicAPIs);

//users
app.use("/api/pvt/home", homeRouter);

app.use("/api/uv1", userRouter);

app.use("/api/slide", slideRouter);

app.use("/api/mv1", movieRouter);

app.use("/api", movieRouter);

app.use("/api/wv1", webShowRouter);

// all web show APIs
app.use("/api/showbyid/v1", webShowRouter);

// Seasons APIs
app.use("/api/wv1", webShowSeasonRouter);

// Episodes APIs
app.use("/api/wv1", episodeRouter);

//Channel APIs
app.use("/api/tv1", tvChannelRouter);

// Categories APIs
app.use("/api/ctg/v1", categoriesRouter);

// This api will get webshow Id & name.
app.use("/api/v1/id", idsRouter);

// This api will get Season Id & name.
app.use("/api/v1/id", idsRouter);

// not done yet
app.use("/api/pvt/actv1", actorsRouter);

// apis to access images
const __dirname = path.resolve();
app.get(`/api/movies/:filename`, (req, res) => {
  const filename = req.params.filename;

  res.sendFile(__dirname + "/public/upload/movies_files/" + filename);
});
app.get(`/api/tv/:filename`, (req, res) => {
  const filename = req.params.filename;

  res.sendFile(__dirname + "/public/upload/channels_files/" + filename);
});
app.get(`/api/webshow/:filename`, (req, res) => {
  const filename = req.params.filename;

  res.sendFile(__dirname + "/public/upload/webshow_files/" + filename);
});
app.get(`/api/season/:filename`, (req, res) => {
  const filename = req.params.filename;

  res.sendFile(__dirname + "/public/upload/series_files/" + filename);
});

app.get(`/api/episode/:filename`, (req, res) => {
  const filename = req.params.filename;

  res.sendFile(__dirname + "/public/upload/episodes_files/" + filename);
});

app.get(`/api/actors/:filename`, (req, res) => {
  const filename = req.params.filename;

  res.sendFile(__dirname + "/public/upload/actors_files/" + filename);
});

app.get(`/api/slides/:filename`, (req, res) => {
  const filename = req.params.filename;

  res.sendFile(__dirname + "/public/upload/slides_files/" + filename);
});

app.get(`/api/urlDownloaded/:filename`, (req, res) => {
  const filename = req.params.filename;

  res.sendFile(__dirname + "/public/upload/url_imgs/" + filename);
});

app.listen(PORT, () => {
  Connection();
  console.log(`connection is on :: >> ${PORT}`);
});

const downloadImage = async (url, destinationFolder) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const fileData = Buffer.from(response.data, "binary");

    // Generate a unique filename for the image based on current timestamp in seconds
    const fileName = `${(Date.now() / 1000) | 0}${path.extname(url)}`;
    const filePath = path.join(destinationFolder, fileName);

    // Check if the destination folder exists, if not, create it
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    fs.writeFileSync(filePath, fileData);

    // Extract the file name from the file path
    const fileNameOnly = path.basename(filePath);

    return fileNameOnly;
  } catch (error) {
    // console.error('Error downloading image:', error);
    return null;
  }
};

app.post("/api/download-image", async (request, response) => {
  // console.log(request.body)
  // process.exit();

  try {
    const { url } = request.body;
    const destinationFolder = path.join(
      __dirname,
      "public",
      "upload",
      "url_imgs"
    );

    const filePath = await downloadImage(url, destinationFolder);

    if (filePath) {
      response.json({ filePath });
    } else {
      response.status(500).json({ error: "Failed to download image." });
    }
  } catch (error) {
    // console.error('Error downloading image:', error);
    response.status(500).json({ error: "Failed to download image." });
  }
});
