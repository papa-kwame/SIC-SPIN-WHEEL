/**
 * SIC Insurance Spin Wheel - Confetti Particles Engine
 * Standalone high-performance HTML5 Canvas Confetti shower.
 */

class ConfettiEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationFrame = null;
        this.colors = [
            '#E52320', // SIC Red
            '#00A8E8', // SIC Sky Blue
            '#002B66', // SIC Dark Blue
            '#FFB703', // Gold
            '#FF8C66', // SIC Peach
            '#FFFFFF', // White
            '#38BDF8'  // Cyan
        ];
    }

    createCanvas() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'confetti-canvas';
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '999999';
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    fire(count = 140) {
        this.createCanvas();
        const width = this.canvas.width;
        const height = this.canvas.height;

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: width * 0.5 + (Math.random() - 0.5) * 200,
                y: height * 0.45,
                vx: (Math.random() - 0.5) * 18,
                vy: -Math.random() * 18 - 6,
                size: Math.random() * 10 + 6,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                opacity: 1.0,
                shape: Math.random() > 0.4 ? 'rect' : 'circle',
                decay: 0.006 + Math.random() * 0.008
            });
        }

        if (!this.animationFrame) {
            this.loop();
        }
    }

    loop() {
        if (!this.ctx || this.particles.length === 0) {
            this.animationFrame = null;
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.45; // gravity
            p.vx *= 0.98; // air resistance
            p.rotation += p.rotationSpeed;
            p.opacity -= p.decay;

            if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(p.opacity, 0);
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        this.animationFrame = requestAnimationFrame(() => this.loop());
    }
}

window.confettiEngine = new ConfettiEngine();
