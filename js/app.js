/**
 * SIC Insurance Spin Wheel - Main Application Controller
 * Handles wheel initialization, spin events, sound toggling, and clean modern popup UI.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const spinBtn = document.getElementById('spinBtn');
    const soundBtn = document.getElementById('soundBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    const winnerModal = document.getElementById('winnerModal');
    const winnerPrizeName = document.getElementById('winnerPrizeName');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const claimBtn = document.getElementById('claimBtn');
    const spinAgainBtn = document.getElementById('spinAgainBtn');
    
    const tcLink = document.getElementById('tcLink');
    const tcModal = document.getElementById('tcModal');
    const closeTcModalBtn = document.getElementById('closeTcModalBtn');

    let totalSpins = 0;

    // Initialize Minimalist Spin Wheel
    const wheel = new SpinWheel('wheelCanvas', {
        onSpinStart: () => {
            spinBtn.disabled = true;
            spinBtn.innerHTML = '<span>SPINNING...</span>';
        },
        onSpinComplete: (prize) => {
            spinBtn.disabled = false;
            spinBtn.innerHTML = '<span>SPIN NOW</span>';
            totalSpins++;
            
            // Show Winner Modal with Clean Prize Label
            if (winnerPrizeName) winnerPrizeName.textContent = prize.label;
            
            setTimeout(() => {
                winnerModal.classList.add('active');
            }, 300);
        }
    });

    // Spin Button Event Listener
    spinBtn.addEventListener('click', () => {
        if (!wheel.isSpinning) {
            wheel.spin();
        }
    });

    // Sound Toggle
    soundBtn.addEventListener('click', () => {
        if (window.soundEngine) {
            const muted = window.soundEngine.toggleMute();
            soundBtn.innerHTML = muted ? '🔇' : '🔊';
            soundBtn.title = muted ? 'Unmute Sound' : 'Mute Sound';
        }
    });

    // Fullscreen Toggle
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Fullscreen request error: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    // Close Winner Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            winnerModal.classList.remove('active');
        });
    }

    if (claimBtn) {
        claimBtn.addEventListener('click', () => {
            winnerModal.classList.remove('active');
        });
    }

    if (spinAgainBtn) {
        spinAgainBtn.addEventListener('click', () => {
            winnerModal.classList.remove('active');
            setTimeout(() => {
                if (!wheel.isSpinning) {
                    wheel.spin();
                }
            }, 300);
        });
    }

    // T&C Modal
    if (tcLink) {
        tcLink.addEventListener('click', (e) => {
            e.preventDefault();
            tcModal.classList.add('active');
        });
    }

    if (closeTcModalBtn) {
        closeTcModalBtn.addEventListener('click', () => {
            tcModal.classList.remove('active');
        });
    }

    // Close modals on clicking backdrop
    window.addEventListener('click', (e) => {
        if (e.target === winnerModal) {
            winnerModal.classList.remove('active');
        }
        if (e.target === tcModal) {
            tcModal.classList.remove('active');
        }
    });
});
