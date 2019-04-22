const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const config = require("config");
const fs = require("fs");
const http = require("http");

const router = express.Router();

router.get("/", (req, res) => {
  let queries = {
    tableNo: req.query.tableNo,
    gameSet: req.query.gameSet,
    gameNo: req.query.gameNo
  };

  // let otherPath = `${config.get("streamConfig.host")}${queries.tableNo}_${
  //   queries.gameSet
  // }_${queries.gameNo}.flv`;

  // let pathToMovie = `${"rtmp://202.61.66.106/vod/"}4_1_3.flv`;

  let pathToMovie = `${"rtmp://202.61.66.106/vod/"}${queries.tableNo}_${
    queries.gameSet
  }_${queries.gameNo}.flv`;

  res.contentType("mp4");

  // ---------------------------------------------------- Range Header Implementation Start
  /*   let stats = pathToMovie;
  // let stats = fs.statSync(pathToMovie);
  // let statscoba = fs.lstatSync(pathToMovieCoba);
  let range = req.headers.range || "";
  let total = stats.size;

  let parts = range.replace(/bytes=/, "").split("-");
  let partialstart = parts[0];
  let partialend = parts[1];

  let start = parseInt(partialstart, 10);
  let end = partialend ? parseInt(partialend, 10) : total - 1;

  let chunksize = end - start + 1;
  console.log("stats : ", stats);
  // console.log("statcoba : ", statscoba);
  headers = {
    "Content-Range": "bytes " + start + "-" + end + "/" + total,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": "video/mp4",
    Connection: "keep-alive"
  };
  res.writeHead(206, headers); */

  // ---------------------------------------------------- Range Header Implementation End

  /*   let videoConverter = ffmpeg(pathToMovie)
    // .videoCodec("libx264")
    .outputOptions("-c:v libx264")
    // .outputOptions("-sameq")
    .outputOptions("-f mp4")
    // .outputOptions("-vcodec libx264")
    .outputOptions("-movflags frag_keyframe+faststart")
    // .outputOptions("-movflags frag_keyframe+empty_moov +faststart")
    .size("640x?")
    .on("end", () => {
      console.log("ready");
    })
    .on("error", (err, stdout, stderr) => {
      console.log("Somethings wrong : ", err);
      console.log("ffmpeg stdout: ", stdout);

      console.log("ffmpeg stderr: ", stderr);
      // res.render("notfound.html");
      // alert("not found")
    }); */

  let videoConverter = ffmpeg(pathToMovie)
    // .outputOptions("-c:v libx264")
    // .outputOptions("-f mp4")
    .videoCodec("libx264")
    .format("mp4")
    // .outputOptions("-movflags frag_keyframe+faststart")
    .outputOptions("-movflags frag_keyframe");
  // .size("640x?")

  // ffmpeg.ffprobe(videoConverter, function(err, metadata) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     // metadata should contain 'width', 'height' and 'display_aspect_ratio'
  //     console.log(metadata);
  //   }
  // });

  let videoConverted = videoConverter
    .on("end", apapun => {
      console.log(apapun);
    })
    .on("error", err => console.log(err))
    .output(res, { end: true });
  videoConverted.run();
});

module.exports = router;
