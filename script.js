const playButton = document.querySelector(
  '.play-button[data-audio="like-magic-audio"]'
);

const audio = document.getElementById("like-magic-audio");

const songCard = playButton.closest(".song-card");
const progressTrack = songCard.querySelector(".progress-track");
const progressFill = songCard.querySelector(".progress-fill");
const currentTimeDisplay = songCard.querySelector(".current-time");
const durationDisplay = songCard.querySelector(".duration");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}


// Show duration when audio information loads
function showDuration() {
  if (Number.isFinite(audio.duration)) {
    durationDisplay.textContent = formatTime(audio.duration);
  }
}

audio.addEventListener("loadedmetadata", showDuration);
audio.addEventListener("durationchange", showDuration);

if (audio.readyState >= 1) {
  showDuration();
}


// PLAY / PAUSE
playButton.addEventListener("click", async () => {

  if (audio.paused) {

    try {
      await audio.play();

      playButton.textContent = "❚❚";
      playButton.classList.add("playing");
      songCard.classList.add("playing");

    } catch (error) {
      console.error("Audio could not play:", error);
    }

  } else {

    audio.pause();

    playButton.textContent = "▶";
    playButton.classList.remove("playing");
    songCard.classList.remove("playing");

  }

});


// UPDATE TIMER AND PROGRESS BAR
audio.addEventListener("timeupdate", () => {

  currentTimeDisplay.textContent =
    formatTime(audio.currentTime);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {

    const percentage =
      (audio.currentTime / audio.duration) * 100;

    progressFill.style.width = `${percentage}%`;

  }

});


// CLICK PROGRESS BAR TO MOVE THROUGH SONG
progressTrack.addEventListener("click", (event) => {

  if (!Number.isFinite(audio.duration)) {
    return;
  }

  const rect = progressTrack.getBoundingClientRect();

  const position =
    (event.clientX - rect.left) / rect.width;

  audio.currentTime =
    position * audio.duration;

});


// RESET WHEN SONG ENDS
audio.addEventListener("ended", () => {

  playButton.textContent = "▶";
  playButton.classList.remove("playing");
  songCard.classList.remove("playing");

  progressFill.style.width = "0%";
  currentTimeDisplay.textContent = "0:00";

});
