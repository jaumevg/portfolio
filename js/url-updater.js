// Configuración del Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

// Flags para control de scroll
let isNaturalScrolling = false;
let isProgrammaticScrolling = false;
let scrollTimeout;

// Manejar el evento de scroll
window.addEventListener('scroll', () => {
    if (!isProgrammaticScrolling) {
        isNaturalScrolling = true;
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            isNaturalScrolling = false;
        }, 150);
    }
});

// Crear el observer
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && isNaturalScrolling && !isProgrammaticScrolling) {
            const sectionId = entry.target.id;
            updateURL(sectionId);
        }
    });
}, observerOptions);

// Función para actualizar la URL
function updateURL(sectionId) {
    const newURL = sectionId 
        ? `${window.location.pathname}#${sectionId}`
        : window.location.pathname;
    history.replaceState(null, '', newURL);
    updateActiveNavLink(sectionId);
}

// Función para actualizar el enlace activo en la navegación
function updateActiveNavLink(sectionId) {
    // Remover la clase active de todos los enlaces
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });

    // Añadir la clase active al enlace correspondiente
    if (sectionId) {
        const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    } else if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        // Si no hay sección ID y estamos en la página principal, activar Home
        const homeLink = document.querySelector('a[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}

// Observar todas las secciones
document.addEventListener('DOMContentLoaded', () => {
    // Activar el enlace Home por defecto en la página principal
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const homeLink = document.querySelector('a[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }

    // Observar todas las secciones, incluso las que no tienen ID
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        // Si la sección no tiene ID y es la primera, tratarla como la hero section
        if (!section.id && section.classList.contains('certifications-hero')) {
            section.setAttribute('data-is-hero', 'true');
        }
        sectionObserver.observe(section);
    });

    // Configurar un observer específico para la hero section
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && isNaturalScrolling && !isProgrammaticScrolling) {
                // Si estamos en la hero section, limpiar el hash de la URL
                updateURL('');
            }
        });
    }, observerOptions);

    // Observar la hero section si existe
    const heroSection = document.querySelector('.certifications-hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
});

// Manejar los clicks en los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Marcar que estamos en un scroll programático
            isProgrammaticScrolling = true;
            isNaturalScrolling = false;
            
            // Actualizar la URL directamente
            if (targetId) {
                history.pushState(null, '', `#${targetId}`);
            } else {
                history.pushState(null, '', window.location.pathname);
            }
            
            // Realizar el scroll
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Restaurar el estado después de que termine la animación
            setTimeout(() => {
                isProgrammaticScrolling = false;
            }, 1000);
        }
    });
});
