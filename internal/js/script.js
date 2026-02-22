const startDate = new Date('2024-03-01T09:00:00'); // March 1, 2024, 09:00 AM

function updateTenure() {
    const now = new Date();
    const diff = now - startDate;

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    // Calculate years, months, days more accurately
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
        months--;
        // Get days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth;
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    const element = document.getElementById('tenure');
    if (element) {
        element.innerHTML = `${years} yrs, ${months} mos, ${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs`;
    }
}

setInterval(updateTenure, 1000);
updateTenure();

// Dark Mode Logic
const toggleButton = document.getElementById('theme-toggle');
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');

const sunIcon = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
</svg>`;

const moonIcon = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
</svg>`;

function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggleButton.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
}

if (storedTheme) {
    setTheme(storedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
} else {
    setTheme('light');
}

toggleButton.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Custom Cursor Logic
document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;

    // Speed of the outline following the dot (0 to 1)
    const speed = 0.15;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate move for the dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        // Smooth interpolation for the outline
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        cursorOutline.style.left = `${cursorX}px`;
        cursorOutline.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover interactions
    const interactables = document.querySelectorAll('a, button, .work-item, .carousel-slide, .lightbox-nav, .lightbox-close, .handle');

    interactables.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // Parallax Effect
    const parallaxImages = document.querySelectorAll('.project-hero-media img');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxImages.forEach(img => {
            const parent = img.parentElement;
            const parentOffsetTop = parent.offsetTop;
            const parentHeight = parent.offsetHeight;

            // Calculate how far the image is from the center of the viewport
            const viewportHeight = window.innerHeight;
            const elementCenter = parentOffsetTop + parentHeight / 2;
            const scrollCenter = scrolled + viewportHeight / 2;

            const distanceFromCenter = scrollCenter - elementCenter;

            // Move the image (factor of 0.3 for stronger effect)
            const speed = 0.3;
            const yPos = distanceFromCenter * speed;

            // Apply scale(1.3) from CSS + the new translation
            img.style.transform = `scale(1.3) translateY(${yPos}px)`;
        });
    });

    // Carousel Logic
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach(container => {
        const carouselTrack = container.querySelector('.carousel-track');
        if (!carouselTrack) return;

        const slides = Array.from(carouselTrack.children);
        const nextButton = container.querySelector('.carousel-button.next');
        const prevButton = container.querySelector('.carousel-button.prev');
        const indicators = container.querySelectorAll('.carousel-indicator');

        let currentSlideIndex = 0;

        const updateCarousel = (index) => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            carouselTrack.style.transform = 'translateX(-' + (slideWidth * index) + 'px)';

            indicators.forEach((ind, i) => {
                if (i === index) {
                    ind.classList.add('active');
                } else {
                    ind.classList.remove('active');
                }
            });
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                updateCarousel(currentSlideIndex);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
                updateCarousel(currentSlideIndex);
            });
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlideIndex = index;
                updateCarousel(currentSlideIndex);
            });
        });

        window.addEventListener('resize', () => {
            updateCarousel(currentSlideIndex);
        });
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-nav.prev');
    const lightboxNext = document.querySelector('.lightbox-nav.next');

    let currentLightboxSlides = [];
    let currentLightboxIndex = 0;

    if (lightbox && lightboxContent) {
        const updateLightboxContent = (index) => {
            const slide = currentLightboxSlides[index];
            if (!slide) return;

            lightboxContent.innerHTML = '';
            const isImage = slide.querySelector('img');
            if (isImage) {
                const clone = isImage.cloneNode(true);
                lightboxContent.appendChild(clone);
            } else {
                const clone = slide.cloneNode(true);
                clone.style.minWidth = 'auto';
                clone.style.width = '70vw';
                clone.style.height = '50vh';
                clone.style.transform = 'none';
                lightboxContent.appendChild(clone);
            }

            const caption = slide.getAttribute('data-caption');
            lightboxCaption.textContent = caption || '';
            currentLightboxIndex = index;
        };

        const carouselContainersList = document.querySelectorAll('.carousel-container');
        carouselContainersList.forEach(container => {
            const slides = Array.from(container.querySelectorAll('.carousel-slide'));
            slides.forEach((slide, index) => {
                slide.addEventListener('click', () => {
                    currentLightboxSlides = slides;
                    updateLightboxContent(index);
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });
        });

        const navigateLightbox = (direction) => {
            if (currentLightboxSlides.length === 0) return;
            let newIndex = (currentLightboxIndex + direction + currentLightboxSlides.length) % currentLightboxSlides.length;
            updateLightboxContent(newIndex);
        };

        if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });
        if (lightboxNext) lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) closeLightbox();
        });

        window.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }

    // Before/After Slider Logic
    const baWrappers = document.querySelectorAll('.before-after-wrapper');
    baWrappers.forEach(wrapper => {
        const handle = wrapper.querySelector('.handle');
        const beforeImg = wrapper.querySelector('.before-image');
        let isDragging = false;

        const onMove = (e) => {
            if (!isDragging) return;

            const rect = wrapper.getBoundingClientRect();
            let x = (e.pageX || e.touches[0].pageX) - rect.left - window.scrollX;

            x = Math.max(0, Math.min(x, rect.width));

            const percentage = (x / rect.width) * 100;
            handle.style.left = `${percentage}%`;
            beforeImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        };

        const startDragging = () => { isDragging = true; };
        const stopDragging = () => { isDragging = false; };

        handle.addEventListener('mousedown', startDragging);
        handle.addEventListener('touchstart', startDragging, { passive: true });

        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });

        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);
    });
});
