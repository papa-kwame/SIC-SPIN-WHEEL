/**
 * SIC Insurance Spin Wheel - Canvas Physics Engine
 * Slices display large, clear, bold Ghana Cedi fuel coupon amounts (GH₵ 50, GH₵ 100, GH₵ 200).
 * Weighted probabilities (Tissue easiest = 35, GH₵ 200 Fuel hardest = 1).
 */

class SpinWheel {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Slices & Weighted Probabilities (Fuel coupons spaced out evenly around the wheel)
        this.prizes = options.prizes || [
            { label: 'T-SHIRT', fullLabel: 'T-SHIRT', bg: '#002B66', text: '#FFFFFF', weight: 14 },
            { label: 'KEY HOLDER', fullLabel: 'KEY HOLDER', bg: '#E52320', text: '#FFFFFF', weight: 18 },
            { label: 'GH₵ 50 FUEL', fullLabel: 'GH₵ 50 FUEL COUPON', bg: '#0B3C5D', text: '#FFFFFF', weight: 5 },   // Fuel Coupon 1
            { label: 'PEN', fullLabel: 'PEN', bg: '#FF8C66', text: '#001838', weight: 20 },
            { label: 'DANGLER', fullLabel: 'DANGLER', bg: '#00A8E8', text: '#FFFFFF', weight: 18 },
            { label: 'GH₵ 100 FUEL', fullLabel: 'GH₵ 100 FUEL COUPON', bg: '#004080', text: '#FFFFFF', weight: 3 },  // Fuel Coupon 2
            { label: 'CAR DUSTER', fullLabel: 'CAR DUSTER', bg: '#DC2626', text: '#FFFFFF', weight: 12 },
            { label: 'TISSUE', fullLabel: 'TISSUE', bg: '#0284C7', text: '#FFFFFF', weight: 35 },                     // EASIEST TO WIN
            { label: 'GH₵ 200 FUEL', fullLabel: 'GH₵ 200 FUEL COUPON', bg: '#B91C1C', text: '#FFFFFF', weight: 1 }   // HARDEST TO WIN (Fuel Coupon 3)
        ];

        this.currentAngle = 0;
        this.isSpinning = false;
        this.lastPegIndex = -1;

        this.onSpinStart = options.onSpinStart || null;
        this.onSpinComplete = options.onSpinComplete || null;

