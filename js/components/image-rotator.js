/* ==================================================
   Image Rotator Component
   Handles rotating hero images with smooth fade transitions
   ================================================== */

class ImageRotator {
    constructor(options = {}) {
        this.options = {
            container: '.image-column',
            imageSelector: '.hero-image',
            interval: 4000, // 4 seconds
            fadeDuration: 300, // 300ms fade
            pauseOnHover: true,
            pauseOnVisibilityChange: true,
            ...options
        };

        // Image paths array
        this.images = [
            'images/careers/career-tech-woman.jpg',
            'images/careers/career-engineering.jpg',
            'images/careers/career-diverse-team.jpg',
            'images/careers/career-healthcare.jpg',
            'images/careers/career-business-meeting.jpg',
            'images/careers/career-construction.jpg',
            'images/careers/career-office-work.jpg',
            'images/careers/career-collaboration.jpg',
            'images/careers/career-meeting-room.jpg',
            'images/careers/career-modern-workspace.jpg'
        ];

        this.currentIndex = 0;
        this.intervalId = null;
        this.isPaused = false;
        this.isVisible = true;
        this.preloadedImages = new Map();
        
        this.container = null;
        this.currentImageElement = null;
        this.nextImageElement = null;

        this.init();
    }

    /**
     * Initialize the image rotator
     */
    init() {
        try {
            this.container = document.querySelector(this.options.container);
            if (!this.container) {
                console.warn('ImageRotator: Container not found');
                return;
            }

            this.currentImageElement = this.container.querySelector(this.options.imageSelector);
            if (!this.currentImageElement) {
                console.warn('ImageRotator: Image element not found');
                return;
            }

            // Create second image element for cross-fade
            this.createSecondImageElement();

            // Preload all images
            this.preloadImages();

            // Set up event listeners
            this.setupEventListeners();

            // Start rotation
            this.startRotation();

            console.log('ImageRotator: Initialized with', this.images.length, 'images');
        } catch (error) {
            console.error('ImageRotator: Initialization failed', error);
        }
    }

    /**
     * Create second image element for seamless cross-fade
     */
    createSecondImageElement() {
        this.nextImageElement = this.currentImageElement.cloneNode(true);
        this.nextImageElement.classList.add('hero-image-next');
        this.nextImageElement.style.position = 'absolute';
        this.nextImageElement.style.top = '0';
        this.nextImageElement.style.left = '0';
        this.nextImageElement.style.opacity = '0';
        this.nextImageElement.style.zIndex = '1';
        this.nextImageElement.style.transition = `opacity ${this.options.fadeDuration}ms ease-in-out`;
        
        // Set z-index for current image
        this.currentImageElement.style.zIndex = '2';
        this.currentImageElement.style.transition = `opacity ${this.options.fadeDuration}ms ease-in-out`;
        
        this.currentImageElement.parentNode.appendChild(this.nextImageElement);
    }

