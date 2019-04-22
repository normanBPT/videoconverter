const express = require("express");
const router = express.Router();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg");
const config = require("config");
const path = require("path");
ffmpeg.setFfmpegPath(ffmpegPath);

router.get("/", (req, res) => {
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
    res.contentType("mp4");
    let pathToMovie = `${config.get("streamConfig.host")}${queries.tableNo}_${
      queries.gameSet
    }_${queries.gameNo}.flv`;
    ffmpeg(pathToMovie)
      .outputOptions("-c:v libx264")
      //   .outputOptions("-t 3")
      //   .outputOptions("-pix_fmt yuv420p")
      .outputOptions("-f mp4")
      // .size("1024x?")
      .outputOptions("-movflags frag_keyframe+empty_moov")
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

module.exports = router;
