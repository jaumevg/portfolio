/**
 * particles.js — Tricolor cyberpunk particles with mouse repulsion
 * Colors: Neon Red · Electric Violet · Data Cyan
 */
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles;
    let mouse = { x: -9999, y: -9999 };
    const MOUSE_RADIUS = 100;
    const CONNECTION_RADIUS = 110;

    // Paleta tricolor
    const COLORS = [
        { r: 255, g: 23,  b: 68  },  // Neon Red
        { r: 255, g: 23,  b: 68  },  // Neon Red (más peso)
        { r: 123, g: 47,  b: 255 },  // Electric Violet
        { r: 0,   g: 212, b: 255 },  // Data Cyan
    ];

    function randomColor() {
        return COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    function rgba(c, a) {
        return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
    }

    function initParticles() {
        const count = Math.floor((width * height) / 14000);
        particles = [];
        for (let i = 0; i < count; i++) {
            const color = randomColor();
            // ~10% de partículas son "data points" más grandes y brillantes
            const isDataPoint = Math.random() < 0.1;
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: isDataPoint ? Math.random() * 2 + 1.5 : Math.random() * 1.2 + 0.4,
                color,
                baseSpeedX: (Math.random() - 0.5) * 0.25,
                baseSpeedY: (Math.random() - 0.5) * 0.25,
                vx: 0,
                vy: 0,
                angle: Math.random() * Math.PI * 2,
                isDataPoint,
                opacity: isDataPoint ? 0.9 : Math.random() * 0.4 + 0.2,
            });
        }
    }

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    }

    window.addEventListener('resize', resizeCanvas);

    // Seguimiento del mouse
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    function update(p) {
        // Repulsión del cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * 1.5;
            p.vy += Math.sin(angle) * force * 1.5;
        }

        // Amortiguación + velocidad base
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.baseSpeedX + p.vx;
        p.y += p.baseSpeedY + p.vy;

        // Wrap around
        if (p.x < -10)        p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10)        p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Cambio de dirección suave
        if (Math.random() > 0.98) {
            p.baseSpeedX += (Math.random() - 0.5) * 0.05;
            p.baseSpeedY += (Math.random() - 0.5) * 0.05;
            // Límite de velocidad base
            p.baseSpeedX = Math.max(-0.35, Math.min(0.35, p.baseSpeedX));
            p.baseSpeedY = Math.max(-0.35, Math.min(0.35, p.baseSpeedY));
        }
    }

    function draw(p) {
        const alpha = p.opacity;

        if (p.isDataPoint) {
            // Data point: núcleo brillante + halo
            const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
            halo.addColorStop(0, rgba(p.color, alpha));
            halo.addColorStop(1, rgba(p.color, 0));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            ctx.fillStyle = halo;
            ctx.fill();

            // Núcleo sólido
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = rgba(p.color, 1);
            ctx.fill();
        } else {
            // Partícula normal
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = rgba(p.color, alpha);
            ctx.fill();
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_RADIUS) {
                    const t = 1 - dist / CONNECTION_RADIUS;
                    // Color interpolado entre los dos nodos
                    const r = Math.round((a.color.r + b.color.r) / 2);
                    const g = Math.round((a.color.g + b.color.g) / 2);
                    const bCh = Math.round((a.color.b + b.color.b) / 2);

                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${bCh}, ${t * 0.25})`;
                    ctx.lineWidth = t * 0.8;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            update(p);
            draw(p);
        });

        drawConnections();

        requestAnimationFrame(loop);
    }

    resizeCanvas();
    loop();
});
