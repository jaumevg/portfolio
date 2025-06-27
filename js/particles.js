class ParticleSystem {
    constructor() {
        this.container = document.querySelector('#particles-container');
        this.mouse = { x: 0, y: 0 };
        this.particlesData = [];
        this.shootingStars = [];
        this.particleCount = 3250; // Adjusted star count
        this.lastShootingStarTime = 0;
        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 1000;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.insertBefore(this.renderer.domElement, this.container.firstChild);

        // Create starfield
        this.createStarfield();
        
        // Create shooting star material
        this.shootingStarMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xff1744) },
                time: { value: 0.0 }
            },
            vertexShader: `
                attribute float scale;
                uniform float time;
                void main() {
                    vec3 pos = position;
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = scale * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        // Event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this));

        // Start animation
        this.animate();
    }

    createStarfield() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const scales = new Float32Array(this.particleCount);
        const opacities = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 1000;
            positions[i3 + 2] = (Math.random() - 0.5) * 1000;
            
            // Vary star sizes
            scales[i] = Math.random() * 2.5;
            opacities[i] = 0.7 + Math.random() * 0.3; // More consistent brightness

            this.particlesData.push({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1, // Reduced movement speed
                    (Math.random() - 0.5) * 0.1,
                    0
                ),
                originalScale: scales[i],
                twinkleSpeed: Math.random() * 0.05 // Reduced twinkling speed
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

        // Star material with improved visibility
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xff1744) },
                time: { value: 0.0 }
            },
            vertexShader: `
                attribute float scale;
                attribute float opacity;
                varying float vOpacity;
                uniform float time;
                void main() {
                    vec3 pos = position;
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = scale * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                    vOpacity = opacity;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying float vOpacity;
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    float alpha = (1.0 - smoothstep(0.4, 0.5, dist)) * vOpacity;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);
    }

    createShootingStar() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(20 * 3); // Trail of 20 points
        const scales = new Float32Array(20);

        // Random start position above the viewport
        const startX = (Math.random() - 0.5) * 2000;
        const startY = 500 + Math.random() * 500;
        const startZ = (Math.random() - 0.5) * 1000;

        // Calculate direction (diagonal down)
        const angle = Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 6;
        const speed = 15 + Math.random() * 10;
        const velocity = new THREE.Vector3(
            -Math.cos(angle) * speed,
            -Math.sin(angle) * speed,
            0
        );

        for (let i = 0; i < 20; i++) {
            const i3 = i * 3;
            positions[i3] = startX + velocity.x * (i * 0.5);
            positions[i3 + 1] = startY + velocity.y * (i * 0.5);
            positions[i3 + 2] = startZ;
            scales[i] = 3.0 * (1 - i / 20); // Trail gets smaller
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        const points = new THREE.Points(geometry, this.shootingStarMaterial);
        this.shootingStars.push({
            points,
            velocity,
            life: 100 // Lifetime counter
        });
        this.scene.add(points);
    }

    updateShootingStars() {
        const currentTime = Date.now();
        
        // Create new shooting star every 2-4 seconds
        if (currentTime - this.lastShootingStarTime > 2000 + Math.random() * 2000) {
            this.createShootingStar();
            this.lastShootingStarTime = currentTime;
        }

        // Update existing shooting stars
        for (let i = this.shootingStars.length - 1; i >= 0; i--) {
            const star = this.shootingStars[i];
            const positions = star.points.geometry.attributes.position.array;

            // Move all points in the trail
            for (let j = 0; j < positions.length; j += 3) {
                positions[j] += star.velocity.x;
                positions[j + 1] += star.velocity.y;
            }

            star.points.geometry.attributes.position.needsUpdate = true;
            star.life--;

            // Remove if out of view or lifetime ended
            if (star.life <= 0 || positions[1] < -500) {
                this.scene.remove(star.points);
                this.shootingStars.splice(i, 1);
            }
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onTouchMove(event) {
        if (event.touches.length > 0) {
            this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = Date.now() * 0.001;
        this.points.material.uniforms.time.value = time;

        const positions = this.points.geometry.attributes.position.array;
        const scales = this.points.geometry.attributes.scale.array;

        // Update stars
        for (let i = 0; i < this.particleCount; i++) {
            const particleData = this.particlesData[i];
            const ix = i * 3;

            // Subtle star movement
            positions[ix] += particleData.velocity.x;
            positions[ix + 1] += particleData.velocity.y;

            // Twinkle effect
            scales[i] = particleData.originalScale * (0.9 + Math.sin(time * particleData.twinkleSpeed) * 0.2); // Reduced twinkle intensity

            // Wrap around edges
            if (positions[ix] < -1000) positions[ix] = 1000;
            if (positions[ix] > 1000) positions[ix] = -1000;
            if (positions[ix + 1] < -500) positions[ix + 1] = 500;
            if (positions[ix + 1] > 500) positions[ix + 1] = -500;
        }

        // Update shooting stars
        this.updateShootingStars();

        this.points.geometry.attributes.position.needsUpdate = true;
        this.points.geometry.attributes.scale.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
