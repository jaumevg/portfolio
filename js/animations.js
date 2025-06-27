export function initScrollAnimations() {
    AOS.init({
        duration: 800,
        once: false,
        offset: 50,
        easing: 'ease-out-cubic',
        mirror: true,
        anchorPlacement: 'top-bottom'
    });

    window.addEventListener('resize', () => {
        AOS.refresh();
    });

    initSkillBars();
}

function initSkillBars() {
    const skillBars = document.querySelectorAll('.progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const parent = bar.closest('.skill-item');
                const percentage = parent.querySelector('.skill-percentage').textContent;
                bar.style.width = percentage;
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => observer.observe(bar));
}

export function initImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
}
