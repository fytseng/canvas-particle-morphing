/**
 * Canvas Particle Morphing Text
 * A mobile-friendly, high-performance particle system that morphs between text symbols.
 * * Features:
 * - Mobile Optimized: Handles height collapse, touch events, and high-DPR screens.
 * - Font Safety: Waits for fonts to load before rendering.
 * - Interactive: Reacts to mouse and touch input.
 * * @author Quants Note (https://www.quantsnote.com)
 * @license MIT
 * @version 1.0.0
 */

(function () {
    'use strict';

    // Detect Mobile Devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Configuration
    const CONFIG = {
        // DOM Id of the container
        containerId: 'particle-logo-container',
        
        // Symbols to morph between
        textArray: ['Q', 'u', 'a', 'n', 't', 's', 'N', 'o', 't', 'e'],
        
        // Animation settings
        morphInterval: 4000,
        particleCount: isMobile ? 1200 : 1500,
        
        // Appearance
        colors: [
            '#38bdf8', // Cyan/Blue
            '#EBAD28', // Brand Orange
            '#BBFDE3'  // Bright Green
        ],
        fontSizeParam: isMobile ? 0.95 : 1.0,  // Font size relative to canvas width/height
        verticalOffset: 0,                     // Vertical alignment adjustment
        
        // Interaction
        mouseRadius: isMobile ? 120 : 100,
        
        // Fallback height for mobile if container collapses (CSS usually handles this)
        mobileFallbackHeight: '420px' 
    };

    function init() {
        const container = document.getElementById(CONFIG.containerId);
        if (!container) {
            console.warn(`Particle container #${CONFIG.containerId} not found.`);
            return;
        }

        // [Mobile Fix] Prevent container height collapse on mobile
        const rectCheck = container.getBoundingClientRect();
        if (rectCheck.height === 0) {
            container.style.height = CONFIG.mobileFallbackHeight; 
        }

        // Create Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.display = 'block'; // Prevent scrollbar issues
        container.appendChild(canvas);

        // State Variables
        let particles = [];
        let autoChangeTimer = null;
        let currentShapeIndex = 0;
        let animationId = null;
        let isAnimating = false;
        const mouse = { x: null, y: null };

        // 1. Resize Logic (High-DPR Support)
        function resizeCanvas() {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            // Use Math.floor to avoid sub-pixel rendering artifacts
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(rect.height * dpr);

            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.scale(dpr, dpr);
        }

        // 2. Point Generation Logic
        function getTextPoints(text) {
            const rect = container.getBoundingClientRect();
            const width = Math.floor(rect.width);
            const height = Math.floor(rect.height);

            // Virtual Canvas for sampling
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = width;
            tempCanvas.height = height;

            // Font Settings
            const fontSize = Math.min(width, height) * CONFIG.fontSizeParam;
            // Robust font stack for math symbols
            tempCtx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
            tempCtx.fillStyle = '#ffffff';
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';

            // Draw Text
            const vOffset = height * CONFIG.verticalOffset;
            tempCtx.fillText(text, width / 2, height / 2 - vOffset);

            const imageData = tempCtx.getImageData(0, 0, width, height);
            const pixels = imageData.data;
            const points = [];

            // Dynamic Sampling Rate
            const gap = Math.ceil(Math.sqrt((width * height) / 5500));

            for (let y = 0; y < height; y += gap) {
                for (let x = 0; x < width; x += gap) {
                    const index = (y * width + x) * 4;
                    // Threshold > 50 captures anti-aliased edges for smoother shapes
                    if (pixels[index + 3] > 50) { 
                        points.push({ x, y });
                    }
                }
            }
            return points;
        }

        // 3. Particle Class
        class Particle {
            constructor() {
                const width = canvas.width / (window.devicePixelRatio || 1);
                const height = canvas.height / (window.devicePixelRatio || 1);

                // Initial Position: Spawn from random edges (Implosion effect)
                const side = Math.floor(Math.random() * 4); 
                if (side === 0) { this.x = Math.random() * width; this.y = 0; }
                else if (side === 1) { this.x = width; this.y = Math.random() * height; }
                else if (side === 2) { this.x = Math.random() * width; this.y = height; }
                else { this.x = 0; this.y = Math.random() * height; }

                this.targetX = width / 2;
                this.targetY = height / 2;

                this.vx = 0;
                this.vy = 0;
                this.friction = 0.66; 
                this.ease = 0.05 + Math.random() * 0.05;

                this.baseSize = Math.random() * 2.5 + 1;
                this.size = this.baseSize;
                this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
                this.visible = true;

                // Breathing Effect
                this.breathingPhase = Math.random() * Math.PI * 2;
                this.breathingSpeed = 0.02 + Math.random() * 0.02;
            }

            update() {
                // Morphing force
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                this.vx += dx * this.ease * 0.5;
                this.vy += dy * this.ease * 0.5;

                // Mouse/Touch Repulsion
                if (mouse.x != null) {
                    const mdx = mouse.x - this.x;
                    const mdy = mouse.y - this.y;
                    const dist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (dist < CONFIG.mouseRadius) {
                        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                        const angle = Math.atan2(mdy, mdx);
                        this.vx -= Math.cos(angle) * force * 2;
                        this.vy -= Math.sin(angle) * force * 2;
                    }
                }

                // Physics
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.x += this.vx;
                this.y += this.vy;

                // Breathing
                this.breathingPhase += this.breathingSpeed;
                this.size = this.baseSize * (1 + Math.sin(this.breathingPhase) * 0.3);
            }

            draw() {
                if (!this.visible) return;
                const opacity = 0.7 + Math.sin(this.breathingPhase) * 0.3;
                ctx.globalAlpha = Math.max(0.2, Math.min(1, opacity));
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        // 4. System Logic
        function initParticleSystem() {
            particles = [];
            for (let i = 0; i < CONFIG.particleCount; i++) {
                particles.push(new Particle());
            }
            changeShape(CONFIG.textArray[0]);
        }

        function changeShape(text) {
            const points = getTextPoints(text);
            if (points.length === 0) return;

            points.sort(() => Math.random() - 0.5); // Randomize target assignment

            particles.forEach((p, i) => {
                const point = points[i % points.length];
                p.targetX = point.x;
                p.targetY = point.y;
                
                // Jitter to avoid grid-like appearance
                const jitter = isMobile ? 4 : 5;
                p.targetX += (Math.random() - 0.5) * jitter;
                p.targetY += (Math.random() - 0.5) * jitter;
                p.visible = true;
            });
        }

        function animate() {
            if (!isAnimating) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animate);
        }

        function startMorphing() {
            if (autoChangeTimer) clearInterval(autoChangeTimer);
            autoChangeTimer = setInterval(() => {
                if (isAnimating) {
                    currentShapeIndex = (currentShapeIndex + 1) % CONFIG.textArray.length;
                    changeShape(CONFIG.textArray[currentShapeIndex]);
                }
            }, CONFIG.morphInterval);
        }

        // --- Event Listeners ---

        // Mouse
        container.addEventListener('mousemove', e => {
            const rect = container.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        container.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

        // Touch (Mobile Support)
        const handleTouch = (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
        };
        container.addEventListener('touchstart', handleTouch, { passive: false });
        container.addEventListener('touchmove', handleTouch, { passive: false });
        container.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

        // Resize
        window.addEventListener('resize', () => {
            resizeCanvas();
            changeShape(CONFIG.textArray[currentShapeIndex]);
        });

        // Visibility (Performance)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!isAnimating) {
                        isAnimating = true;
                        animate();
                    }
                } else {
                    isAnimating = false;
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            });
        }, { threshold: 0 });
        observer.observe(container);

        // Start (Wait for fonts)
        document.fonts.ready.then(() => {
            resizeCanvas();
            initParticleSystem();
            startMorphing();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();