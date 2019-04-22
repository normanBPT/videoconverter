const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const config = require("config");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  htmlPath = path.join(__dirname + "/../views/stream.html");
  res.sendFile(htmlPath);
});

router.get("/mp4", (req, res) => {
  let queries = {
    tableNo: req.query.tableNo,
    gameSet: req.query.gameSet,
    gameNo: req.query.gameNo
  };
  let emptyQuery = [];
  if (
    queries.tableNo !== undefined &&
    queries.tableNo.length > 0 &&
    (queries.gameSet !== undefined && queries.gameSet.length > 0) &&
    (queries.gameNo !== undefined && queries.gameNo.length > 0)
  ) {
    // let pathToMovie = `${config.get("streamConfig.host")}${queries.tableNo}_${
    //   queries.gameSet
    // }_${queries.gameNo}.flv`;

    let pathToMovie = `${"rtmp://202.61.66.106/vod/"}${queries.tableNo}_${
      queries.gameSet
    }_${queries.gameNo}.flv`;

    // res.contentType("mp4");

    // ---------------------------------------------------- Range Header Implementation Start
    // let stats = fs.statSync(pathToMovie);
    let stats = pathToMovie;
    let range = req.headers.range || "";
    let total = stats.size;

    let parts = range.replace(/bytes=/, "").split("-");
    let partialstart = parts[0];
    let partialend = parts[1];

    let start = parseInt(partialstart, 10);
    let end = partialend ? parseInt(partialend, 10) : total - 1;

    let chunksize = end - start + 1;

    headers = {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
      Connection: "keep-alive"
    };
    res.writeHead(200, headers);

    // ---------------------------------------------------- Range Header Implementation End

    ffmpeg(pathToMovie)
      .outputOptions("-c:v libx264")
      // .videoBitrate('1000k', true)
      //   .outputOptions("-t 3")
      //   .outputOptions("-pix_fmt yuv420p")
      .outputOptions("-f mp4")
      .size("640x?")
      // .aspect("4:3")
      // .size("200%")
      .outputOptions("-movflags frag_keyframe+empty_moov")
      // .outputOption("-movflags frag_keyframe")
      // .on("start", function(commandLine) {
      //   console.log("Spawned Ffmpeg with command: " + commandLine);
      // })
      .on("end", () => {
        console.log(
          `stream video ${queries.tableNo}_${queries.gameSet}_${
            queries.gameNo
          }.flv is ready`
        );
      })
      .on("error", (err, stdout, stderr) => {
        console.log("Somethings wrong : ", err);
        console.log("ffmpeg stdout: ", stdout);
        console.log("ffmpeg stderr: ", stderr);
        // res.render("notfound.html");
        // alert("not found")
      })
      .output(res, { end: true })
      .run();
  } else {
    for (let index = 0; index < Object.entries(queries).length; index++) {
      if (
        Object.values(queries)[index] === undefined ||
        Object.values(queries)[index].length === 0
      ) {
        emptyQuery.push(Object.keys(queries)[index]);
      }
    }
    console.log(`${emptyQuery} is not defined`);
    res.send(`${emptyQuery} is not defined`);
  }
});

router.get("/flv", (req, res) => {
  let queries = {
    tableNo: req.query.tableNo,
    gameSet: req.query.gameSet,
    gameNo: req.query.gameNo
  };
  let emptyQuery = [];
  if (
    queries.tableNo !== undefined &&
    queries.tableNo.length > 0 &&
    (queries.gameSet !== undefined && queries.gameSet.length > 0) &&
    (queries.gameNo !== undefined && queries.gameNo.length > 0)
  ) {
    // res.send(`${queries.tableNo}_${queries.gameSet}_${queries.gameNo}.flv`);
    res.contentType("flv");
    let pathToMovie = `${config.get("streamConfig.host")}${queries.tableNo}_${
      queries.gameSet
    }_${queries.gameNo}.flv`;
    ffmpeg(pathToMovie)
      .videoCodec("libx264")
      .preset("flashvideo")
      .output(res, { end: true })
      .on("end", () => {
        console.log(
          `stream video ${queries.tableNo}_${queries.gameSet}_${
            queries.gameNo
          }.flv is ready`
        );
      })
      .on("error", err => {
        console.log("Somethings wrong : " + err);
      })
      .run();
  } else {
    for (let index = 0; index < Object.entries(queries).length; index++) {
      if (
        Object.values(queries)[index] === undefined ||
        Object.values(queries)[index].length === 0
      ) {
        emptyQuery.push(Object.keys(queries)[index]);
      }
    }
    console.log(`${emptyQuery} is not defined`);
    res.send(`${emptyQuery} is not defined`);
  }
});

module.exports = router;