        this.setupCanvas();
        window.addEventListener('resize', () => this.setupCanvas());
    }

    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        const size = Math.max(rect.width, 550);
        
        this.width = size;
        this.height = size;

        this.canvas.width = size * dpr;
        this.canvas.height = size * dpr;

        this.ctx.scale(dpr, dpr);
        this.radius = (size / 2) * 0.95;
        this.centerX = size / 2;
        this.centerY = size / 2;

        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;
        const cx = this.centerX;
        const cy = this.centerY;
        const numSlices = this.prizes.length;
        const sliceAngle = (Math.PI * 2) / numSlices;

        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(cx, cy);

        // 1. Outer Dark Rim Frame
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = '#000D21';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 2. Rotating Slices
        ctx.save();
        ctx.rotate(this.currentAngle);

        for (let i = 0; i < numSlices; i++) {
            const startA = i * sliceAngle;
            const endA = startA + sliceAngle;
            const prize = this.prizes[i];

            // Slice Wedge
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, this.radius, startA, endA);
            ctx.closePath();
            ctx.fillStyle = prize.bg;
            ctx.fill();

            // Crisp White Divider Line
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();

            // Clean & Bold Radial Typography Label (Inter Font)
            ctx.save();
            ctx.rotate(startA + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = prize.text;
            
            // Format currency amounts (GH₵ 50, GH₵ 100, GH₵ 200) extra large and bold!
            if (prize.label.startsWith('GH₵')) {
                ctx.font = `900 ${Math.floor(this.radius * 0.082)}px 'Inter', sans-serif`;
                ctx.fillText(prize.label, this.radius * 0.88, 0);
            } else {
                ctx.font = `900 ${Math.floor(this.radius * 0.08)}px 'Inter', sans-serif`;
                ctx.fillText(prize.label, this.radius * 0.85, 0);
            }

            ctx.restore();
        }

        ctx.restore(); // Restore slice rotation

        // 3. Clean White Rim Pegs
        const pegCount = numSlices * 2;
        const pegAngleStep = (Math.PI * 2) / pegCount;
        for (let p = 0; p < pegCount; p++) {
            const pegA = this.currentAngle + p * pegAngleStep;
            const px = Math.cos(pegA) * (this.radius - 2.5);
            const py = Math.sin(pegA) * (this.radius - 2.5);

            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        }

        // 4. Minimalist Pure Center Cap
        const hubRadius = this.radius * 0.22;

        ctx.beginPath();
        ctx.arc(0, 0, hubRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, hubRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#002B66';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, hubRadius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#002B66';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, hubRadius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.restore(); // Restore translation
    }

    spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;

        if (this.onSpinStart) this.onSpinStart();
        if (window.soundEngine) window.soundEngine.playSpinStart();

        const totalWeight = this.prizes.reduce((sum, p) => sum + (p.weight || 1), 0);
        let random = Math.random() * totalWeight;
        let winningIndex = 0;
        for (let i = 0; i < this.prizes.length; i++) {
            if (random < (this.prizes[i].weight || 1)) {
                winningIndex = i;
                break;
            }
            random -= (this.prizes[i].weight || 1);
        }

        const numSlices = this.prizes.length;
        const sliceAngle = (Math.PI * 2) / numSlices;

        const targetSliceCenterAngle = (winningIndex + 0.5) * sliceAngle;
        const targetWheelAngleAtTop = (Math.PI * 1.5) - targetSliceCenterAngle;

        const fullRotations = (5 + Math.floor(Math.random() * 3)) * Math.PI * 2;
        const jitter = (Math.random() - 0.5) * sliceAngle * 0.7;

        let deltaAngle = (targetWheelAngleAtTop - (this.currentAngle % (Math.PI * 2))) + fullRotations + jitter;
        if (deltaAngle < fullRotations) deltaAngle += Math.PI * 2;

        this.startAngle = this.currentAngle;
        this.targetAngle = this.currentAngle + deltaAngle;
        this.spinDuration = 4800 + Math.random() * 1000;
        this.startTime = performance.now();
        this.winningIndex = winningIndex;

        this.animateSpin();
    }

    animateSpin() {
        const now = performance.now();
        const elapsed = now - this.startTime;
        const progress = Math.min(elapsed / this.spinDuration, 1.0);

        const easeOut = (t) => 1 - Math.pow(1 - t, 4);
        const currentProgress = easeOut(progress);

        this.currentAngle = this.startAngle + (this.targetAngle - this.startAngle) * currentProgress;

        const numSlices = this.prizes.length;
        const pegCount = numSlices * 2;
        const pegAngleStep = (Math.PI * 2) / pegCount;
        
        const normalizedAngle = (this.currentAngle + Math.PI / 2) % (Math.PI * 2);
        const currentPegIndex = Math.floor(normalizedAngle / pegAngleStep);

        if (currentPegIndex !== this.lastPegIndex) {
            this.lastPegIndex = currentPegIndex;
            const velocityRatio = (1 - progress);
            if (window.soundEngine) window.soundEngine.playTick(velocityRatio);
        }

        this.draw();

        if (progress < 1.0) {
            requestAnimationFrame(() => this.animateSpin());
        } else {
            this.isSpinning = false;
            this.draw();

            const wonPrize = this.prizes[this.winningIndex];
            if (window.soundEngine) window.soundEngine.playWinSound();
            if (window.confettiEngine) window.confettiEngine.fire();

            if (this.onSpinComplete) {
                this.onSpinComplete(wonPrize, this.winningIndex);
            }
        }
    }
}

window.SpinWheel = SpinWheel;
