const video_player = document.querySelector("#video_player"),
  mainVideo = video_player.querySelector("#main-video"),
  progressAreaTime = video_player.querySelector(".progressAreaTime"),
  controls = video_player.querySelector(".controls"),
  progressArea = video_player.querySelector(".progress-area"),
  progress_Bar = video_player.querySelector(".progress-bar"),
  play_pause = video_player.querySelector(".play_pause"),
  volume = video_player.querySelector(".volume"),
  volume_range = video_player.querySelector(".volume_range"),
  current = video_player.querySelector(".current"),
  totalDuration = video_player.querySelector(".duration"),
  auto_play = video_player.querySelector(".auto-play"),
  settingsBtn = video_player.querySelector(".settingsBtn"),
  picture_in_picutre = video_player.querySelector(".picture_in_picutre"),
  fullscreen = video_player.querySelector(".fullscreen"),
  settings = video_player.querySelector("#settings"),
  playback = video_player.querySelectorAll(".playback li");
  videoSpinner = video_player.querySelectorAll(".videoSpinner");

let thumbnail = video_player.querySelector(".thumbnail");

var style_cwst = document.querySelector('[data-css-webkit-slider-thumb="cwst"]');

// Play video function
function playVideo() {
  play_pause.innerHTML = "pause";
  play_pause.title = "pause";
  video_player.classList.add("playing");
  mainVideo.play();
}

// Pause video function
function pauseVideo() {
  play_pause.innerHTML = "play_arrow";
  play_pause.title = "play";
  video_player.classList.remove("playing");
  mainVideo.pause();
}

play_pause.addEventListener("click", () => {
  const isVideoPaused = video_player.classList.contains("playing");
  isVideoPaused ? pauseVideo() : playVideo();
});

mainVideo.addEventListener("play", () => {
  playVideo();
});

mainVideo.addEventListener("pause", () => {
  pauseVideo();
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") {
    if (mainVideo.volume == 1) {
      return false;
    }
    else {
      mainVideo.volume += 0.05;
      volume_range.value = mainVideo.volume * 100;
      volume.innerHTML = "volume_up";
      mainVideo.volume = Math.round(mainVideo.volume * 100) / 100;
    }
  }
  
  if (e.key === "ArrowDown") {
    if (mainVideo.volume == 0) {
      volume.innerHTML = "volume_off";
      return false;
    }
    else {
      mainVideo.volume -= 0.05;
      volume_range.value = mainVideo.volume * 100;
      mainVideo.volume = Math.round(mainVideo.volume * 100) / 100;
    }
  }

  if (e.key === "ArrowLeft") {
    mainVideo.currentTime -= 5;
  }

  if (e.key === "ArrowRight") {
    mainVideo.currentTime += 5;
  }

  if (e.key === " " || e.key === "k") {
    const isVideoPaused = video_player.classList.contains("playing");
    isVideoPaused ? pauseVideo() : playVideo();
  }

  if (e.key === "m") {
    muteVolume();
  }

  if (e.key === "i") {
    enterPictureInPicture();
  }

  if (e.key === "f") {
    setScreenFullExit();
  }

  if (e.key >= "0" && e.key <= "9") {
    let number = parseInt(e.key);
    let totalDuration = mainVideo.duration;
    let videoPercentage = (totalDuration / 10) * number;
    mainVideo.currentTime = videoPercentage;
  }

});

// check the useragent is mobile or not
function isMobile() {
  if (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)) {
    return true;
  } else {
    return false;
  }
}

if(isMobile() === false) {
  mainVideo.addEventListener("click", () => {
    const isVideoPaused = video_player.classList.contains("playing");
    isVideoPaused ? pauseVideo() : playVideo();
  });
}

function single_tap() {
  const isVideoPaused = video_player.classList.contains("playing");
  isVideoPaused ? pauseVideo() : playVideo();
}

