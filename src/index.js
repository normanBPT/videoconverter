var videoElement = document.getElementById("videoElement");
var flvPlayer = flvjs.createPlayer({
  type: "flv",
  isLive: true,
  cors: true,
  // url: "../assets/video/spreadoperator.flv"
  // url: "../assets/video/coba.flv"
  // url: "http://localhost:8889/4_21_13.flv"
  // url: "http://www.mediacollege.com/video-gallery/testclips/20051210-w50s.flv"
  // url: "http://localhost:8889/stream/20051210-w50s.flv"
  url: "https://norman-video-streamer.herokuapp.com/stream/barsandtone.flv"
});

// console.log(flvjs.getFeatureList())

if (flvjs.isSupported()) {
  flvPlayer.attachMediaElement(videoElement);
  // flvPlayer.statisticsInfo();
  flvPlayer.load();
  flvPlayer.play();
}