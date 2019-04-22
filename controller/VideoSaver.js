const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const config = require('config');

const router = express.Router();

router.get("/:filename", (req, res) => {
  const pathToMovie = `${config.get("streamConfig.host")+req.params.filename}`;
  ffmpeg(pathToMovie)
    // .videoCodec("libx264")
    .save(`assets/save/${req.params.filename}.flv`);
  console.log("video generated");
  res.send("Video has been saved");
});

module.exports = router;