function double_tap(e) {
  let screenWidth = video_player.offsetWidth;
  var touchX = e.touches[0].pageX;
  if ((touchX > 0) && (touchX < (screenWidth/2))) {
    mainVideo.currentTime -= 5;
  }
  else if ((touchX > (screenWidth/2))) {
    mainVideo.currentTime += 5;
  }
}

var tapped = false;
mainVideo.addEventListener("touchstart", (e) => {
  if(!tapped) {
    tapped = setTimeout(function() {
      single_tap();
      tapped = null
    },300); //wait 300ms
  } else {
    clearTimeout(tapped);
    tapped = null
    double_tap(e);
  }
}, { passive: true });

// Load video duration
mainVideo.addEventListener("loadeddata", (e) => {
  let videoDuration = e.target.duration;
  let totalMin = Math.floor(videoDuration / 60);
  let totalSec = Math.floor(videoDuration % 60);

  let totalHours = Math.floor(totalMin / 60);
  let totalMinutes = Math.floor(totalMin % 60);

  // if seconds are less then 10 then add 0 at the begning
  totalSec < 10 ? (totalSec = "0" + totalSec) : totalSec;
  totalMinutes < 10 ? (totalMinutes = "0" + totalMinutes) : totalMinutes;
  totalHours < 10 ? (totalHours = "0" + totalHours) : totalHours;

  if (totalMin >= 60) {
    totalDuration.innerHTML = `${totalHours}:${totalMinutes}:${totalSec}`;
  } else {
    totalDuration.innerHTML = `${totalMin}:${totalSec}`;
  }
});

// Current video duration
mainVideo.addEventListener("timeupdate", (e) => {
  let currentVideoTime = e.target.currentTime;
  let currentMin = Math.floor(currentVideoTime / 60);
  let currentSec = Math.floor(currentVideoTime % 60);

  let currentHour = Math.floor(currentMin / 60);
  let currentMinute = Math.floor(currentMin % 60);

  // if seconds are less then 10 then add 0 at the begning
  currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
  currentMinute < 10 ? (currentMinute = "0" + currentMinute) : currentMinute;
  currentHour < 10 ? (currentHour = "0" + currentHour) : currentHour;

  if (currentMin > 60) {
    current.innerHTML = `${currentHour}:${currentMinute}:${currentSec}`;
  }
  else {
    current.innerHTML = `${currentMin}:${currentSec}`;
  }
  
  let videoDuration = e.target.duration;
  // progressBar width change
  let progressWidth = (currentVideoTime / videoDuration) * 100;
  progress_Bar.value = progressWidth;
  progress_Bar.style.background = `linear-gradient(to right, #ff0000 0%, #ff0000 ${progress_Bar.value}%, #f0f0f063 ${progress_Bar.value}%, #f0f0f063 100%)`;
});

progress_Bar.addEventListener("input", (e) => {
  let progressBarValue = e.target.value;
  progress_Bar.style.background = `linear-gradient(to right, #ff0000 0%, #ff0000 ${progressBarValue}%, #f0f0f063 ${progressBarValue}%, #f0f0f063 100%)`;
  mainVideo.currentTime = (mainVideo.duration / 100) * progressBarValue;
});

// let's update playing video current time on according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let videoDuration = mainVideo.duration;
  let progressWidthval = progressArea.clientWidth + 2;
  let ClickOffsetX = e.offsetX;
  mainVideo.currentTime = (ClickOffsetX / progressWidthval) * videoDuration;

  let currentVideoTime = mainVideo.currentTime;
  let currentMin = Math.floor(currentVideoTime / 60);
  let currentSec = Math.floor(currentVideoTime % 60);

  let currentHour = Math.floor(currentMin / 60);
  let currentMinute = Math.floor(currentMin % 60);

  // if seconds are less then 10 then add 0 at the begning
  currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
  currentMinute < 10 ? (currentMinute = "0" + currentMinute) : currentMinute;
  currentHour < 10 ? (currentHour = "0" + currentHour) : currentHour;

  if (currentMin > 60) {
    current.innerHTML = `${currentHour}:${currentMinute}:${currentSec}`;
  }
  else {
    current.innerHTML = `${currentMin}:${currentSec}`;
  }

  let progressWidth = (mainVideo.currentTime / videoDuration) * 100;
  progress_Bar.value = progressWidth;
  progress_Bar.style.background = `linear-gradient(to right, #ff0000 0%, #ff0000 ${progress_Bar.value}%, #f0f0f063 ${progress_Bar.value}%, #f0f0f063 100%)`;
});

