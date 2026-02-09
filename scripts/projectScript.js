document.addEventListener('DOMContentLoaded', () => {
    // DOM element references for gallery functionality
    const galleryThumbs = document.querySelectorAll('.galleryThumb');  // All thumbnail links that open the gallery
    const imageModal = document.getElementById('imageModal');          // The modal container element
    const modalOverlay = document.getElementById('modalOverlay');      // Overlay background behind modal
    const modalCloseBtn = document.getElementById('modalCloseBtn');    // Close button in modal
    const verticalGallery = document.getElementById('verticalGallery');// Scrollable gallery container
    const verticalInner = document.getElementById('verticalInner');    // Container for gallery images

    // State variables for gallery management
    let currentIndex = 0;       // Tracks current image index in gallery
    let currentImages = [];     // Array of image URLs for current gallery
    let lastFocusedElement = null; // Stores element that had focus before modal opened (for accessibility)

    /**
     * DATA PARSING: Convert comma-separated string to array of image URLs
     * @param {string} dataString - Comma-separated image paths
     * @returns {Array} - Cleaned array of image URLs
     */
    function parseGalleryData(dataString) {
        if (!dataString) return []; // Return empty array if no data
        return dataString.split(',').map(s => s.trim()).filter(Boolean);
    }

    /**
     * LABEL FORMATTING: Extract readable label from image file path
     * Converts filenames like "admin-dashboard.png" to "admin dashboard"
     * @param {string} path - Image file path
     * @returns {string} - Formatted display label
     */
    function formatLabelFromPath(path) {
        const file = path.split('/').pop() || path; // Get filename only
        const name = file.replace(/\.[^/.]+$/, ''); // Remove file extension
        return name.replace(/[_\-]/g, ' ').replace(/\d+/g, '').trim(); // Convert underscores/dashes to spaces, remove numbers
    }

    /**
     * GALLERY CONSTRUCTION: Build vertical slideshow with images and labels
     * @param {Array} images - Array of image URLs to display
     */
    function buildVerticalSlides(images) {
        verticalInner.innerHTML = ''; // Clear previous gallery content
        
        images.forEach((src, i) => {
            // Create slide container
            const slide = document.createElement('div');
            slide.className = 'carouselItem';

            // Create image element
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Gallery image ${i + 1} - ${formatLabelFromPath(src)}`;
            img.loading = 'lazy'; // Lazy load for performance

            // Create label for image
            const label = document.createElement('div');
            label.className = 'photoLabel';
            label.textContent = formatLabelFromPath(src) || `Photo ${i + 1}`;

            // Assemble slide
            slide.appendChild(img);
            slide.appendChild(label);
            verticalInner.appendChild(slide);
        });
    }

    /**
     * MODAL OPENING: Display modal with gallery images
     * @param {Array} images - Array of image URLs to display
     * @param {number} startIndex - Initial image to show (default: 0)
     */
    function openModal(images, startIndex = 0) {
        if (!images || images.length === 0) {
            console.warn('No images to display in gallery');
            return;
        }
        
        currentImages = images; // Store current images
        buildVerticalSlides(images); // Build gallery content

        // Accessibility: Save last focused element before modal opens
        lastFocusedElement = document.activeElement;
        imageModal.classList.add('open'); // Show modal
        imageModal.setAttribute('aria-hidden', 'false'); // Accessibility update
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // After modal is shown, scroll to starting image and focus gallery for keyboard navigation
        requestAnimationFrame(() => {
            currentIndex = Math.min(Math.max(0, startIndex), images.length - 1);
            scrollToIndex(currentIndex, false); // Scroll to starting image
            verticalGallery.focus(); // Set focus for keyboard navigation
        });

        // Add keyboard event listener for modal navigation
        document.addEventListener('keydown', onDocumentKeyDown);
    }

    /**
     * MODAL CLOSING: Hide modal and clean up
     */
    function closeModal() {
        imageModal.classList.remove('open');
        imageModal.setAttribute('aria-hidden', 'true');
        verticalInner.innerHTML = ''; // Clear gallery content
        currentImages = []; // Reset current images
        currentIndex = 0; // Reset index
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove keyboard event listeners
        document.removeEventListener('keydown', onDocumentKeyDown);
        
        // Accessibility: Return focus to element that opened the modal
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    /**
     * SCROLLING: Scroll gallery to specific image index
     * @param {number} index - Index of image to scroll to
     * @param {boolean} smooth - Enable smooth scrolling animation (default: true)
     */
    function scrollToIndex(index, smooth = true) {
        const item = verticalInner.children[index];
        if (!item) return;
        
        // Calculate position to center the image in viewport
        const top = item.offsetTop - (verticalGallery.clientHeight - item.clientHeight) / 2;
        verticalGallery.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
    }

    /**
     * IMAGE DETECTION: Find which image is currently centered in viewport
     * Used for updating currentIndex during user scrolling
     * @returns {number} - Index of nearest centered image
     */


    /**
     * NAVIGATION: Go to previous image in gallery
     */
    function goPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToIndex(currentIndex);
        } else {
            scrollToIndex(0); // Already at first image
        }
    }

    /**
     * NAVIGATION: Go to next image in gallery
     */
    function goNext() {
        if (currentIndex < verticalInner.children.length - 1) {
            currentIndex++;
            scrollToIndex(currentIndex);
        }
    }

    /**
     * KEYBOARD EVENT HANDLER: Handle keyboard navigation in modal
     * @param {KeyboardEvent} e - Keyboard event
     */
    function onDocumentKeyDown(e) {
        if (e.key === 'Escape') { 
            closeModal(); // Close modal on Escape key
        }
        else if (e.key === 'ArrowUp') { 
            e.preventDefault(); // Prevent page scroll
            goPrev(); // Navigate to previous image
        }
        else if (e.key === 'ArrowDown') { 
            e.preventDefault(); // Prevent page scroll
            goNext(); // Navigate to next image
        }
    }

    // ============================================
    // EVENT LISTENER SETUP
    // ============================================

    /**
     * THUMBNAIL CLICK: Open gallery when thumbnail is clicked
     */
    galleryThumbs.forEach(thumb => {
        // Click event for mouse/touch users
        thumb.addEventListener('click', (ev) => {
            ev.preventDefault(); // Prevent default link behavior
            const images = parseGalleryData(thumb.getAttribute('data-gallery'));
            openModal(images, 0);
        });
        
        // Keyboard event for accessibility (Enter/Space keys)
        thumb.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                const images = parseGalleryData(thumb.getAttribute('data-gallery'));
                openModal(images, 0);
            }
        });
    });

    /**
     * MODAL CLOSE: Close modal when overlay or close button is clicked
     */
    modalOverlay.addEventListener('click', closeModal);
    modalCloseBtn.addEventListener('click', closeModal);

    /**
     * SCROLL DETECTION: Update currentIndex when user scrolls gallery
     * Uses debouncing to improve performance
     */
    let scrollTimeout = null;
    verticalGallery.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const nearest = findNearestIndex();
            if (nearest !== currentIndex) currentIndex = nearest;
        }, 80); // 80ms debounce delay
    });

    /**
     * IMAGE INTERACTION: Toggle zoom on image click in modal
     */
    verticalInner.addEventListener('click', (e) => {
        if (e.target && e.target.tagName === 'IMG') {
            const img = e.target;
            if (img.style.transform && img.style.transform !== '') {
                // Reset zoom if already zoomed
                img.style.transform = '';
                img.style.transition = 'transform 220ms';
            } else {
                // Apply zoom effect
                img.style.transform = 'scale(1.04)';
                img.style.transition = 'transform 220ms';
            }
        }
    });
});