    /**
     * Preload all images for smooth transitions
     */
    async preloadImages() {
        const promises = this.images.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.preloadedImages.set(src, img);
                    resolve(src);
                };
                img.onerror = () => {
                    console.warn('ImageRotator: Failed to load image:', src);
                    reject(src);
                };
                img.src = src;
            });
        });

        try {
            const loadedImages = await Promise.allSettled(promises);
            const successful = loadedImages.filter(result => result.status === 'fulfilled').length;
            console.log(`ImageRotator: Preloaded ${successful}/${this.images.length} images`);
            
            // Remove failed images from rotation
            this.images = this.images.filter(src => this.preloadedImages.has(src));
            
            if (this.images.length === 0) {
                console.warn('ImageRotator: No images successfully loaded');
                return;
            }

            // Set initial image if different from current
            if (this.currentImageElement.src !== this.getFullImagePath(this.images[0])) {
                this.currentImageElement.src = this.images[0];
            }
        } catch (error) {
            console.error('ImageRotator: Error preloading images', error);
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Pause on hover (optional)
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.pause());
            this.container.addEventListener('mouseleave', () => this.resume());
        }

        // Pause when tab is not visible (performance optimization)
        if (this.options.pauseOnVisibilityChange) {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pause();
                    this.isVisible = false;
                } else {
                    this.isVisible = true;
                    if (!this.isPaused) {
                        this.resume();
                    }
                }
            });
        }

        // Respect reduced motion preferences
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotionQuery.matches) {
            this.options.fadeDuration = 0; // No fade animation
        }
        
        reducedMotionQuery.addEventListener('change', (e) => {
            this.options.fadeDuration = e.matches ? 0 : 300;
            this.updateTransitions();
        });

        // Handle window resize for responsive adjustments
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    /**
     * Start the rotation interval
     */
    startRotation() {
        if (this.images.length <= 1) {
            console.log('ImageRotator: Not enough images for rotation');
            return;
        }

        this.intervalId = setInterval(() => {
            if (!this.isPaused && this.isVisible) {
                this.rotateToNext();
            }
        }, this.options.interval);
    }

    /**
     * Rotate to the next image
     */
    async rotateToNext() {
        if (this.images.length <= 1) return;

        const nextIndex = (this.currentIndex + 1) % this.images.length;
        const nextImageSrc = this.images[nextIndex];

        try {
            // Set next image source
            this.nextImageElement.src = nextImageSrc;
            
            // Update alt text for accessibility
            this.nextImageElement.alt = this.generateAltText(nextIndex);

            // Fade in next image
            this.nextImageElement.style.opacity = '1';
            this.currentImageElement.style.opacity = '0';

            // Wait for transition to complete
            await this.waitForTransition();

            // Swap elements
            this.swapImageElements();

            // Update current index
            this.currentIndex = nextIndex;

        } catch (error) {
            console.error('ImageRotator: Error during rotation', error);
        }
    }

    /**
     * Generate appropriate alt text for image
     */
    generateAltText(index) {
        const altTexts = [
            'Technology professional working on computer in modern office environment',
            'Engineering team collaborating on technical project with blueprints',
            'Diverse group of professionals discussing career opportunities',
            'Healthcare professional in medical setting providing patient care',
            'Business professionals in meeting discussing strategic planning',
            'Construction worker in safety gear on active building site',
            'Office workers collaborating in contemporary workplace setting',
            'Team members working together on collaborative project',
            'Professional meeting in modern conference room environment',
            'Modern workspace with professionals collaborating in bright office setting'
        ];
        
        return altTexts[index] || 'Career professionals in various work environments';
    }

    /**
     * Wait for CSS transition to complete
     */
    waitForTransition() {
        return new Promise(resolve => {
            setTimeout(resolve, this.options.fadeDuration + 50); // Add buffer
        });
    }

    /**
     * Swap the current and next image elements
     */
    swapImageElements() {
        // Swap references
        [this.currentImageElement, this.nextImageElement] = [this.nextImageElement, this.currentImageElement];
        
        // Update z-index
        this.currentImageElement.style.zIndex = '2';
        this.nextImageElement.style.zIndex = '1';
        
        // Reset next image opacity
        this.nextImageElement.style.opacity = '0';
        this.currentImageElement.style.opacity = '1';
    }

    /**
     * Pause rotation
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resume rotation
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Stop rotation completely
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isPaused = true;
    }

    /**
     * Restart rotation
     */
    restart() {
        this.stop();
        this.isPaused = false;
        this.startRotation();
    }

    /**
     * Update transition durations
     */
    updateTransitions() {
        if (this.currentImageElement) {
            this.currentImageElement.style.transition = `opacity ${this.options.fadeDuration}ms ease-in-out`;
        }
        if (this.nextImageElement) {
            this.nextImageElement.style.transition = `opacity ${this.options.fadeDuration}ms ease-in-out`;
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Adjust object-position for different breakpoints if needed
        const width = window.innerWidth;
        let objectPosition = 'center center';

        if (width < 768) {
            // Mobile: focus on center top
            objectPosition = 'center top';
        } else if (width < 1024) {
            // Tablet: center
            objectPosition = 'center center';
        } else {
            // Desktop: center
            objectPosition = 'center center';
        }

        if (this.currentImageElement) {
            this.currentImageElement.style.objectPosition = objectPosition;
        }
        if (this.nextImageElement) {
            this.nextImageElement.style.objectPosition = objectPosition;
        }
    }

    /**
     * Get full image path
     */
    getFullImagePath(src) {
        if (src.startsWith('http') || src.startsWith('/')) {
            return src;
        }
        return new URL(src, window.location.origin).href;
    }

    /**
     * Debounce utility function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Get current image information
     */
    getCurrentImageInfo() {
        return {
            index: this.currentIndex,
            src: this.images[this.currentIndex],
            total: this.images.length,
            isPaused: this.isPaused,
            isVisible: this.isVisible
        };
    }

    /**
     * Cleanup when component is destroyed
     */
    destroy() {
        this.stop();
        
        // Remove event listeners
        if (this.container) {
            this.container.removeEventListener('mouseenter', () => this.pause());
            this.container.removeEventListener('mouseleave', () => this.resume());
        }

        // Remove next image element
        if (this.nextImageElement && this.nextImageElement.parentNode) {
            this.nextImageElement.parentNode.removeChild(this.nextImageElement);
        }

        // Clear preloaded images
        this.preloadedImages.clear();

        console.log('ImageRotator: Destroyed');
    }
}

// Make available globally
window.ImageRotator = ImageRotator;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageRotator;
}