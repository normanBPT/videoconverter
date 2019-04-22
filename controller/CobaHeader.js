const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const config = require("config");
// const contentRange = require("content-range");

const router = express.Router();

router.get("/", (req, res) => {
  // let pathToMovie = `${config.get("streamConfig.host")}1_9_1.flv`;
  let pathToMovie = `${"rtmp://202.61.66.106/vod/"}1_1_1.flv`

  //------------ Header Range Implementation start
  // let stat = fs.statSync(pathToMovie);

  // let header = contentRange.format({
  //   unit: "bytes",
  //   first: 0,
  //   limit: 20,
  //   length: stat.size
  // });

  // console.log("bytes " + 0 + "-" + (stat.size - 1) + "/" + stat.size);
  // console.log(req.headers.range);

  // console.log(header);
  // console.log(req.headers.range)

  //------------ Header Range Implementation end

  //------------ Coba Coba start

  // let stats = fs.statSync(pathToMovie);
  let stats = pathToMovie
  
  let range = req.headers.range || "";    
  let total = stats.size;
  console.log(total)
  //------------ Coba Coba end

  // res.contentType("mp4");


    let parts = range.replace(/bytes=/, "").split("-");
    let partialstart = parts[0];
    let partialend = parts[1];

    let start = parseInt(partialstart, 10);
    let end = partialend ? parseInt(partialend, 10) : total-1;

    let chunksize = (end-start) + 1;

    headers = { 
      "Content-Range": "bytes " + start + "-" + end + "/" + total, 
      "Accept-Ranges": "bytes", 
      // "Content-Length": chunksize, 
      "Content-Type": "video/mp4",
      Connection: "keep-alive"
    };
    res.writeHead(206, headers);

  // console.log("start : ", start);
  // console.log("end : ", end);
  // console.log("range : " + range);

  ffmpeg(pathToMovie)
    .outputOption("-c:v libx264")
    .outputOption("-f mp4")
    // .outputOption("-movflags frag_keyframe+empty_moov+faststart")
    .outputOption("-movflags frag_keyframe")
    .on("error", (err, stdout, stderr) => {
      console.log(err);
        console.log(stdout);
        console.log(stderr);
    })
    // .pipe(res, { end: true })
    .output(res, { end: true })
    .run();

  // res.send("done");
});

module.exports = router;
