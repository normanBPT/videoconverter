const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const config = require("config");
const fs = require("fs");
const request = require("request");

const router = express.Router();

router.get("/", (req, res) => {
  //   let queries = {
  //     tableNo: req.query.tableNo,
  //     gameSet: req.query.gameSet,
  //     gameNo: req.query.gameNo
  //   };

  //   let pathToMovie = `${config.get("streamConfig.host")}${queries.tableNo}_${
  //     queries.gameSet
  //   }_${queries.gameNo}.flv`;

  // let pathToMovie = `${config.get("streamConfig.host")}1_1_3.flv`;
  let checkMovie = "rtmp://202.61.66.106/vod/1_1_3.flv";

  // request(checkMovie, (err, res, body) => {
  //   console.log("error : ", err);
  //   console.log("response : ", res);
  //   console.log("body : ", body);
  // });

  /*  let stats = fs.statSync(pathToMovie);
  let range = req.headers.range || "";
  let total = stats.size;

  let parts = range.replace(/bytes=/, "").split("-");
  let partialstart = parts[0];
  let partialend = parts[1];

  let start = parseInt(partialstart, 10);
  let end = partialend ? parseInt(partialend, 10) : total - 1;

  let chunksize = end - start + 1;
    console.log("stats : ", stats);

  headers = {
    "Content-Range": "bytes " + start + "-" + end + "/" + total,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": "video/mp4"
  };
  res.writeHead(206, headers); */

  res.contentType("mp4");

  /*   var stream = fs
    .createReadStream(pathToMovie, { start: start, end: end })
    .on("open", () => {
      stream.pipe(res);
    })
    .on("error", err => {
      res.end(err);
    });

  res.on("close", () => {
    // close or destroy stream
    stream = null;
  }); */

  let videoConverter = ffmpeg(checkMovie)
    // let videoConverter = ffmpeg(pathToMovie)
    .videoCodec("libx264")
    .format("mp4")
    .outputOptions("-movflags frag_keyframe");

  let videoConverted = videoConverter
    .on("open", param => {
      console.log("open", param);
    })
    .on("error", err => console.log(err))
    // .output(res, { start: start, end: end, close: null });
    .pipe(
      res,
      // { start: start, end: end }
      { end: true }
    )
    .on("close", param => {
      //   console.log("output closed", param);
      videoConverted = null;
    });

  console.log(videoConverted);

  //   videoConverted.output(res, { start: start, end: end, close: null }).run();
});

module.exports = router;