mainVideo.addEventListener("waiting", () => {
  videoSpinner[0].style.display = "block";
});

mainVideo.addEventListener("canplay", () => {
  videoSpinner[0].style.display = "none";
});

// change volume
function changeVolume() {
  mainVideo.volume = volume_range.value / 100;
  if (volume_range.value == 0) {
    volume.innerHTML = "volume_off";
  } else if (volume_range.value < 40) {
    volume.innerHTML = "volume_down";
  } else {
    volume.innerHTML = "volume_up";
  }
}

function muteVolume() {
  if (volume_range.value == 0) {
    volume_range.value = 80;
    mainVideo.volume = 0.80;
    volume.innerHTML = "volume_up";
  } else {
    volume_range.value = 0;
    mainVideo.volume = 0;
    volume.innerHTML = "volume_off";
  }
}

volume_range.addEventListener("change", () => {
  changeVolume();
});

volume.addEventListener("click", () => {
  muteVolume();
});

// Update progress area time and display block on mouse move
progressArea.addEventListener("mousemove", (e) => {
  style_cwst.innerHTML = ".controls .progress-area .progress-bar::-webkit-slider-thumb { width: 14px !important; height: 14px !important; }";
  let progressWidthval = progressArea.clientWidth - 2;
  let x = e.offsetX;
  let videoDuration = mainVideo.duration;
  let progressTime = Math.floor((x / progressWidthval) * videoDuration);

  let currentMin = Math.floor(progressTime / 60);
  let currentSec = Math.floor(progressTime % 60);

  let currentHours = Math.floor(currentMin / 60);
  let currentMinutes = Math.floor(currentMin % 60);
 
  if (x >= progressWidthval - 80) {
    x = progressWidthval - 80;
  } else if (x <= 75) {
    x = 75;
  } else {
    x = e.offsetX;
  }

  // if seconds are less then 10 then add 0 at the begning
  currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
  currentMinutes < 10 ? (currentMinutes = "0" + currentMinutes) : currentMinutes;
  currentHours < 10 ? (currentHours = "0" + currentHours) : currentHours;

  if (currentMin >= 60) {
    progressAreaTime.innerHTML = `${currentHours}:${currentMinutes}:${currentSec}`;
  } else {
    progressAreaTime.innerHTML = `${currentMin}:${currentSec}`;
  }
  thumbnail.style.setProperty("--x", `${x}px`);
  thumbnail.style.display = "block";
  // the backgroud position-x and background position-y of progressAreaTime change according to the progress bar width same as thumbnail
  progressAreaTime.style.setProperty("--x", `${x}px`);
  progressAreaTime.style.display = "block";

  for (var item of thumbnails) {
    //
    var data = item.sec.find(x1 => x1.index === Math.floor(progressTime));

    // thumbnail found
    if (data) {
      if (item.data != undefined) {
        thumbnail.setAttribute("style",`background: #FFF; border: 2px solid #FFF; background-image: url(${item.data});background-position-x: ${data.backgroundPositionX}px;background-position-y: ${data.backgroundPositionY}px;--x: ${x}px;display: block;`)
        // exit
        return;
      }
    }
  }
});

if(isMobile() == true) {
  style_cwst.innerHTML = ".controls .progress-area .progress-bar::-webkit-slider-thumb { width: 14px !important; height: 14px !important; }";
}

progressArea.addEventListener("mouseleave", () => {
  thumbnail.style.display = "none";
  progressAreaTime.style.display = "none";
  style_cwst.innerHTML = "";
});

