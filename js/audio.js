/**
 * SIC Insurance Spin Wheel - Web Audio API Sound Engine
 * Provides realistic wheel tick clicks, spin whirring, and victory fanfare.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.lastTickTime = 0;
        this.initOnInteraction();
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initOnInteraction() {
        const unlock = () => {
            this.init();
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };
        window.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    // Play a sharp mechanical click sound when a peg hits the pointer
    playTick(velocityRatio = 1.0) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Limit tick rate so audio doesn't clip when spinning super fast
        if (now - this.lastTickTime < 0.03) return;
        this.lastTickTime = now;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // High frequency click with slight variation
        const baseFreq = 800 + Math.random() * 400;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq * Math.min(Math.max(velocityRatio, 0.4), 1.6), now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

        filter.type = 'highpass';
        filter.frequency.value = 400;

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
    }

    // Play a low subtle tension swoosh sound when spin starts
    playSpinStart() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.25);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Triumphant victory fanfare when the wheel stops on a prize
    playWinSound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major Chord Arpeggio)
        
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);

            gain.gain.setValueAtTime(0, now + idx * 0.09);
            gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.09 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.45);
        });
    }
}

window.soundEngine = new SoundEngine();
