// Import modules
import { setupTypingAnimation } from './typing.js';
import { initFloatingNav, initNavigation, initMobileMenu } from './navigation.js';
import { initScrollAnimations, initImageLoading } from './animations.js';
import { initContactForm } from './contact.js';
import { updateActiveNavItem, initSmoothScroll } from './utils.js';

// Initialize AOS (Animation On Scroll library)
AOS.init({
    duration: 1000,
    once: true
});

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modular components
    setupTypingAnimation();
    initFloatingNav();
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initSmoothScroll();
    initImageLoading();

    // Update active nav item on page load
    updateActiveNavItem();
});

// Add scroll event listener for navigation updates
window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveNavItem);
});