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
    const isCertificationsPage = window.location.pathname.includes('certifications.html');
    
    // Solo configuramos el IntersectionObserver si no estamos en la página de certificaciones
    if (!isCertificationsPage) {
        // Configurar Intersection Observer para las secciones
        const options = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    history.replaceState(null, '', `#${entry.target.id}`);
                    updateActiveNavLink(entry.target.id);
                }
            });
        }, options);

        // Observar todas las secciones
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    // Configurar los manejadores de clic para los enlaces de navegación
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Si estamos en la página de certificaciones, prevenir el comportamiento por defecto
            // para los enlaces internos
            if (isCertificationsPage && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                return; // No actualizamos el estado activo para los enlaces internos
            } 
            // Comportamiento normal para otras páginas
            else if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                    updateActiveNavLink(targetId);
                }
            }
        });
    });
    
    // Si estamos en la página de certificaciones, forzar el estado activo
    if (isCertificationsPage) {
        // Forzar el estado activo en el enlace de certificaciones
        const certLink = document.querySelector('a[href*="certifications"], a[href="#top"]');
        if (certLink) {
            // Remover la clase active de todos los enlaces
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            // Agregar la clase active al enlace de certificaciones
            certLink.classList.add('active');
            // Ocultar la flecha si existe
            const arrow = certLink.querySelector('i.fa-arrow-right');
            if (arrow) arrow.style.display = 'none';
        }
    }
}

// Función para actualizar el enlace de navegación activo
function updateActiveNavLink(sectionId) {
    // Si estamos en la página de certificaciones, mantener 'Certifications' como activo
    if (window.location.pathname.includes('certifications.html')) {
        sectionId = 'certifications';
    }
    
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${sectionId}` || 
            (sectionId === 'certifications' && (href.includes('certifications') || href === '#top'))) {
            link.classList.add('active');
            // Asegurarse de que no tenga la flecha
            const arrow = link.querySelector('.nav-arrow');
            if (arrow) arrow.style.display = 'none';
        } else {
            link.classList.remove('active');
        }
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
