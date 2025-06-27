export function initFloatingNav() {
    const navbar = document.querySelector('nav');
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll <= 100) {
                    navbar.classList.remove('navbar-hidden');
                } else if (currentScroll > lastScroll) {
                    // Scroll down
                    navbar.classList.add('navbar-hidden');
                } else if (currentScroll < lastScroll) {
                    // Scroll up
                    navbar.classList.remove('navbar-hidden');
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

export function initNavigation() {
    // Configurar Intersection Observer para las secciones
    const options = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Ajusta el área de intersección
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                history.replaceState(null, '', `#${entry.target.id}`);
            }
        });
    }, options);

    // Observar todas las secciones
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

export function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', initFloatingNav);
