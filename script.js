const playButtons = document.querySelectorAll(".play-button[data-audio]");

playButtons.forEach((button) => {
  const audioId = button.dataset.audio;
  const audio = document.getElementById(audioId);

  if (!audio) return;

  button.addEventListener("click", () => {

    if (audio.paused) {

      // Stop any other song that is currently playing
      document.querySelectorAll("audio").forEach((otherAudio) => {
        if (otherAudio !== audio) {
          otherAudio.pause();
          otherAudio.currentTime = 0;
        }
      });

      // Reset the other play buttons
      playButtons.forEach((otherButton) => {
        otherButton.textContent = "▶";
        otherButton.classList.remove("playing");
      });

      // Play selected song
      audio.play();

      button.textContent = "❚❚";
      button.classList.add("playing");

    } else {

      // Pause selected song
      audio.pause();

      button.textContent = "▶";
      button.classList.remove("playing");

    }

  });

  // Reset button when preview finishes
  audio.addEventListener("ended", () => {
    button.textContent = "▶";
    button.classList.remove("playing");
    audio.currentTime = 0;
  });
});
