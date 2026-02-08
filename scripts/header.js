// header.js

export function loadHeader() {
    const header = document.getElementById("header");

    header.innerHTML = `
    <nav class="z-10 w-full max-w-7xl px-6 flex items-center justify-between">
      <!-- Logo SVG on the left -->
      <a href="#home" class="flex items-center hover:opacity-80 transition-opacity">
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.4548 37.781V29.1392L0 20.5357L1.02812 16.3503H16.4548V1.02812L20.6402 0L29.189 16.3503H37.781C39.0065 16.3503 40 17.3438 40 18.5693C40 19.7948 39.0065 20.7882 37.781 20.7882H31.5095L32.5823 22.8401C33.1501 23.9261 32.73 25.2667 31.644 25.8346C30.558 26.4024 29.2172 25.9824 28.6494 24.8964L26.5015 20.7882H20.8927V26.4516L29.4644 30.9334C30.5504 31.5012 30.9704 32.842 30.4026 33.928C29.8348 35.014 28.4941 35.434 27.4081 34.8662L20.8927 31.4596V37.781C20.8927 39.0065 19.8993 40 18.6738 40C17.4483 40 16.4548 39.0065 16.4548 37.781ZM32.0119 26.5559C33.108 26.0079 34.4409 26.4521 34.9889 27.5482L39.557 36.6843C39.9874 37.5452 39.8138 38.5855 39.127 39.2599C38.4403 39.9343 37.3971 40.089 36.5442 39.6431L31.9761 37.2546C30.8901 36.6868 30.4701 35.3461 31.0379 34.2601C31.3987 33.5701 32.0714 33.149 32.7927 33.0792L31.0196 29.533C30.4715 28.4369 30.9158 27.104 32.0119 26.5559ZM16.4548 24.1313V20.7882H10.061L16.4548 24.1313ZM20.8927 16.3503H24.1811L20.8927 10.0611V16.3503Z" fill="#2B3FF5"/>
</svg>
      </a>

      <!-- Hamburger Menu Button (Mobile only) -->
      <button
        id="hamburger-btn"
        class="md:hidden flex flex-col gap-1.5 p-2 hover:opacity-70 transition-opacity z-20"
        aria-label="Toggle navigation"
        aria-expanded="false"
      >
        <span class="hamburger-line block w-6 h-0.5 transition-all duration-300" style="background-color: var(--accent-color);"></span>
        <span class="hamburger-line block w-6 h-0.5 transition-all duration-300" style="background-color: var(--accent-color);"></span>
        <span class="hamburger-line block w-6 h-0.5 transition-all duration-300" style="background-color: var(--accent-color);"></span>
      </button>

      <!-- Navigation Links (Desktop: inline, Mobile: dropdown) -->
<ul
  id="nav-links"
  class="
    absolute md:static
    top-20 md:top-0
    left-0 md:left-auto
    w-full md:w-auto
    md:flex
    z-100
    flex-col md:flex-row
    items-center
    gap-8
    py-8 md:py-0
    px-6 md:px-0
    opacity-0 md:opacity-100
    pointer-events-none md:pointer-events-auto
    transition-all duration-300
  "
  style="backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); background-color: rgba(43, 63, 245, 0.01);"


        <li>
          <a 
            href="#home" 
            class="nav-link block text-md md:text-base hover:opacity-70 transition-opacity"
            style="color: var(--accent-color); font-family: var(--font-family);"
          >
            Home
          </a>
        </li>
        <li>
          <a 
            href="#projects" 
            class="nav-link block text-md md:text-base hover:opacity-70 transition-opacity"
            style="color: var(--accent-color); font-family: var(--font-family);"
          >
            Projects
          </a>
        </li>
        <li>
          <a 
            href="#about" 
            class="nav-link block text-md md:text-base hover:opacity-70 transition-opacity"
            style="color: var(--accent-color); font-family: var(--font-family);"
          >
            About
          </a>
        </li>
        <li>
          <a 
            href="#contact" 
            class="nav-link block text-md md:text-base hover:opacity-70 transition-opacity"
            style="color: var(--accent-color); font-family: var(--font-family);"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  `;

    // Mobile menu toggle functionality
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");
    const hamburgerLines = hamburgerBtn.querySelectorAll(".hamburger-line");
    let isMenuOpen = false;

    hamburgerBtn.addEventListener("click", () => {
        isMenuOpen = !isMenuOpen;
        hamburgerBtn.setAttribute("aria-expanded", isMenuOpen);

        if (isMenuOpen) {
            // Open menu
            navLinks.classList.remove("opacity-0", "pointer-events-none");
            navLinks.classList.add("opacity-100", "pointer-events-auto");

            // Animate hamburger to X
            hamburgerLines[0].style.transform = "translateY(8px) rotate(45deg)";
            hamburgerLines[1].style.opacity = "0";
            hamburgerLines[2].style.transform = "translateY(-8px) rotate(-45deg)";
        } else {
            // Close menu
            navLinks.classList.add("opacity-0", "pointer-events-none");
            navLinks.classList.remove("opacity-100", "pointer-events-auto");

            // Animate X back to hamburger
            hamburgerLines[0].style.transform = "rotate(0) translateY(0)";
            hamburgerLines[1].style.opacity = "1";
            hamburgerLines[2].style.transform = "rotate(0) translateY(0)";
        }
    });

    // Close menu when clicking on a nav link (mobile)
    const navLinkElements = navLinks.querySelectorAll(".nav-link");
    navLinkElements.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth < 768 && isMenuOpen) {
                hamburgerBtn.click();
            }
        });
    });

    // Close menu when window is resized to desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768 && isMenuOpen) {
            isMenuOpen = false;
            hamburgerBtn.setAttribute("aria-expanded", "false");
            navLinks.classList.add("opacity-0", "pointer-events-none");
            navLinks.classList.remove("opacity-100", "pointer-events-auto");

            hamburgerLines[0].style.transform = "rotate(0) translateY(0)";
            hamburgerLines[1].style.opacity = "1";
            hamburgerLines[2].style.transform = "rotate(0) translateY(0)";
        }
    });
}

// Initialize header when DOM is loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadHeader);
} else {
    loadHeader();
}

// Export for module usage (optional)
if (typeof module !== "undefined" && module.exports) {
    module.exports = { loadHeader };
}

document.dispatchEvent(new Event("header:loaded"));