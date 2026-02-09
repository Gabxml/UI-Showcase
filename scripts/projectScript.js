document.addEventListener('DOMContentLoaded', () => {
    const galleryThumbs = document.querySelectorAll('.galleryThumb');
    const imageModal = document.getElementById('imageModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const verticalGallery = document.getElementById('verticalGallery');
    const verticalInner = document.getElementById('verticalInner');

    let currentIndex = 0;
    let currentImages = [];
    let lastFocusedElement = null;

    // NEW: Check if required elements exist
    if (!imageModal || !modalOverlay || !verticalGallery || !verticalInner) {
        console.warn('Gallery elements not found. Gallery functionality disabled.');
        return;
    }

    function parseGalleryData(dataString) {
        if (!dataString) return [];
        return dataString.split(',').map(s => s.trim()).filter(Boolean);
    }

    function formatLabelFromPath(path) {
        const file = path.split('/').pop() || path;
        const name = file.replace(/\.[^/.]+$/, '');
        return name.replace(/[_\-]/g, ' ').replace(/\d+/g, '').trim();
    }

    function buildVerticalSlides(images) {
        verticalInner.innerHTML = '';
        images.forEach((src, i) => {
            const slide = document.createElement('div');
            slide.className = 'carouselItem';

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Gallery image ${i + 1} - ${formatLabelFromPath(src)}`;
            img.loading = 'lazy';
            
            // NEW: Add error handling for images
            img.onerror = function() {
                console.error(`Failed to load image: ${src}`);
                img.alt = 'Image failed to load';
                img.style.backgroundColor = '#f0f0f0';
                img.style.padding = '20px';
            };

            const label = document.createElement('div');
            label.className = 'photoLabel';
            label.textContent = formatLabelFromPath(src) || `Photo ${i + 1}`;

            slide.appendChild(img);
            slide.appendChild(label);
            verticalInner.appendChild(slide);
        });
    }

    function openModal(images, startIndex = 0) {
        if (!images || images.length === 0) {
            console.warn('No images to display in gallery');
            return;
        }
        
        currentImages = images;
        buildVerticalSlides(images);

        lastFocusedElement = document.activeElement;
        imageModal.classList.add('open');
        imageModal.setAttribute('aria-hidden', 'false');
        
        // NEW: Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            currentIndex = Math.min(Math.max(0, startIndex), images.length - 1);
            scrollToIndex(currentIndex, false);
            verticalGallery.focus();
        });

        document.addEventListener('keydown', onDocumentKeyDown);
    }

    function closeModal() {
        imageModal.classList.remove('open');
        imageModal.setAttribute('aria-hidden', 'true');
        verticalInner.innerHTML = '';
        currentImages = [];
        currentIndex = 0;
        
        // NEW: Restore body scroll
        document.body.style.overflow = '';
        
        document.removeEventListener('keydown', onDocumentKeyDown);
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    function scrollToIndex(index, smooth = true) {
        const item = verticalInner.children[index];
        if (!item) return;
        const top = item.offsetTop - (verticalGallery.clientHeight - item.clientHeight) / 2;
        verticalGallery.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
    }

    function findNearestIndex() {
        const children = Array.from(verticalInner.children);
        if (!children.length) return 0;
        const scrollTop = verticalGallery.scrollTop;
        let nearestIndex = 0;
        let nearestDelta = Infinity;
        children.forEach((child, idx) => {
            const childCenter = child.offsetTop + child.clientHeight / 2;
            const viewportCenter = scrollTop + verticalGallery.clientHeight / 2;
            const delta = Math.abs(childCenter - viewportCenter);
            if (delta < nearestDelta) { 
                nearestDelta = delta; 
                nearestIndex = idx; 
            }
        });
        return nearestIndex;
    }

    function goPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToIndex(currentIndex);
        } else {
            scrollToIndex(0);
        }
    }

    function goNext() {
        if (currentIndex < verticalInner.children.length - 1) {
            currentIndex++;
            scrollToIndex(currentIndex);
        }
    }

    function onDocumentKeyDown(e) {
        if (e.key === 'Escape') { 
            closeModal(); 
        }
        else if (e.key === 'ArrowUp') { 
            e.preventDefault(); // NEW: Prevent page scroll when arrow keys are used
            goPrev(); 
        }
        else if (e.key === 'ArrowDown') { 
            e.preventDefault(); // NEW: Prevent page scroll when arrow keys are used
            goNext(); 
        }
    }

    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', (ev) => {
            ev.preventDefault();
            const images = parseGalleryData(thumb.getAttribute('data-gallery'));
            openModal(images, 0);
        });
        
        // NEW: Add keyboard support for thumbnails
        thumb.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                const images = parseGalleryData(thumb.getAttribute('data-gallery'));
                openModal(images, 0);
            }
        });
    });

    modalOverlay.addEventListener('click', closeModal);
    modalCloseBtn.addEventListener('click', closeModal);

    let scrollTimeout = null;
    verticalGallery.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const nearest = findNearestIndex();
            if (nearest !== currentIndex) currentIndex = nearest;
        }, 80);
    });

    verticalInner.addEventListener('click', (e) => {
        if (e.target && e.target.tagName === 'IMG') {
            const img = e.target;
            if (img.style.transform && img.style.transform !== '') {
                img.style.transform = '';
                img.style.transition = 'transform 220ms';
            } else {
                img.style.transform = 'scale(1.04)';
                img.style.transition = 'transform 220ms';
            }
        }
    });

    // NEW: Close modal when clicking on the modal background (outside content)
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeModal();
        }
    });

    // NEW: Prevent modal from closing when clicking inside content
    document.querySelector('.modalContent').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    window.verticalGalleryAPI = { open: openModal, close: closeModal, goNext, goPrev };
});