// Picture in picture
function enterPictureInPicture() {
  let videoElement = document.querySelector("#main-video");
  if(document.pictureInPictureEnabled && !videoElement.disablePictureInPicture) {
    try {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
            video_player.classList.remove("picture-in-picture");
        } else {
          videoElement.requestPictureInPicture();
          video_player.classList.add("picture-in-picture");
          // if video_player contains openFullScreen class then remove it and exit full screen
          if (video_player.classList.contains("openFullScreen")) {
            video_player.classList.remove("openFullScreen");
            fullscreen.innerHTML = "fullscreen";
            document.exitFullscreen();
          }
        }
    } catch(err) {
        console.error(err);
    }
  }
}

picture_in_picutre.addEventListener("click", () => {
  enterPictureInPicture();
});

// Full screen function
function setScreenFullExit() {
  if (!video_player.classList.contains("openFullScreen")) {
    video_player.classList.add("openFullScreen");
    fullscreen.innerHTML = "fullscreen_exit";
    video_player.requestFullscreen();
  } else {
    video_player.classList.remove("openFullScreen");
    fullscreen.innerHTML = "fullscreen";
    document.exitFullscreen();
  }
}

fullscreen.addEventListener("click", () => {
  setScreenFullExit();
});

document.addEventListener('fullscreenchange', (e) => {
  // check whether the screen is in full screen mode or not
  if (document.fullscreenElement) {
    video_player.classList.add("openFullScreen");
    fullscreen.innerHTML = "fullscreen_exit";
  } else {
    video_player.classList.remove("openFullScreen");
    fullscreen.innerHTML = "fullscreen";
  }
});

// Open settings
settingsBtn.addEventListener("click", () => {
  settings.classList.toggle("active");
  settingsBtn.classList.toggle("active");
});

// Playback Rate
playback.forEach((event) => {
  event.addEventListener("click", () => {
    removeActiveClasses(playback);
    event.classList.add("active");
    let speed = event.getAttribute("data-speed");
    mainVideo.playbackRate = speed;
  });
});

function removeActiveClasses(e) {
  e.forEach((event) => {
    event.classList.remove("active");
  });
}

//  blob url
let mainVideoSources = mainVideo.querySelectorAll("source");
for (let i = 0; i < mainVideoSources.length; i++) {
  let videoUrl = mainVideoSources[i].src;
  blobUrl(mainVideoSources[i], videoUrl);
}

function blobUrl(video, videoUrl) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", videoUrl);
  xhr.responseType = "arraybuffer";
  xhr.onload = (e) => {
    let blob = new Blob([xhr.response]);
    let url = URL.createObjectURL(blob);
    video.src = url;
  };
  xhr.send();
}

video_player.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

let inactivityTime = function() {
  let time;
  window.onload = resetTimer;
  video_player.onmouseenter = resetTimer;
  video_player.onmousemove = resetTimer;
  function hideControls() {
    if (video_player.classList.contains("playing")) {
      if (settingsBtn.classList.contains("active")) {
        controls.classList.add("active");
      } else {
        controls.classList.remove("active");
      }
    } else {
      controls.classList.add("active");
    }
  }
  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(hideControls, 4000)
  }
};

// Mouse move controls
video_player.addEventListener("mouseenter", () => {
  inactivityTime();
  controls.classList.add("active");
});

video_player.addEventListener("mousemove", () => {
  controls.classList.add("active");
});

video_player.addEventListener("mouseleave", () => {
  inactivityTime();
  if (video_player.classList.contains("playing")) {
    if (settingsBtn.classList.contains("active")) {
      controls.classList.add("active");
    } else {
      controls.classList.remove("active");
    }
  } else {
    controls.classList.add("active");
  }
});

if (video_player.classList.contains("playing")) {
  if (
    settingsBtn.classList.contains("active")
  ) {
    controls.classList.add("active");
  } else {
    controls.classList.remove("active");
  }
} else {
  controls.classList.add("active");
}

