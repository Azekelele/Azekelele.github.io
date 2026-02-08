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
    const interactables = document.querySelectorAll('a, button, .work-item');

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
});
