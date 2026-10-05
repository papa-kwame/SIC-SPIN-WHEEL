/**
 * SIC Insurance Spin Wheel - Exclusive Official Photo Board Rotator
 * Dynamically rotates ONLY your official campaign photos from 'assets/photos/sic spin wheel/'.
 */

class PhotoBoardAnimator {
    constructor() {
        this.cards = Array.from(document.querySelectorAll('.photo-card'));
        
        // Exclusive Official SIC Campaign Photos
        this.photoPool = [
            'assets/photos/sic spin wheel/IMG_1081.JPG',
            'assets/photos/sic spin wheel/IMG_1094.JPG',
            'assets/photos/sic spin wheel/IMG_1098.JPG',
            'assets/photos/sic spin wheel/IMG_1102.JPG',
            'assets/photos/sic spin wheel/IMG_1141.JPG',
            'assets/photos/sic spin wheel/IMG_1151.JPG'
        ];

        this.poolIndex = 0;
        this.shufflePool();

        // Initialize cards with official photos
        this.cards.forEach((card, idx) => {
            const img = card.querySelector('img');
            if (img) {
                img.src = this.photoPool[idx % this.photoPool.length];
            }
        });

        if (this.cards.length >= 2 && window.innerWidth > 768) {
            this.startLoop();
        }
    }

    shufflePool() {
        for (let i = this.photoPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.photoPool[i], this.photoPool[j]] = [this.photoPool[j], this.photoPool[i]];
        }
    }

    getNextPhoto() {
        const photo = this.photoPool[this.poolIndex];
        this.poolIndex = (this.poolIndex + 1) % this.photoPool.length;
        return photo;
    }

    startLoop() {
        // Trigger pre-fade highlight and photo swap loop every 5 seconds
        setInterval(() => {
            if (window.innerWidth > 768) {
                this.highlightAndRotateTwoCards();
            }
        }, 5000);
    }

    highlightAndRotateTwoCards() {
        if (this.cards.length < 2) return;

        // Pick 2 random distinct card slots
        const idx1 = Math.floor(Math.random() * this.cards.length);
        let idx2 = Math.floor(Math.random() * this.cards.length);
        while (idx2 === idx1) {
            idx2 = Math.floor(Math.random() * this.cards.length);
        }

        const card1 = this.cards[idx1];
        const card2 = this.cards[idx2];
        const img1 = card1.querySelector('img');
        const img2 = card2.querySelector('img');

        if (!img1 || !img2) return;

        // Step 1: Pre-fade highlight (glow sky blue + scale up)
        card1.classList.add('about-to-fade');
        card2.classList.add('about-to-fade');

        // Step 2: After 1s highlight, initiate smooth fade out
        setTimeout(() => {
            card1.classList.remove('about-to-fade');
            card2.classList.remove('about-to-fade');

            card1.classList.add('fading-out');
            card2.classList.add('fading-out');

            // Step 3: Load fresh new photos from official pool while invisible
            setTimeout(() => {
                const nextPhoto1 = this.getNextPhoto();
                const nextPhoto2 = this.getNextPhoto();

                img1.src = nextPhoto1;
                img2.src = nextPhoto2;

                // Step 4: Fade cards back in smoothly
                card1.classList.remove('fading-out');
                card2.classList.remove('fading-out');
            }, 1400);

        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.photoBoardAnimator = new PhotoBoardAnimator();
});
