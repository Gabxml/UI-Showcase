document.addEventListener('DOMContentLoaded', () => {

    // DOM ELEMENTS INITIALIZATION

    const galleryThumbs = document.querySelectorAll('.galleryThumb');  // Thumbnail images that open gallery
    const imageModal = document.getElementById('imageModal');          // Main modal container
    const modalOverlay = document.getElementById('modalOverlay');      // Background overlay (closes modal on click)
    const modalCloseBtn = document.getElementById('modalCloseBtn');    // X button to close modal
    const verticalGallery = document.getElementById('verticalGallery');// Scrollable container for gallery images
    const verticalInner = document.getElementById('verticalInner');    // Inner container holding all images

    // STATE MANAGEMENT VARIABLES

    let currentIndex = 0;       // Index of currently viewed image in gallery
    let currentImages = [];     // Array storing URLs of current gallery images
    let lastFocusedElement = null; // Stores element focused before modal opened (accessibility)

    // DATA PROCESSING FUNCTIONS

    // Converts comma-separated string "img1.png, img2.png" to array ["img1.png", "img2.png"]
    function parseGalleryData(dataString) {
        if (!dataString) return [];
        return dataString.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Extracts clean label from filename: "admin-dashboard_01.png" → "admin dashboard"
    function formatLabelFromPath(path) {
        const file = path.split('/').pop() || path;
        const name = file.replace(/\.[^/.]+$/, '');
        return name.replace(/[_\-]/g, ' ').replace(/\d+/g, '').trim();
    }

    // GALLERY CONSTRUCTION FUNCTIONS

    // Builds the gallery by creating DOM elements for each image
    function buildVerticalSlides(images) {
        verticalInner.innerHTML = '';
        
        images.forEach((src, i) => {
            // Create slide container
            const slide = document.createElement('div');
            slide.className = 'carouselItem';

            // Create image element with lazy loading
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Gallery image ${i + 1} - ${formatLabelFromPath(src)}`;
            img.loading = 'lazy';

            // Create label element for the image
            const label = document.createElement('div');
            label.className = 'photoLabel';
            label.textContent = formatLabelFromPath(src) || `Photo ${i + 1}`;

            // Assemble the slide
            slide.appendChild(img);
            slide.appendChild(label);
            verticalInner.appendChild(slide);
        });
    }

    // SCROLL NAVIGATION FUNCTIONS

    // Centers the specified image in the viewport
    function scrollToIndex(index, smooth = true) {
        const item = verticalInner.children[index];
        if (!item) return;
        
        const top = item.offsetTop - (verticalGallery.clientHeight - item.clientHeight) / 2;
        verticalGallery.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
    }

    // MODAL CONTROL FUNCTIONS

    // Opens modal and displays gallery with specified images
    function openModal(images, startIndex = 0) {
        if (!images || images.length === 0) return;
        
        currentImages = images;
        buildVerticalSlides(images);

        // Accessibility: Save current focused element
        lastFocusedElement = document.activeElement;
        imageModal.classList.add('open');
        imageModal.setAttribute('aria-hidden', 'false');
        
        // Prevent scrolling on main page while modal is open
        document.body.style.overflow = 'hidden';

        // Set initial scroll position and focus for keyboard navigation
        requestAnimationFrame(() => {
            currentIndex = Math.min(Math.max(0, startIndex), images.length - 1);
            scrollToIndex(currentIndex, false);
            verticalGallery.focus();
        });

        // Add keyboard navigation listener
        document.addEventListener('keydown', onDocumentKeyDown);
    }

    // Closes modal and resets all states
    function closeModal() {
        imageModal.classList.remove('open');
        imageModal.setAttribute('aria-hidden', 'true');
        verticalInner.innerHTML = '';
        currentImages = [];
        currentIndex = 0;
        
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onDocumentKeyDown);
        
        // Return focus to element that opened the modal (accessibility)
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    // NAVIGATION FUNCTIONS

    // Moves to previous image in gallery
    function goPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToIndex(currentIndex);
        } else {
            scrollToIndex(0);
        }
    }

    // Moves to next image in gallery
    function goNext() {
        if (currentIndex < verticalInner.children.length - 1) {
            currentIndex++;
            scrollToIndex(currentIndex);
        }
    }

    // KEYBOARD EVENT HANDLER

    // Handles keyboard navigation within the modal
    function onDocumentKeyDown(e) {
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'ArrowUp') { 
            e.preventDefault();
            goPrev();
        }
        else if (e.key === 'ArrowDown') { 
            e.preventDefault();
            goNext();
        }
    }

    // IMAGE INTERACTION FUNCTIONS

    // Toggles zoom on image click (scale 1.04x)
    function toggleImageZoom(img) {
        if (img.style.transform && img.style.transform !== '') {
            img.style.transform = '';
            img.style.transition = 'transform 220ms';
        } else {
            img.style.transform = 'scale(1.04)';
            img.style.transition = 'transform 220ms';
        }
    }

    // EVENT LISTENER SETUP
    
    // SECTION 1: Gallery thumbnail click handlers
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', (ev) => {
            ev.preventDefault();
            const images = parseGalleryData(thumb.getAttribute('data-gallery'));
            openModal(images, 0);
        });
        
        // Accessibility: Open gallery with Enter/Space keys
        thumb.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                const images = parseGalleryData(thumb.getAttribute('data-gallery'));
                openModal(images, 0);
            }
        });
    });

    // SECTION 2: Modal close handlers (overlay and X button)
    modalOverlay.addEventListener('click', closeModal);
    modalCloseBtn.addEventListener('click', closeModal);

    // SECTION 3: Image zoom on click
    verticalInner.addEventListener('click', (e) => {
        if (e.target && e.target.tagName === 'IMG') {
            toggleImageZoom(e.target);
        }
    });
});