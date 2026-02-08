// gallery.js - vertical scroll gallery (camelCase naming)
// This script wires thumbnails (data-gallery) to open the vertical modal,
// builds slides, hides scrollbar via CSS, and ensures the close button works.

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
            img.alt = `Photo ${i + 1}`;
            img.loading = 'lazy';

            const label = document.createElement('div');
            label.className = 'photoLabel';
            label.textContent = formatLabelFromPath(src) || `Photo ${i + 1}`;

            slide.appendChild(img);
            slide.appendChild(label);
            verticalInner.appendChild(slide);
        });
    }

    function openModal(images, startIndex = 0) {
        if (!images || images.length === 0) return;
        currentImages = images;
        buildVerticalSlides(images);

        lastFocusedElement = document.activeElement;
        imageModal.classList.add('open');
        imageModal.setAttribute('aria-hidden', 'false');

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
        document.removeEventListener('keydown', onDocumentKeyDown);
        if (lastFocusedElement) lastFocusedElement.focus();
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
            if (delta < nearestDelta) { nearestDelta = delta; nearestIndex = idx; }
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
        if (e.key === 'Escape') { closeModal(); }
        else if (e.key === 'ArrowUp') { goPrev(); }
        else if (e.key === 'ArrowDown') { goNext(); }
    }

    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', (ev) => {
            ev.preventDefault();
            const images = parseGalleryData(thumb.getAttribute('data-gallery'));
            openModal(images, 0);
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

    // optional programmatic API
    window.verticalGalleryAPI = { open: openModal, close: closeModal, goNext, goPrev };
});
