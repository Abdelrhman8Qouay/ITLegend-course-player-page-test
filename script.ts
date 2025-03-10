import { initializeVideoPlayer } from "./assets/scripts/video";
import { initializeCourseMaterials } from "./assets/scripts/materials";
import { initializeCollapsible } from "./assets/scripts/collapsible";
import { initializeComments } from "./assets/scripts/comments";

document.addEventListener("DOMContentLoaded", () => {
    initializeVideoPlayer();
    initializeCourseMaterials();
    initializeCollapsible();
    initializeComments();
});