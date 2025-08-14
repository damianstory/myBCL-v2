/* ==================================================
   Bento Grid Interactions Component
   ================================================== */

class BentoInteractions {
    constructor() {
        this.bentoBoxes = [];
        this.detailsBox = null;
        this.videoBox = null;
        this.observers = [];
        this.isReducedMotion = false;
        
        this.init();
    }

    /**
     * Initialize bento interactions
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupBentoInteractions());
        } else {
            this.setupBentoInteractions();
        }
        
        this.checkReducedMotion();
    }

    /**
     * Set up bento grid interactions
     */
    setupBentoInteractions() {
        this.bentoBoxes = Array.from(document.querySelectorAll('.bento-box'));
        this.detailsBox = document.querySelector('.bento-details');
        this.videoBox = document.querySelector('.bento-video');

        if (this.bentoBoxes.length === 0) {
            console.warn('No bento boxes found');
            return;
        }

        this.setupEventListeners();
        this.setupAccessibility();
        this.setupIntersectionObserver();
        this.setupTouchInteractions();
    }

    /**
     * Set up event listeners for bento boxes
     */
    setupEventListeners() {
        this.bentoBoxes.forEach((box, index) => {
            // Mouse interactions
            box.addEventListener('mouseenter', () => this.handleBoxHover(box, true));
            box.addEventListener('mouseleave', () => this.handleBoxHover(box, false));
            
            // Click interactions
            box.addEventListener('click', (e) => this.handleBoxClick(box, e));
            
            // Keyboard interactions
            box.addEventListener('keydown', (e) => this.handleBoxKeydown(box, e));
            
            // Focus events
            box.addEventListener('focus', () => this.handleBoxFocus(box));
            box.addEventListener('blur', () => this.handleBoxBlur(box));
        });

        // Handle resize for responsive adjustments
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    /**
     * Set up accessibility features
     */
    setupAccessibility() {
        this.bentoBoxes.forEach((box, index) => {
            // Make boxes focusable if they aren't already
            if (!box.hasAttribute('tabindex') && !box.querySelector('button, a, input')) {
                box.setAttribute('tabindex', '0');
            }

            // Add role if not present
            if (!box.hasAttribute('role')) {
                box.setAttribute('role', 'button');
            }

            // Add aria-label for better screen reader support
            if (!box.hasAttribute('aria-label')) {
                if (box.classList.contains('bento-details')) {
                    box.setAttribute('aria-label', 'Event details information');
                } else if (box.classList.contains('bento-video')) {
                    box.setAttribute('aria-label', 'Career launch preview video');
                }
            }

            // Add aria-describedby for additional context
            const content = box.querySelector('.detail-description, .video-placeholder span');
            if (content && !content.id) {
                content.id = `bento-desc-${index}`;
                box.setAttribute('aria-describedby', content.id);
            }
        });
    }

    /**
     * Set up intersection observer for animations
     */
    setupIntersectionObserver() {
        if (this.isReducedMotion) return;

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateBoxEntry(entry.target);
                }
            });
        }, observerOptions);

        this.bentoBoxes.forEach(box => {
            observer.observe(box);
        });

        this.observers.push(observer);
    }

    /**
     * Set up touch interactions for mobile
     */
    setupTouchInteractions() {
        if (!('ontouchstart' in window)) return;

        this.bentoBoxes.forEach(box => {
            let touchStartTime = 0;
            let touchStartPos = { x: 0, y: 0 };

            box.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                touchStartPos = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
                
                this.handleTouchStart(box, e);
            }, { passive: true });

            box.addEventListener('touchend', (e) => {
                const touchEndTime = Date.now();
                const touchDuration = touchEndTime - touchStartTime;
                
                // Only treat as tap if duration is short and position didn't change much
                if (touchDuration < 500) {
                    const touch = e.changedTouches[0];
                    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
                    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
                    
                    if (deltaX < 10 && deltaY < 10) {
                        this.handleTouchTap(box, e);
                    }
                }
                
                this.handleTouchEnd(box, e);
            }, { passive: true });
        });
    }

    /**
     * Handle box hover interactions
     * @param {HTMLElement} box - Bento box element
     * @param {boolean} isHovering - Whether mouse is hovering
     */
    handleBoxHover(box, isHovering) {
        if (this.isReducedMotion) return;

        if (isHovering) {
            box.classList.add('hovered');
            this.elevateBox(box);
            this.trackInteraction('bento_hover', { box: this.getBoxType(box) });
        } else {
            box.classList.remove('hovered');
            this.resetBoxElevation(box);
        }
    }

    /**
     * Handle box click interactions
     * @param {HTMLElement} box - Bento box element
     * @param {Event} e - Click event
     */
    handleBoxClick(box, e) {
        // Don't handle click if it's on a child interactive element
        if (e.target !== box && (e.target.tagName === 'BUTTON' || e.target.tagName === 'A')) {
            return;
        }

        this.activateBox(box);
        this.trackInteraction('bento_click', { 
            box: this.getBoxType(box),
            timestamp: Date.now()
        });

        // Specific behavior for different box types
        if (box.classList.contains('bento-details')) {
            this.handleDetailsBoxClick(box);
        } else if (box.classList.contains('bento-video')) {
            this.handleVideoBoxClick(box);
        }
    }

    /**
     * Handle keyboard interactions
     * @param {HTMLElement} box - Bento box element
     * @param {Event} e - Keyboard event
     */
    handleBoxKeydown(box, e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleBoxClick(box, e);
        } else if (e.key === 'Escape') {
            box.blur();
        }
    }

    /**
     * Handle box focus
     * @param {HTMLElement} box - Bento box element
     */
    handleBoxFocus(box) {
        box.classList.add('focused');
        this.announceBoxContent(box);
    }

    /**
     * Handle box blur
     * @param {HTMLElement} box - Bento box element
     */
    handleBoxBlur(box) {
        box.classList.remove('focused');
    }

    /**
     * Handle touch start
     * @param {HTMLElement} box - Bento box element
     * @param {Event} e - Touch event
     */
    handleTouchStart(box, e) {
        box.classList.add('touched');
        
        // Add visual feedback for touch
        if (!this.isReducedMotion) {
            this.addTouchRipple(box, e.touches[0]);
        }
    }

    /**
     * Handle touch end
     * @param {HTMLElement} box - Bento box element
     * @param {Event} e - Touch event
     */
    handleTouchEnd(box, e) {
        box.classList.remove('touched');
    }

    /**
     * Handle touch tap
     * @param {HTMLElement} box - Bento box element
     * @param {Event} e - Touch event
     */
    handleTouchTap(box, e) {
        this.handleBoxClick(box, e);
    }

    /**
     * Handle details box specific interactions
     * @param {HTMLElement} box - Details box element
     */
    handleDetailsBoxClick(box) {
        // Could implement details expansion, modal, or other interactions
        this.pulseBox(box);
    }

    /**
     * Handle video box specific interactions
     * @param {HTMLElement} box - Video box element
     */
    handleVideoBoxClick(box) {
        // Video interactions are handled by the VideoPlayer component
        // This just provides visual feedback
        this.pulseBox(box);
    }

    /**
     * Animate box entry when scrolled into view
     * @param {HTMLElement} box - Bento box element
     */
    animateBoxEntry(box) {
        if (this.isReducedMotion) return;

        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        
        // Stagger animation for multiple boxes
        const delay = Array.from(this.bentoBoxes).indexOf(box) * 100;
        
        setTimeout(() => {
            box.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
        }, delay);
    }

    /**
     * Elevate box on hover
     * @param {HTMLElement} box - Bento box element
     */
    elevateBox(box) {
        if (this.isReducedMotion) return;
        
        box.style.transform = 'translateY(-4px) scale(1.02)';
        box.style.boxShadow = '0 12px 32px rgba(0, 146, 255, 0.15)';
    }

    /**
     * Reset box elevation
     * @param {HTMLElement} box - Bento box element
     */
    resetBoxElevation(box) {
        if (this.isReducedMotion) return;
        
        box.style.transform = '';
        box.style.boxShadow = '';
    }

    /**
     * Activate box with visual feedback
     * @param {HTMLElement} box - Bento box element
     */
    activateBox(box) {
        if (this.isReducedMotion) return;

        box.classList.add('activated');
        
        setTimeout(() => {
            box.classList.remove('activated');
        }, 200);
    }

    /**
     * Pulse box animation
     * @param {HTMLElement} box - Bento box element
     */
    pulseBox(box) {
        if (this.isReducedMotion) return;

        box.style.animation = 'none';
        box.offsetHeight; // Trigger reflow
        box.style.animation = 'pulse 0.6s ease-out';
        
        setTimeout(() => {
            box.style.animation = '';
        }, 600);
    }

    /**
     * Add touch ripple effect
     * @param {HTMLElement} box - Bento box element
     * @param {Touch} touch - Touch object
     */
    addTouchRipple(box, touch) {
        const rect = box.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.className = 'touch-ripple';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(0, 146, 255, 0.3)';
        ripple.style.pointerEvents = 'none';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.left = `${touch.clientX - rect.left - 10}px`;
        ripple.style.top = `${touch.clientY - rect.top - 10}px`;
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        box.style.position = 'relative';
        box.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    /**
     * Announce box content to screen readers
     * @param {HTMLElement} box - Bento box element
     */
    announceBoxContent(box) {
        const announcement = box.getAttribute('aria-label') || 
                            box.querySelector('.detail-title')?.textContent || 
                            'Bento box focused';
        
        this.announceToScreenReader(announcement);
    }

    /**
     * Get box type for analytics
     * @param {HTMLElement} box - Bento box element
     * @returns {string} - Box type
     */
    getBoxType(box) {
        if (box.classList.contains('bento-details')) return 'details';
        if (box.classList.contains('bento-video')) return 'video';
        return 'unknown';
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Responsive adjustments if needed
        this.checkReducedMotion();
    }

    /**
     * Check for reduced motion preference
     */
    checkReducedMotion() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (this.isReducedMotion) {
            // Remove animations from all boxes
            this.bentoBoxes.forEach(box => {
                box.style.transition = 'none';
                box.style.animation = 'none';
            });
        }
    }

    /**
     * Track interaction events
     * @param {string} event - Event name
     * @param {Object} properties - Event properties
     */
    trackInteraction(event, properties = {}) {
        console.log('Bento interaction tracked:', event, properties);
        
        // Analytics integration would go here
        // Example:
        // if (window.gtag) {
        //     window.gtag('event', event, {
        //         event_category: 'Bento_Grid',
        //         ...properties
        //     });
        // }
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        let announcements = document.getElementById('bento-announcements');
        
        if (!announcements) {
            announcements = document.createElement('div');
            announcements.id = 'bento-announcements';
            announcements.className = 'visually-hidden';
            announcements.setAttribute('aria-live', 'polite');
            announcements.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcements);
        }
        
        announcements.textContent = message;
        
        setTimeout(() => {
            announcements.textContent = '';
        }, 1000);
    }

    /**
     * Utility debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
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
     * Clean up interactions
     */
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        
        // Remove event listeners (would need to track them to remove properly)
        // In production, you'd want to store references to remove them
    }
}

// Add ripple animation CSS if it doesn't exist
if (!document.getElementById('bento-ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'bento-ripple-styles';
    style.textContent = `
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize bento interactions when script loads
window.addEventListener('load', () => {
    window.bentoInteractions = new BentoInteractions();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BentoInteractions;
}