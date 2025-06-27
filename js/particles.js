document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    const particleCount = Math.floor(width * height / 15000); // Ajustar densidad
    
    // Colores para las partículas
    const colors = [
        'rgba(255, 255, 255, 0.7)',
        'rgba(200, 225, 255, 0.6)',
        'rgba(180, 200, 255, 0.5)'
    ];
    
    // Configuración de partículas
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                angle: Math.random() * Math.PI * 2,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    // Redimensionar canvas
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }
    
    window.addEventListener('resize', resizeCanvas);
    
    // Dibujar partículas
    function drawParticles() {
        // Fondo con degradado sutil
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(10, 10, 20, 0.8)');
        gradient.addColorStop(1, 'rgba(15, 15, 25, 0.8)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Actualizar y dibujar partículas
        particles.forEach(particle => {
            // Dibujar halo suave
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Dibujar núcleo de la partícula
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();
            
            // Mover partícula
            particle.x += Math.cos(particle.angle) * 0.3;
            particle.y += Math.sin(particle.angle) * 0.3;
            
            // Reaparecer en el otro lado si sale de la pantalla
            if (particle.x < -20) particle.x = width + 20;
            if (particle.x > width + 20) particle.x = -20;
            if (particle.y < -20) particle.y = height + 20;
            if (particle.y > height + 20) particle.y = -20;
            
            // Cambiar dirección suavemente
            if (Math.random() > 0.98) {
                particle.angle += (Math.random() - 0.5) * 0.5;
            }
        });
        
        // Dibujar conexiones entre partículas cercanas
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = 1 - distance/120;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Efecto de brillo en el centro
        const centerX = width / 2;
        const centerY = height / 2;
        const gradientCenter = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, Math.min(width, height) * 0.6
        );
        gradientCenter.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
        gradientCenter.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradientCenter;
        ctx.fillRect(0, 0, width, height);
        
        requestAnimationFrame(drawParticles);
    }
    
    // Inicializar y comenzar animación
    resizeCanvas();
    drawParticles();
});
