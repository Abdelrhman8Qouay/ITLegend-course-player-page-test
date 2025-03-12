
// ============================== Separated Logic
function initializeVideoPlayer() {
    const coursePlayer = document.querySelector(".course-player");
    const playFloat = document.getElementById("play-float");
    const playBtn = document.getElementById("play-btn");
    const volumeBtn = document.getElementById("volume-btn");
    const volumeSlider = document.getElementById("volume-slider");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const timeDisplay = document.getElementById("time-display");
    const videoEle = document.querySelector(".course-player .player-video .screen video");
    const videoCover = document.querySelector(".course-player .player-video .screen .cover");
    const progressBar = document.getElementById("progress-bar");
    const courseName = document.querySelector(".course-name");

    let isPlaying = false;
    let isMuted = false;

    // Array of video sources and posters
    const videos = [
        ['html-in-100-seconds.mp4', 'html-in-100-seconds.png', 'Learning HTML in 100 secondes'],
        ['nuxt-in-100-seconds.mp4', 'nuxt-in-100-seconds.png', 'Learning Nuxt.js in 100 secondes']
    ];

    let currentVideoIndex = 0; // Track the current video index

    // Function to load a video by index
    const loadVideo = (index) => {
        if (index >= 0 && index < videos.length) {
            const [src, poster, name] = videos[index];
            videoEle.src = `./assets/videos/${src}`;
            videoEle.poster = `./assets/videos/${poster}`;
            videoEle.load(); // Load the new video
            currentVideoIndex = index; // Update the current index
            courseName.innerHTML = name; // Change the course name dynamically
        }
    };

    // Load the first video on page load
    loadVideo(currentVideoIndex);

    // ----------------------------- Toggle Play/Pause
    const playOnClick = () => {
        if (!videoEle) return;

        isPlaying = videoEle.paused;
        isPlaying ? videoEle.play() : videoEle.pause();

        toggleClass(coursePlayer, "active", isPlaying);
        updateIcons();
    };

    videoEle?.addEventListener("click", () => playOnClick());
    videoCover?.addEventListener("click", () => playOnClick());
    playFloat?.addEventListener("click", () => playOnClick());
    playBtn?.addEventListener("click", () => playOnClick());

    // Handle video end event
    videoEle?.addEventListener("ended", () => {
        isPlaying = false;
        removeClass(coursePlayer, "active");
        updateIcons();

        // Move to the next video
        const nextIndex = (currentVideoIndex + 1) % videos.length; // Loop back to 0 if at the end
        loadVideo(nextIndex);

        // Play the next video automatically
        videoEle.play();
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
            videoEle.volume = parseFloat(event.target.value);
        }
    });

    // ----------------------------- Update time display and progress bar
    videoEle?.addEventListener("timeupdate", () => {
        if (timeDisplay && videoEle) {
            timeDisplay.textContent = `${formatDuration(
                videoEle.currentTime
            )} / ${formatDuration(videoEle.duration)}`;
        }

        if (progressBar && videoEle) {
            const progress = (videoEle.currentTime / videoEle.duration) * 100;
            progressBar.value = progress;
            const progressStyle = (progressBar.value - progressBar.min) / (progressBar.max - progressBar.min) * 100 + '%';
            progressBar.style.setProperty('--progress', progressStyle);
        }
    });

    // ----------------------------- Seek video using progress bar
    progressBar?.addEventListener("input", (event) => {
        if (videoEle) {
            const progress = (event.target.value - event.target.min) / (event.target.max - event.target.min) * 100 + '%';
            event.target.style.setProperty('--progress', progress);
            const seekTime = (event.target.value / 100) * videoEle.duration;
            videoEle.currentTime = seekTime;
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

    // Sticky Effect when Mid or Small Screens
    if (!coursePlayer) return;

    const playerOffset = coursePlayer.offsetTop;

    function toggleSticky() {
        // Check screen width before applying effect
        if (window.matchMedia("(max-width: 746px)").matches) {
            if (window.scrollY > playerOffset) {
                coursePlayer.style.position = "fixed";
                coursePlayer.style.top = "-14px";
                coursePlayer.style.left = "-3%";
                coursePlayer.style.width = `${coursePlayer.offsetWidth}px`; // Prevent layout shift
                coursePlayer.style.zIndex = "1000";
            } else {
                coursePlayer.style.position = "relative";
                coursePlayer.style.width = "104svw";
                coursePlayer.style.top = "auto";
                coursePlayer.style.left = "-9%";
            }
        } else {
            // Reset styles when width is larger than 746px
            coursePlayer.style.position = "relative";
            coursePlayer.style.top = "auto";
            coursePlayer.style.width = "";
        }
    }

    // Attach scroll listener
    window.addEventListener("scroll", toggleSticky);

    // Run once on load to check if the effect should apply immediately
    toggleSticky();

    // Initialize icons on load
    updateIcons();
}

// ============================== Progress Logic
function initializeProgressLogic() {
    const progressBar = document.querySelector(".course-progress .progress-bar");
    const indicator = document.querySelector(".course-progress .ind");
    const valueDisplay = document.querySelector(".course-progress .val");

    let startValue = 0; // Start value
    const endValue = 63; // Target progress percentage
    const duration = 1500; // Animation duration (ms)
    const startTime = performance.now(); // Track animation start time

    // Easing function for smooth animation
    function easeOutQuad(t) {
        return t * (2 - t);
    }

    function updateProgress(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Normalize progress (0 to 1)
        const easedProgress = easeOutQuad(progress); // Apply easing function

        const currentValue = Math.floor(easedProgress * endValue); // Calculate current value

        // Update DOM elements
        progressBar.style.width = `${currentValue}%`;
        indicator.style.left = `${currentValue}%`;
        valueDisplay.style.left = `${currentValue}%`;
        valueDisplay.textContent = `${currentValue}%`;

        // Continue animation until target is reached
        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        }
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Element is in viewport, start the animation
                    requestAnimationFrame(updateProgress);
                    observer.unobserve(progressBar); // Stop observing after triggering
                }
            });
        },
        { threshold: 0.5 } // Trigger when 50% of progressBar is visible
    );

    observer.observe(progressBar);
}

