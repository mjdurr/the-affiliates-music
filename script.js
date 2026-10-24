const playButtons = document.querySelectorAll(".play-button[data-audio]");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function resetPlayer(button, audio, resetAudio = true) {
  button.textContent = "▶";
  button.classList.remove("playing");

  const songCard = button.closest(".song-card");

  if (songCard) {
    songCard.classList.remove("playing");
  }

  if (resetAudio) {
    audio.currentTime = 0;
  }
}

playButtons.forEach((button) => {
  const audioId = button.dataset.audio;
  const audio = document.getElementById(audioId);

  if (!audio) return;

  const songCard = button.closest(".song-card");

  const progressTrack = songCard?.querySelector(
    `[data-progress="${audioId}"]`
  );

  const progressFill = progressTrack?.querySelector(".progress-fill");
  const currentTimeDisplay = songCard?.querySelector(".current-time");
  const durationDisplay = songCard?.querySelector(".duration");


  // ==========================================
  // LOAD SONG DURATION
  // ==========================================

  audio.addEventListener("loadedmetadata", () => {
    if (durationDisplay) {
      durationDisplay.textContent = formatTime(audio.duration);
    }
  });


  // ==========================================
  // PLAY / PAUSE
  // ==========================================

  button.addEventListener("click", () => {

    if (audio.paused) {

      // Stop every other song
      playButtons.forEach((otherButton) => {
        const otherAudioId = otherButton.dataset.audio;
        const otherAudio = document.getElementById(otherAudioId);

        if (otherAudio && otherAudio !== audio) {
          otherAudio.pause();
          resetPlayer(otherButton, otherAudio);

          const otherCard = otherButton.closest(".song-card");
          const otherFill = otherCard?.querySelector(".progress-fill");
          const otherTime = otherCard?.querySelector(".current-time");

          if (otherFill) {
            otherFill.style.width = "0%";
          }

          if (otherTime) {
            otherTime.textContent = "0:00";
          }
        }
      });

      audio.play();

      button.textContent = "❚❚";
      button.classList.add("playing");

      if (songCard) {
        songCard.classList.add("playing");
      }

    } else {

      audio.pause();

      button.textContent = "▶";
      button.classList.remove("playing");

      if (songCard) {
        songCard.classList.remove("playing");
      }

    }

  });


  // ==========================================
  // UPDATE PROGRESS + TIMER
  // ==========================================

  audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    const progress =
      (audio.currentTime / audio.duration) * 100;

    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }

    if (currentTimeDisplay) {
      currentTimeDisplay.textContent =
        formatTime(audio.currentTime);
    }

  });


  // ==========================================
  // CLICK PROGRESS BAR TO SEEK
  // ==========================================

  if (progressTrack) {

    progressTrack.addEventListener("click", (event) => {

      if (!audio.duration) return;

      const rectangle =
        progressTrack.getBoundingClientRect();

      const clickPosition =
        event.clientX - rectangle.left;

      const percentage =
        clickPosition / rectangle.width;

      audio.currentTime =
        percentage * audio.duration;

    });

  }


  // ==========================================
  // SONG FINISHED
  // ==========================================

  audio.addEventListener("ended", () => {

    resetPlayer(button, audio);

    if (progressFill) {
      progressFill.style.width = "0%";
    }

    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = "0:00";
    }

  });

});
