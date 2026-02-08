import { loadHeader } from "./header.js";

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadFooter();
    initNavScrollTrigger(); // Add this
});