// ============================== Course Materials Logic
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

// ============================== Collapsible Sections Logic
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

// ============================== Comments Logic
function initializeComments() {
    const comments = [
        {
            avatar: "avatar3.png",
            name: "Student Name Goes Here",
            date: "Oct 1, 2021",
            text: "Lorem Aime set Emet, erehtae Adecture Adfkjdddfjdkj ajdf j jka jdf jka jdfkj kjfkjadfkjdksf jajk jdlk jalkdfd",
        },
        {
            avatar: "avatar3.png",
            name: "Student Name Goes Here",
            date: "Oct 1, 2021",
            text: "Lorem Aime set Emet, erehtae Adecture Adfkjdddfjdkj ajdf j jka jdf jka jdfkj kjfkjadfkjdksf jajk jdlk jalkdfd",
        },
        {
            avatar: "avatar1.png",
            name: "Student Name Maer ERar",
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
                    <img src="./assets/images/avatars/${comment.avatar}" alt="user avatar">
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

// ============================== Section Services Logic
function initializeSectionServices() {
    const curriculumBtn = document.querySelector('.section-services button[title="Curriculm"]');
    const commentsBtn = document.querySelector('.section-services button[title="comments"]');
    const askQuestionBtn = document.querySelector('.section-services button[title="Ask a question"]');
    const leaderboardBtn = document.querySelector('.section-services button[title="Leaderboard"]');

    const availableResourcesSection = document.querySelector('.available-resources');
    const commentsSection = document.querySelector('.comments-part');

    const askQuestionPopup = document.getElementById('ask-question-popup');
    const leaderboardPopup = document.getElementById('leaderboard-popup');
    const closeAskPopup = document.getElementById('close-ask-popup');
    const closeLeaderboardPopup = document.getElementById('close-leaderboard-popup');

    // Scroll to Curriculum Section
    curriculumBtn?.addEventListener('click', () => {
        availableResourcesSection?.scrollIntoView({ behavior: 'smooth' });
    });

    // Scroll to Comments Section
    commentsBtn?.addEventListener('click', () => {
        commentsSection?.scrollIntoView({ behavior: 'smooth' });
    });

    // Open Ask Question Popup
    askQuestionBtn?.addEventListener('click', () => {
        askQuestionPopup.classList.add('active');
    });

    // Open Leaderboard Popup
    leaderboardBtn?.addEventListener('click', () => {
        leaderboardPopup.classList.add('active');
        initializeLeaderboard(); // Load leaderboard data
    });

    // Close Popups
    closeAskPopup?.addEventListener('click', () => {
        askQuestionPopup.classList.remove('active');
    });

    closeLeaderboardPopup?.addEventListener('click', () => {
        leaderboardPopup.classList.remove('active');
    });

    // Close Popups on Outside Click
    window.addEventListener('click', (event) => {
        if (event.target === askQuestionPopup) {
            askQuestionPopup.classList.remove('active');
        }
        if (event.target === leaderboardPopup) {
            leaderboardPopup.classList.remove('active');
        }
    });
}

// ============================== Leaderboard Logic
function initializeLeaderboard() {
    const leaderboardList = document.querySelector('.leaderboard-list');

    // Dummy leaderboard data
    const leaderboardData = [
        { avatar: 'avatar1.png', name: 'Student 1', score: 95 },
        { avatar: 'avatar2.png', name: 'Student 2', score: 90 },
        { avatar: 'avatar3.png', name: 'Student 3', score: 85 },
        { avatar: 'avatar1.png', name: 'Student 1', score: 95 },
        { avatar: 'avatar2.png', name: 'Student 2', score: 90 },
        { avatar: 'avatar3.png', name: 'Student 3', score: 85 },
        { avatar: 'avatar1.png', name: 'Student 1', score: 95 },
        { avatar: 'avatar2.png', name: 'Student 2', score: 90 },
        { avatar: 'avatar3.png', name: 'Student 3', score: 85 },
    ];

    if (leaderboardList) {
        leaderboardList.innerHTML = ''; // Clear existing content

        leaderboardData.forEach((student) => {
            const leaderboardItem = document.createElement('div');
            leaderboardItem.className = 'leaderboard-item';

            leaderboardItem.innerHTML = `
                <div class="avatar">
                    <img src="./assets/images/avatars/${student.avatar}" alt="${student.name}">
                </div>
                <div class="name">${student.name}</div>
                <div class="score">${student.score}%</div>
            `;

            leaderboardList.appendChild(leaderboardItem);
        });
    }
}

// ============================== Full-screen Exam
function initializeExamLogic(swiper) {
    const examPopup = document.getElementById("examPopup");
    const courseExamViewBtn = document.getElementById("CourseExamView");
    const statusBallsContainer = document.getElementById("statusBallsContainer");
    const timerDisplay = document.querySelector(".timer span");
    const closeExam = document.getElementById("closeExam");
    const swiperContainer = document.querySelector(".mySwiper");

    // Exam Status
    const questions = [
        { text: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "B" },
        { text: "What is the capital of France?", options: ["Rome", "London", "Paris", "Berlin"], answer: "C" },
        { text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "B" },
        { text: "What is the square root of 16?", options: ["2", "4", "6", "8"], answer: "B" },
        { text: "Which element has the chemical symbol O?", options: ["Oxygen", "Gold", "Silver", "Iron"], answer: "A" }
    ];

    let currentQuestionIndex = 0;
    let examTimer = 600; // 10 minutes in seconds
    let intervalTime = null;

    if (!swiperContainer) {
        console.error("Swiper container '.mySwiper' not found!");
        return;
    }

    // Load all questions into Swiper slides
    function loadQuestions() {
        swiperContainer.innerHTML = ""; // Clear existing slides

        questions.forEach((question, index) => {
            // Create a new slide
            const slide = document.createElement("swiper-slide");
            slide.classList.add("slide");

            // Add question text
            const questionText = document.createElement("p");
            questionText.textContent = question.text;
            slide.appendChild(questionText);

            // Add answer options
            const answersContainer = document.createElement("div");
            answersContainer.classList.add("answers");

            question.options.forEach((option, i) => {
                const radioItem = document.createElement("div");
                radioItem.classList.add("radio-item");

                const radioInput = document.createElement("input");
                radioInput.type = "radio";
                radioInput.name = `answer-${index}`; // Unique name for each question
                radioInput.id = `radio-${index}-${i}`;
                radioInput.value = String.fromCharCode(65 + i); // A, B, C, D, etc.

                const radioLabel = document.createElement("label");
                radioLabel.htmlFor = `radio-${index}-${i}`;
                radioLabel.textContent = `${String.fromCharCode(65 + i)}) ${option}`;

                radioItem.appendChild(radioInput);
                radioItem.appendChild(radioLabel);
                answersContainer.appendChild(radioItem);
            });

            slide.appendChild(answersContainer);
            swiperContainer.appendChild(slide);
        });

        // Update status balls
        updateStatusBalls();
    }

    // Update status balls (question indicators)
    function updateStatusBalls() {
        statusBallsContainer.innerHTML = ""; // Clear existing balls

        questions.forEach((_, index) => {
            const ball = document.createElement("div");
            ball.classList.add("ball");
            ball.textContent = index + 1;

            if (index === currentQuestionIndex) {
                ball.classList.add("active");
            }

            statusBallsContainer.appendChild(ball);
        });
    }

    // Update the timer display
    function updateTimer() {
        let minutes = Math.floor(examTimer / 60);
        let seconds = examTimer % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        examTimer--;

        if (examTimer < 0) {
            alert("Time's up! Submitting exam.");
            closeExamPopup();
            clearExam();
        }
    }

    // Open the exam popup
    function openExamPopup() {
        examPopup.classList.add("active");
        loadQuestions();
        swiper.slideTo(currentQuestionIndex); // Start at the first question
        updateStatusBalls();
        intervalTime = setInterval(updateTimer, 1000);
    }

    // Close the exam popup
    function closeExamPopup() {
        examPopup.classList.remove("active");
        clearInterval(intervalTime);
    }

    // Reset exam state
    function clearExam() {
        currentQuestionIndex = 0;
        examTimer = 600;
        intervalTime = null;
        nextQuestion.disabled = false;
    }

    // Move to the next question
    function nextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            swiper.slideTo(currentQuestionIndex); // Move to the next slide
            updateStatusBalls();
        } else {
            alert("You have completed the exam!");
            closeExamPopup();
            clearExam();
        }
    }

    // Open and close exam popup
    courseExamViewBtn?.addEventListener("click", openExamPopup);
    closeExam?.addEventListener("click", closeExamPopup);
}

// ============================== Execute the Logic
document.addEventListener('DOMContentLoaded', () => {
    initializeVideoPlayer();
    initializeProgressLogic();
    initializeCourseMaterials();
    initializeCollapsible();
    initializeComments();
    initializeSectionServices(); // Initialize section services
});


// ============================== Utility Functions
// Helper function to format time (e.g., 125 -> "02:05")
function formatDuration(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
// Class Helper functions
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