const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const config = require("config");
const fs = require("fs");

const router = express.Router();

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
    let pathToMovie = `${config.get("streamConfig.host")}${queries.tableNo}_${
      queries.gameSet
    }_${queries.gameNo}.flv`;
    
    let stat = fs.statSync(pathToMovie);
    let range = req.headers.range || "bytes=0-";
    let parts = range.replace(/bytes=/, "").split("-");

    let total = stat.size;
    let start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : total - 1;
    let chunksize = (end - start) + 1;
    // let chunksize = total / 2

    res.writeHead(200, {
      "Content-Length": chunksize,
      "Accept-Ranges": "bytes",
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Content-Type": "video/mp4",
      Connection: "keep-alive"
    });

    // console.log("start : ", start);
    // console.log("end : ", end);
    // console.log("total : ", total);
    // console.log("chunksize : ", chunksize);

    // console.log("bytes " + 0 + "-" + end + "/" + (total*2))
    // console.log(res)
    // res.contentType("mp4");
    ffmpeg(pathToMovie)
      .outputOptions("-c:v libx264")
      .outputOptions("-f mp4")
      // .size("1024x?")
      //   .aspect("4:3")
      // .outputOptions(['-frag_duration 100','-movflags frag_keyframe+empty_moov+faststart'])
      // .outputOptions("-movflags frag_keyframe+empty_moov+faststart")
      .outputOptions("-movflags frag_keyframe+empty_moov")
      .on("end", () => {
        // console.log(
        //   `stream video ${queries.tableNo}_${queries.gameSet}_${
        //     queries.gameNo
        //   }.flv is ready`
        // );
      })
      .on("error", (err, stdout, stderr) => {
        console.log("Somethings wrong : ", err);
        // console.log("ffmpeg stdout: ", stdout);
        // console.log("ffmpeg stderr: ", stderr);
      })
        .output(res, { end: true })
        .run();
      // .pipe(
      //   res,
      //   { end: true }
      // );
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
