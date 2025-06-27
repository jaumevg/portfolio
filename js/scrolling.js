// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll progress
    initScrollProgress();
    
    // Initialize back to top button
    initBackToTop();
});

// Initialize scroll progress functionality
function initScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    if (!scrollProgress) {
        console.warn('Scroll progress element not found');
        return;
    }
    
    // Initial update
    updateScrollProgress(scrollProgress);
    
    // Update on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => updateScrollProgress(scrollProgress));
    }, { passive: true });
    
    // Update on resize
    window.addEventListener('resize', () => {
        requestAnimationFrame(() => updateScrollProgress(scrollProgress));
    }, { passive: true });
}

// Update scroll progress width
function updateScrollProgress(progressBar) {
    const winScroll = window.pageYOffset || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = `${scrolled}%`;
}

// Initialize back to top functionality
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) {
        console.warn('Back to top button not found');
        return;
    }
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            backToTopButton.classList.toggle('show', window.pageYOffset > 100);
        });
    }, { passive: true });
    
    // Smooth scroll to top
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
});

// Back to Top Button
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll Down Indicator
const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const nextSection = document.querySelector('.certifications-hero').nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Hide scroll indicator when scrolling down
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.8';
        }
    });
}
