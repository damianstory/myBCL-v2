/* ==================================================
   Main Application Entry Point
   ================================================== */

class MyBlueprintCareerLaunch {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.performanceMetrics = {
            startTime: performance.now(),
            loadTime: null,
            firstContentfulPaint: null,
            domContentLoaded: null
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Track performance
        this.trackPerformanceMetrics();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMContentLoaded());
            window.addEventListener('load', () => this.onWindowLoad());
        } else if (document.readyState === 'interactive') {
            this.onDOMContentLoaded();
            window.addEventListener('load', () => this.onWindowLoad());
        } else {
            this.onDOMContentLoaded();
            this.onWindowLoad();
        }
    }

    /**
     * Handle DOM content loaded
     */
    onDOMContentLoaded() {
        this.performanceMetrics.domContentLoaded = performance.now();
        
        // Initialize critical components first
        this.initializeCriticalComponents();
        
        // Set up error handling
        this.setupGlobalErrorHandling();
        
        // Initialize accessibility features
        this.initializeAccessibility();
        
        console.log('myBlueprint Career Launch - DOM Content Loaded');
    }

    /**
     * Handle window load
     */
    onWindowLoad() {
        this.performanceMetrics.loadTime = performance.now();
        
        // Initialize non-critical components
        this.initializeEnhancementComponents();
        
        // Final setup
        this.finalizeInitialization();
        
        // Performance logging
        this.logPerformanceMetrics();
        
        console.log('myBlueprint Career Launch - Fully Loaded');
    }

    /**
     * Initialize critical components that are needed immediately
     */
    initializeCriticalComponents() {
        try {
            // Form handler is critical for the main CTA
            if (window.FormHandler) {
                this.components.formHandler = window.formHandler || new FormHandler();
            }
            
            // Basic accessibility is critical
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            
        } catch (error) {
            console.error('Failed to initialize critical components:', error);
            this.trackError('critical_component_init_failed', error);
        }
    }

    /**
     * Initialize enhancement components for better UX
     */
    initializeEnhancementComponents() {
        try {
            // Video player for bento grid
            if (window.VideoPlayer) {
                this.components.videoPlayer = window.videoPlayer || new VideoPlayer();
            }
            
            // Bento interactions for enhanced UX
            if (window.BentoInteractions) {
                this.components.bentoInteractions = window.bentoInteractions || new BentoInteractions();
            }
            
            // Image rotator for hero images
            if (window.ImageRotator) {
                this.components.imageRotator = window.imageRotator || new ImageRotator();
            }
            
            // Initialize smooth scrolling
            this.initializeSmoothScrolling();
            
            // Initialize lazy loading
            this.initializeLazyLoading();
            
        } catch (error) {
            console.error('Failed to initialize enhancement components:', error);
            this.trackError('enhancement_component_init_failed', error);
        }
    }

    /**
     * Initialize accessibility features
     */
    initializeAccessibility() {
        // Skip link for keyboard users
        this.createSkipLink();
        
        // High contrast detection
        this.detectHighContrastMode();
        
        // Reduced motion detection
        this.detectReducedMotionPreference();
        
        // Screen reader announcements
        this.setupScreenReaderAnnouncements();
        
        // Focus trap for modal-like interactions (if needed)
        this.setupFocusTrapping();
    }

    /**
     * Set up keyboard navigation
     */
    setupKeyboardNavigation() {
        // Tab order management
        const focusableElements = this.getFocusableElements();
        
        // ESC key handling for closing modals/overlays
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
        });
        
        // Arrow key navigation for bento grid
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.bento-grid')) {
                this.handleBentoNavigation(e);
            }
        });
    }

    /**
     * Set up focus management
     */
    setupFocusManagement() {
        // Focus visible polyfill for older browsers
        this.setupFocusVisible();
        
        // Track focus for analytics
        document.addEventListener('focusin', (e) => {
            this.trackFocusEvent(e.target);
        });
        
        // Manage focus on dynamic content
        this.setupDynamicFocusManagement();
    }

    /**
     * Create skip link for accessibility
     */
    createSkipLink() {
        if (document.getElementById('skip-link')) return;
        
        const skipLink = document.createElement('a');
        skipLink.id = 'skip-link';
        skipLink.href = '#signup-form';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        // Add styles
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-blue);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Initialize smooth scrolling for internal links
     */
    initializeSmoothScrolling() {
        // Only if user hasn't requested reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    /**
     * Initialize lazy loading for images
     */
    initializeLazyLoading() {
        // Native lazy loading support
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        // Intersection Observer fallback for older browsers
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        }
    }

    /**
     * Detect high contrast mode
     */
    detectHighContrastMode() {
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.documentElement.classList.add('high-contrast');
        }
        
        // Listen for changes
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            document.documentElement.classList.toggle('high-contrast', e.matches);
        });
    }

    /**
     * Detect reduced motion preference
     */
    detectReducedMotionPreference() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduced-motion');
        }
        
        // Listen for changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            document.documentElement.classList.toggle('reduced-motion', e.matches);
        });
    }

    /**
     * Set up screen reader announcements
     */
    setupScreenReaderAnnouncements() {
        // Create announcement region if it doesn't exist
        if (!document.getElementById('announcements')) {
            const announcements = document.createElement('div');
            announcements.id = 'announcements';
            announcements.setAttribute('aria-live', 'polite');
            announcements.setAttribute('aria-atomic', 'true');
            announcements.className = 'visually-hidden';
            document.body.appendChild(announcements);
        }
    }

    /**
     * Set up focus trapping for modal interactions
     */
    setupFocusTrapping() {
        // This would be used if we had modal dialogs
        // Implementation ready for future modal features
    }

    /**
     * Get all focusable elements on the page
     */
    getFocusableElements() {
        return document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }

    /**
     * Handle escape key press
     */
    handleEscapeKey(e) {
        // Close any open modals, dropdowns, etc.
        // For now, just blur the current element if it's a form element
        if (e.target.matches('input, textarea, select')) {
            e.target.blur();
        }
    }

    /**
     * Handle bento grid arrow key navigation
     */
    handleBentoNavigation(e) {
        const bentoBoxes = Array.from(document.querySelectorAll('.bento-box'));
        const currentIndex = bentoBoxes.indexOf(e.target);
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        
        switch (e.key) {
            case 'ArrowUp':
                nextIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowDown':
                nextIndex = Math.min(bentoBoxes.length - 1, currentIndex + 1);
                break;
            default:
                return;
        }
        
        if (nextIndex !== undefined && bentoBoxes[nextIndex]) {
            e.preventDefault();
            bentoBoxes[nextIndex].focus();
        }
    }

    /**
     * Set up focus-visible polyfill
     */
    setupFocusVisible() {
        // Simple focus-visible implementation
        let hadKeyboardEvent = true;
        const keyboardThrottleTimeout = 100;
        
        function onPointerDown() {
            hadKeyboardEvent = false;
        }
        
        function onKeyDown(e) {
            if (e.metaKey || e.altKey || e.ctrlKey) {
                return;
            }
            hadKeyboardEvent = true;
        }
        
        function onFocus(e) {
            if (hadKeyboardEvent || e.target.matches(':focus-visible')) {
                e.target.classList.add('focus-visible');
            }
        }
        
        function onBlur(e) {
            e.target.classList.remove('focus-visible');
        }
        
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('mousedown', onPointerDown, true);
        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('touchstart', onPointerDown, true);
        document.addEventListener('focus', onFocus, true);
        document.addEventListener('blur', onBlur, true);
    }

    /**
     * Set up dynamic focus management
     */
    setupDynamicFocusManagement() {
        // Handle focus when content changes dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // Check if new focusable elements were added
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const focusableElements = node.querySelectorAll(
                                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                            );
                            
                            // Set up focus management for new elements
                            focusableElements.forEach(element => {
                                this.setupElementFocus(element);
                            });
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Set up focus for individual elements
     */
    setupElementFocus(element) {
        // Add focus event listeners for new elements
        element.addEventListener('focus', () => {
            this.trackFocusEvent(element);
        });
    }

    /**
     * Track focus events for analytics
     */
    trackFocusEvent(element) {
        // Track which elements users focus on
        const elementType = element.tagName.toLowerCase();
        const elementId = element.id;
        const elementClass = element.className;
        
        // Analytics would go here
        console.log('Focus event:', { elementType, elementId, elementClass });
    }

    /**
     * Set up global error handling
     */
    setupGlobalErrorHandling() {
        // Catch JavaScript errors
        window.addEventListener('error', (e) => {
            this.trackError('javascript_error', e.error);
        });
        
        // Catch promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.trackError('unhandled_promise_rejection', e.reason);
        });
    }

    /**
     * Track performance metrics
     */
    trackPerformanceMetrics() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.name === 'first-contentful-paint') {
                            this.performanceMetrics.firstContentfulPaint = entry.startTime;
                        }
                    });
                });
                observer.observe({ entryTypes: ['paint'] });
            } catch (e) {
                // PerformanceObserver not fully supported
            }
        }
    }

    /**
     * Log performance metrics
     */
    logPerformanceMetrics() {
        const metrics = {
            loadTime: Math.round(this.performanceMetrics.loadTime - this.performanceMetrics.startTime),
            domContentLoaded: Math.round(this.performanceMetrics.domContentLoaded - this.performanceMetrics.startTime),
            firstContentfulPaint: this.performanceMetrics.firstContentfulPaint
        };
        
        console.log('Performance Metrics:', metrics);
        
        // Track metrics for analytics
        this.trackPerformance(metrics);
    }

    /**
     * Track performance for analytics
     */
    trackPerformance(metrics) {
        // Analytics integration would go here
        console.log('Performance tracked:', metrics);
    }

    /**
     * Track errors for monitoring
     */
    trackError(type, error) {
        const errorInfo = {
            type,
            message: error?.message || error,
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.error('Error tracked:', errorInfo);
        
        // Error monitoring service integration would go here
        // Example: Sentry, LogRocket, etc.
    }

    /**
     * Finalize initialization
     */
    finalizeInitialization() {
        this.isInitialized = true;
        
        // Dispatch custom event for other scripts
        window.dispatchEvent(new CustomEvent('myBlueprintReady', {
            detail: {
                components: Object.keys(this.components),
                performanceMetrics: this.performanceMetrics
            }
        }));
        
        // Remove loading states
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }

    /**
     * Get component instance
     */
    getComponent(name) {
        return this.components[name];
    }

    /**
     * Check if application is fully loaded
     */
    isLoaded() {
        return this.isInitialized;
    }

    /**
     * Cleanup components when page is unloaded
     */
    destroy() {
        // Cleanup components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                try {
                    component.destroy();
                } catch (error) {
                    console.error('Error destroying component:', error);
                }
            }
        });

        // Clear components
        this.components = {};
        this.isInitialized = false;

        console.log('myBlueprint Career Launch - Application destroyed');
    }
}

// Initialize the application
const app = new MyBlueprintCareerLaunch();

// Make available globally
window.myBlueprintApp = app;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (app && typeof app.destroy === 'function') {
        app.destroy();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MyBlueprintCareerLaunch;
}