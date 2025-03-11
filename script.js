
// ============================== Separated Logic
function initializeVideoPlayer() {
    const coursePlayer = document.querySelector(".course-player");
    const playFloat = document.getElementById("play-float");
    const playBtn = document.getElementById("play-btn");
    const volumeBtn = document.getElementById("volume-btn");
    const volumeSlider = document.getElementById(
        "volume-slider"
    );
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const timeDisplay = document.getElementById("time-display");
    const videoEle = document.querySelector("video");

    let isPlaying = false;
    let isMuted = false;

    // ----------------------------- Toggle Play/Pause
    const playOnClick = () => {
        if (!videoEle) return;

        isPlaying = videoEle.paused;
        isPlaying ? videoEle.play() : videoEle.pause();

        toggleClass(coursePlayer, "active", isPlaying)
        updateIcons();
    }

    videoEle?.addEventListener("click", () => playOnClick());
    playFloat?.addEventListener("click", () => playOnClick());
    playBtn?.addEventListener("click", () => playOnClick());

    // Sync class when video ends
    videoEle?.addEventListener("ended", () => {
        isPlaying = false;
        removeClass(coursePlayer, "active")
        updateIcons();
    });

    // ----------------------------- Toggle Mute
    volumeBtn?.addEventListener("click", () => {
        if (videoEle) {
            videoEle.muted = !videoEle.muted;
            isMuted = videoEle.muted;
            updateIcons();
        }
    });

    // ----------------------------- Adjust Volume
    volumeSlider?.addEventListener("input", (event) => {
        if (videoEle) {
            videoEle.volume = parseFloat((event.target).value);
        }
    });

    // ----------------------------- Update time display
    videoEle?.addEventListener("timeupdate", () => {
        if (timeDisplay && videoEle) {
            timeDisplay.textContent = `${formatDuration(
                videoEle.currentTime
            )} / ${formatDuration(videoEle.duration)}`;
        }
    });

    // ----------------------------- Toggle Fullscreen
    fullscreenBtn?.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            videoEle?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // ----------------------------- Update button icons
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

function initializeProgressLogic() {
    const progressBar = document.querySelector(".course-progress .progress-bar");
    const indicator = document.querySelector(".course-progress .ind");
    const valueDisplay = document.querySelector(".course-progress .val");

    let progress = 0; // Start value
    const endValue = 63; // Target progress percentage
    const duration = 1500; // Animation duration (ms)
    const fps = 60; // Frames per second
    const interval = duration / endValue;

    function updateProgress() {
        if (progress <= endValue) {
            progressBar.style.width = `${progress}%`;
            indicator.style.left = `${progress}%`;
            valueDisplay.style.left = `${progress}%`;
            valueDisplay.textContent = `${progress}%`;

            progress++;
            setTimeout(updateProgress, interval);
        }
    }

    updateProgress();
}

function initializeCourseMaterials() {
    const materials = [
        { icon: "duration.png", title: "Duration", value: "3 Weeks" },
        { icon: "books.png", title: "Lessons", value: "8" },
        { icon: "enrolled.png", title: "Enrolled", value: "65 Students" },
        { icon: "lang.png", title: "Language", value: "English" },
        { icon: "duration.png", title: "Duration", value: "3 Weeks" },
        { icon: "books.png", title: "Lessons", value: "8" },
        { icon: "enrolled.png", title: "Enrolled", value: "65 Students" },
        { icon: "lang.png", title: "Language", value: "English" },
    ];

    const materialsContainer = document.querySelector(".materials .details");

    if (materialsContainer) {
        materials.forEach((material) => {
            const materialItem = document.createElement("div");
            materialItem.className = "info";

            materialItem.innerHTML = `
                <div class="left">
                    <div class="ico">
                        <img src="./assets/icons/${material.icon}">
                    </div>
                    <div class="title">${material.title}:</div>
                </div>
                <div class="val">${material.value}</div>
            `;

            materialsContainer.appendChild(materialItem);
        });
    }
}

function initializeCollapsible() {
    const collapsibleHeaders = document.querySelectorAll(".collapsible__header");

    collapsibleHeaders.forEach((header) => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector(".collapsible__icon");

            if (content.style.maxHeight) {
                content.style.maxHeight = "";
                icon.textContent = "+";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.textContent = "-";
            }
        });
    });
}

function initializeComments() {
    const comments = [
        {
            avatar: "avatar1.jpg",
            name: "Student Name Goes Here",
            date: "Oct 1, 2021",
            text: "Lorem Aime set Emet, erehtae Adecture Adfkjdddfjdkj ajdf j jka jdf jka jdfkj kjfkjadfkjdksf jajk jdlk jalkdfd",
        },
        {
            avatar: "avatar1.jpg",
            name: "Student Name Goes Here",
            date: "Oct 1, 2021",
            text: "Lorem Aime set Emet, erehtae Adecture Adfkjdddfjdkj ajdf j jka jdf jka jdfkj kjfkjadfkjdksf jajk jdlk jalkdfd",
        },
        {
            avatar: "avatar1.jpg",
            name: "Student Name Goes Here",
            date: "Oct 1, 2021",
            text: "Lorem Aime set Emet, erehtae Adecture Adfkjdddfjdkj ajdf j jka jdf jka jdfkj kjfkjadfkjdksf jajk jdlk jalkdfd",
        },
    ];

    const commentsContainer = document.querySelector(".comments");

    if (commentsContainer) {
        comments.forEach((comment) => {
            const commentItem = document.createElement("div");
            commentItem.className = "comment";

            commentItem.innerHTML = `
                <div class="avatar">
                    <img src="/assets/images/avatars/${comment.avatar}" alt="user avatar">
                </div>
                <div class="content">
                    <div class="name">${comment.name}</div>
                    <span class="date">${comment.date}</span>
                    <p>${comment.text}</p>
                </div>
            `;

            commentsContainer.appendChild(commentItem);
        });
    }
}


// ============================== Execute the Logic
document.addEventListener("DOMContentLoaded", () => {
    initializeVideoPlayer();
    initializeProgressLogic();
    initializeCourseMaterials();
    initializeCollapsible();
    initializeComments();
});


// ============================== Util Functions
// Format duration into MM:SS
function formatDuration(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}
function addClass(element, className) {
    if (element && !element.classList.contains(className)) {
        element.classList.add(className);
    }
}
function removeClass(element, className) {
    if (element && element.classList.contains(className)) {
        element.classList.remove(className);
    }
}
function toggleClass(element, className, isTrue) {
    if (element) {
        element.classList.toggle(className, isTrue);
    }
}