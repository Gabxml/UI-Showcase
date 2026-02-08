// footer.js
export function loadFooter() {
    const footer = document.getElementById("footer");
    const year = new Date().getFullYear();

    footer.innerHTML = `
    <footer class="footer">
      <div class="footer-container">
        
        <!-- Top Section - Big Bold Statement -->
        <div class="footer-top">
          <h2 class="footer-cta">AC²G</h2>
        </div>
        
        <!-- Middle Section - Navigation Grid -->
        <div class="footer-nav">
          <div class="nav-col">
            <h3 class="nav-title">NAVIGATE</h3>
            <a href="#index-landing" class="nav-link">HOME</a>
            <a href="#index-about" class="nav-link">ABOUT</a>
            <a href="#index-feedback" class="nav-link">FEEDBACK</a>
            <a href="#index-projects" class="nav-link">PROJECTS</a>
            <a href="#index-contact" class="nav-link">CONTACT</a>
          </div>
          
          <div class="nav-col">
            <h3 class="nav-title">CONNECT</h3>
            <a href="https://instagram.com/accg_/" class="nav-link" target="_blank">INSTAGRAM ↗</a>
            <a href="https://linkedin.com/company/accg/" class="nav-link" target="_blank">LINKEDIN ↗</a>
            <a href="https://github.com/accg" class="nav-link" target="_blank">GITHUB ↗</a>
          </div>
          
          <div class="nav-col nav-col-wide">
            <h3 class="nav-title">AC²G LABS</h3>
            <p class="footer-desc">WHERE FORM MEETS FUTURE.</p>
          </div>
        </div>
        
        <!-- Bottom Section - Copyright Bar -->
        <div class="footer-bottom">
          <div class="footer-logo">AC²G</div>
          <div class="footer-copy">© ${year} AC²G LABS. ALL RIGHTS RESERVED.</div>
          <div class="footer-location">PHILIPPINES</div>
        </div>
        
      </div>
    </footer>
  `;
}

// Initialize footer when DOM is loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadFooter);
} else {
    loadFooter();
}

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
    module.exports = { loadFooter };
}

document.dispatchEvent(new Event("footer:loaded"));