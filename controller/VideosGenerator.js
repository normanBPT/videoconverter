// const express = require("express");
// const router = express.Router();
const ffmpeg = require("fluent-ffmpeg");

const videoArray = [
  "4_21_13.flv",
  "42_28_43.flv",
  "38_26_52.flv",
  "20051210-w50s.flv.flv"
];
let videoCounter = 0;
let totalVideo = 0;
{
  /* <table_no>_<gameset>_<gameno>.flv */
}

// router.get("/", (req, res) => {
for (let tableNo = 0; tableNo < 9; tableNo++) {
  for (let gameSet = 0; gameSet < 9; gameSet++) {
    for (let gameNo = 0; gameNo < 9; gameNo++) {
      if (videoCounter === videoArray.length) {
        videoCounter = 0;
      }
      // generate video
      ffmpeg(`assets/video/${videoArray[videoCounter]}`).save(
        `assets/videos/${tableNo + 1}_${gameSet + 1}_${gameNo + 1}.flv`
      );
      // log the result
      console.log(
        `${tableNo + 1}_${gameSet + 1}_${gameNo + 1}.flv  = from video =  ${
          videoArray[videoCounter]
        } is generated & video Counter is ${videoCounter}`
      );
      videoCounter++;
      totalVideo++;
    }
  }
}
console.log(`Total ${totalVideo} Video is generated`);
// res.send("done");
// });

// module.exports = router;