if (window.innerWidth <= 500 || window.innerHeight <= 560) {
  video_player.style.height = `${window.innerHeight}px`;
  video_player.style.width = `${window.innerWidth}px`;
}

function reportWindowSize() {
  if (window.innerWidth <= 500 || window.innerHeight <= 560) {
    video_player.style.height = `${window.innerHeight}px`;
    video_player.style.width = `${window.innerWidth}px`;
  }
  else {
    video_player.style.height = "";
    video_player.style.width = "";
  }
}

window.addEventListener('resize', reportWindowSize);

// mobile touch controls
video_player.addEventListener("touchstart", () => {
    controls.classList.add("active");
  }, { passive: true }
);

video_player.addEventListener("touchmove", () => {
  controls.classList.add("active");
  }, { passive: true }
);

mainVideo.addEventListener("touchend", () => {
  controls.classList.add("active");
  setTimeout(() => {
    controls.classList.remove("active");
  }, 8000);
  }, { passive: true }
);

//  Video Preview
var thumbnails = [];

var thumbnailWidth = 158;
var thumbnailHeight = 90;
var horizontalItemCount = 5;
var verticalItemCount = 5;

let preview_video = document.createElement('video')
preview_video.preload = "metadata";
preview_video.width = "500";
preview_video.height = "300"
preview_video.controls = true;
preview_video.src = mainVideo.querySelector("source").src;
preview_video.addEventListener("loadeddata", async function () {
  preview_video.pause();
  var count = 1;
  var id = 1;
  var x = 0, y = 0;
  var array = [];
  var duration = parseInt(preview_video.duration);

  // if duration is greater than 900 then don't create thumbnails
  if (duration <= 900 && isMobile() == false) {
    for (var i = 1; i <= duration; i++) {
      array.push(i);
    }
    var canvas;
    var i, j;
    for (i = 0, j = array.length; i < j; i += horizontalItemCount) {
      for (var startIndex of array.slice(i, i + horizontalItemCount)) {
        var backgroundPositionX = x * thumbnailWidth;
        var backgroundPositionY = y * thumbnailHeight;
        var item = thumbnails.find((x) => x.id === id);
  
        if (!item) {  
          canvas = document.createElement("canvas");
          canvas.width = thumbnailWidth * horizontalItemCount;
          canvas.height = thumbnailHeight * verticalItemCount;
          thumbnails.push({
            id: id,
            canvas: canvas,
            sec: [
              {
                index: startIndex,
                backgroundPositionX: -backgroundPositionX,
                backgroundPositionY: -backgroundPositionY,
              },
            ],
          });
        } else {
          canvas = item.canvas;
          item.sec.push({
            index: startIndex,
            backgroundPositionX: -backgroundPositionX,
            backgroundPositionY: -backgroundPositionY,
          });
        }
        var context = canvas.getContext("2d");
        preview_video.currentTime = startIndex;
        
        await new Promise(function (resolve) {
          var event = function () {
            context.drawImage(
              preview_video,
              backgroundPositionX,
              backgroundPositionY,
              thumbnailWidth,
              thumbnailHeight
            );
            x++;
            // removing duplicate events
            preview_video.removeEventListener("canplay", event);
            resolve();
          };
          preview_video.addEventListener("canplay", event);
        });
  
        // 1 thumbnail is generated completely
        count++;
      }
      // reset x coordinate
      x = 0;
      // increase y coordinate
      y++;
      // checking for overflow
      if (count > horizontalItemCount * verticalItemCount) {
        count = 1;
        x = 0;
        y = 0;
        id++;
      }
    }
  
    // looping through thumbnail list to update thumbnail
    thumbnails.forEach(function (item) {
      // converting canvas to blob to get short url
      item.canvas.toBlob(
        (blob) => (item.data = URL.createObjectURL(blob)),
        "image/webp"
      );
      // deleting unused property
      delete item.canvas;
    });
  
    console.log("Video Processing Done...!");
  }

});