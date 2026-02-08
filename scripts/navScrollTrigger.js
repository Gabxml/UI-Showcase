// navScrollTrigger.js
export function initNavScrollTrigger() {
    function setup() {
        const header = document.getElementById("header");

        if (!header) {
            console.error("Header not found");
            return;
        }

        // Get the height of the landing section (viewport height usually)
        const landingHeight = window.innerHeight;

        function handleScroll() {
            const scrollY = window.scrollY;

            // If scrolled past the landing section height
            if (scrollY > landingHeight) {
                // Blurred background with light text
                header.style.backgroundColor = "rgba(43, 63, 245, 0.01)"; // 10% opacity of accent color
                header.style.backdropFilter = "blur(10px)";
                header.style.webkitBackdropFilter = "blur(10px)"; // Safari support
                header.style.color = "var(--background-color)";

                // Update nav links and logo color to light
                const navLinks = header.querySelectorAll(".nav-link");
                const hamburgerLines = header.querySelectorAll(".hamburger-line");
                const logoPath = header.querySelector("svg path");

                navLinks.forEach((link) => {
                    link.style.color = "var(--background-color)";
                });

                hamburgerLines.forEach((line) => {
                    line.style.backgroundColor = "var(--background-color)";
                });

                if (logoPath) {
                    logoPath.style.fill = "var(--primary-color)";
                }

                header.classList.add("scrolled");
            } else {
                // Transparent background (on landing)
                header.style.backgroundColor = "transparent";
                header.style.backdropFilter = "none";
                header.style.webkitBackdropFilter = "none";
                header.style.color = "var(--accent-color)";

                // Keep nav links and logo in accent color
                const navLinks = header.querySelectorAll(".nav-link");
                const hamburgerLines = header.querySelectorAll(".hamburger-line");
                const logoPath = header.querySelector("svg path");

                navLinks.forEach((link) => {
                    link.style.color = "var(--accent-color)";
                });

                hamburgerLines.forEach((line) => {
                    line.style.backgroundColor = "var(--accent-color)";
                });

                if (logoPath) {
                    logoPath.style.fill = "var(--accent-color)";
                }

                header.classList.remove("scrolled");
            }
        }

        // Listen to scroll events
        window.addEventListener("scroll", handleScroll);

        // Run once on load
        handleScroll();
    }

    // Wait for header to be loaded
    if (document.getElementById("header")) {
        setup();
    } else {
        document.addEventListener("header:loaded", setup, { once: true });
    }
}