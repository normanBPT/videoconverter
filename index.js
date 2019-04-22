const express = require("express");
const cors = require("cors");
// const config = require('config');
const favicon = require("serve-favicon");
const path = require("path");
const Agent = require("agentkeepalive");

const port = process.env.PORT || 8889;

//------------------------------------------------- import router

const videoStreamerApi = require("./controller/VideoStreamer");
const videoSaverApi = require("./controller/VideoSaver");
// const videoGeneratorApi = require("./controller/VideosGenerator");
const notFoundAPI = require("./controller/NotFoundHandling");
const safariApi = require("./controller/SafariHandling");
const cobaHeader = require("./controller/CobaHeader");
const cobaSafari = require("./controller/CobaSafari");
const cobaCoba = require("./controller/TestingFS");

//------------------------------------------------- provide middleware

const app = express();
app.use(cors());
app.set("view engine", "ejs");
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//-------------------------------------------------- All routes

app.get("/", (req, res) => {
  res.send("Welcome To Stream API");
});

//------------------------------------------------- for stream
app.use("/stream", videoStreamerApi);

//------------------------------------------------- save to flv file
app.use("/save", videoSaverApi);

//------------------------------------------------- iseng - iseng
// app.use("/generate", videoGeneratorApi);

//------------------------------------------------- coba not found
app.use("/notfound", notFoundAPI);

//------------------------------------------------- coba safari
app.use("/cobasafari", safariApi);

//------------------------------------------------- explore Header Range
app.use("/header", cobaHeader);

//------------------------------------------------- other coba safari
app.use("/safari", cobaSafari);

//------------------------------------------------- coba coba
app.use("/coba", cobaCoba);

app.listen(port, () => {
  console.log(`server is up at port ${port}`);
});
