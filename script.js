const playButtons = document.querySelectorAll(".play-button[data-audio]");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

playButtons.forEach((playButton) => {

  const audioId = playButton.dataset.audio;
  const audio = document.getElementById(audioId);

  if (!audio) return;

  const songCard = playButton.closest(".song-card");
  const progressTrack = songCard.querySelector(".progress-track");
  const progressFill = songCard.querySelector(".progress-fill");
  const currentTimeDisplay = songCard.querySelector(".current-time");
  const durationDisplay = songCard.querySelector(".duration");


  // ==========================================
  // SHOW SONG DURATION
  // ==========================================

  function showDuration() {

    if (Number.isFinite(audio.duration)) {
      durationDisplay.textContent =
        formatTime(audio.duration);
    }

  }

  audio.addEventListener("loadedmetadata", showDuration);
  audio.addEventListener("durationchange", showDuration);

  if (audio.readyState >= 1) {
    showDuration();
  }


  // ==========================================
  // PLAY / PAUSE
  // ==========================================

  playButton.addEventListener("click", async () => {

    if (audio.paused) {

      // Stop any other song currently playing
      playButtons.forEach((otherButton) => {

        if (otherButton === playButton) return;

        const otherAudioId = otherButton.dataset.audio;
        const otherAudio =
          document.getElementById(otherAudioId);

        if (!otherAudio) return;

        otherAudio.pause();

        otherButton.textContent = "▶";
        otherButton.classList.remove("playing");

        const otherCard =
          otherButton.closest(".song-card");

        otherCard.classList.remove("playing");

      });


      // Play selected song
      try {

        await audio.play();

        playButton.textContent = "❚❚";
        playButton.classList.add("playing");
        songCard.classList.add("playing");

      } catch (error) {

        console.error(
          `Could not play ${audioId}:`,
          error
        );

      }

    } else {

      audio.pause();

      playButton.textContent = "▶";
      playButton.classList.remove("playing");
      songCard.classList.remove("playing");

    }

  });


  // ==========================================
  // UPDATE TIMER + PROGRESS
  // ==========================================

  audio.addEventListener("timeupdate", () => {

    currentTimeDisplay.textContent =
      formatTime(audio.currentTime);

    if (
      Number.isFinite(audio.duration) &&
      audio.duration > 0
    ) {

      const percentage =
        (audio.currentTime / audio.duration) * 100;

      progressFill.style.width =
        `${percentage}%`;

    }

  });


  // ==========================================
  // CLICK PROGRESS BAR TO SEEK
  // ==========================================

  progressTrack.addEventListener("click", (event) => {

    if (!Number.isFinite(audio.duration)) {
      return;
    }

    const rect =
      progressTrack.getBoundingClientRect();

    const position =
      (event.clientX - rect.left) / rect.width;

    audio.currentTime =
      position * audio.duration;

  });


  // ==========================================
  // RESET WHEN SONG ENDS
  // ==========================================

  audio.addEventListener("ended", () => {

    playButton.textContent = "▶";
    playButton.classList.remove("playing");
    songCard.classList.remove("playing");

    progressFill.style.width = "0%";
    currentTimeDisplay.textContent = "0:00";

  });

});
// ==========================================
// MUSIC CATALOG FILTERS
// ==========================================

const filterButtons = document.querySelectorAll(".filter[data-filter]");
const songCards = document.querySelectorAll(".song-card");

function filterSongs(selectedFilter) {

  songCards.forEach((songCard) => {

    const genreElement =
      songCard.querySelector(".song-genre");

    if (!genreElement) return;

    const songGenre =
      genreElement.textContent.trim().toLowerCase();

    const isFeatured =
      songCard.dataset.featured === "true";

    if (selectedFilter === "featured") {

      songCard.style.display =
        isFeatured ? "" : "none";

    } else if (selectedFilter === "all") {

      songCard.style.display = "";

    } else {

      songCard.style.display =
        songGenre === selectedFilter ? "" : "none";

    }

  });

}

filterButtons.forEach((filterButton) => {

  filterButton.addEventListener("click", () => {

    const selectedFilter =
      filterButton.dataset.filter.toLowerCase();

    filterButtons.forEach((button) => {
      button.classList.remove("active");
    });

    filterButton.classList.add("active");

    filterSongs(selectedFilter);

  });

});

// Show Featured songs when the site first loads
filterSongs("featured");
// ==========================================
// SONG INQUIRY FORM
// ==========================================

const inquiryForm = document.querySelector(".inquiry-form");

if (inquiryForm) {

  inquiryForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const submitButton =
      inquiryForm.querySelector('button[type="submit"]');

    const originalButtonText =
      submitButton.textContent;

    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    const formData =
      new FormData(inquiryForm);

    try {

      const response = await fetch(inquiryForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {

        window.location.href = "thanks.html";

      } else {

        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;

        alert(
          "We couldn't send your inquiry. Please try again."
        );

      }

    } catch (error) {

      console.error("Inquiry submission error:", error);

      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;

      alert(
        "We couldn't send your inquiry. Please try again."
      );

    }

  });

}
// ==========================================
// REQUEST FULL DEMO
// ==========================================

const demoRequestButtons =
  document.querySelectorAll(".demo-request");

demoRequestButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const songTitle = button.dataset.song;

    const songSelect =
      document.getElementById("inquiry-song");

    const inquiryType =
      document.getElementById("inquiry-type");

    const contactSection =
      document.getElementById("contact");

    if (songSelect) {
      songSelect.value = songTitle;
    }

    if (inquiryType) {
      inquiryType.value = "Request Full Demo";
    }

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

  });

});
