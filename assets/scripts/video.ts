export function initializeVideoPlayer() {
  const playBtn = document.getElementById("play-btn");
  const volumeBtn = document.getElementById("volume-btn");
  const volumeSlider = document.getElementById(
    "volume-slider"
  ) as HTMLInputElement;
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const timeDisplay = document.getElementById("time-display");
  const videoEle = document.querySelector("video");

  let isPlaying = false;
  let isMuted = false;

  // Toggle Play/Pause
  playBtn?.addEventListener("click", () => {
    if (videoEle?.paused) {
      videoEle.play();
      isPlaying = true;
    } else {
      videoEle?.pause();
      isPlaying = false;
    }
    updateIcons();
  });

  // Toggle Mute
  volumeBtn?.addEventListener("click", () => {
    if (videoEle) {
      videoEle.muted = !videoEle.muted;
      isMuted = videoEle.muted;
      updateIcons();
    }
  });

  // Adjust Volume
  volumeSlider?.addEventListener("input", (event) => {
    if (videoEle) {
      videoEle.volume = parseFloat((event.target as HTMLInputElement).value);
    }
  });

  // Format duration into MM:SS
  function formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  // Update time display
  videoEle?.addEventListener("timeupdate", () => {
    if (timeDisplay && videoEle) {
      timeDisplay.textContent = `${formatDuration(
        videoEle.currentTime
      )} / ${formatDuration(videoEle.duration)}`;
    }
  });

  // Toggle Fullscreen
  fullscreenBtn?.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      videoEle?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  // Update button icons
  function updateIcons() {
    if (playBtn) {
      playBtn.textContent = isPlaying ? "⏸️" : "▶";
    }
    if (volumeBtn) {
      volumeBtn.textContent = isMuted ? "🔇" : "🔊";
    }
  }

  // Initialize icons on load
  updateIcons();
}
