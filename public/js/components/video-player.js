/* ==================================================
   Video Player Component for Bento Grid
   ================================================== */

class VideoPlayer {
    constructor() {
        this.videoContainer = null;
        this.playButton = null;
        this.videoElement = null;
        this.placeholder = null;
        this.isVideoLoaded = false;
        this.isPlaying = false;
        
        // Video configuration
        this.videoConfig = {
            // Placeholder for future video URL
            videoUrl: null, // To be set when video content is available
            posterUrl: null, // Poster image URL
            autoplay: false,
            muted: true,
            controls: true,
            preload: 'metadata'
        };
        
        this.init();
    }

    /**
     * Initialize video player
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupVideoPlayer());
        } else {
            this.setupVideoPlayer();
        }
    }

    /**
     * Set up video player elements and events
     */
    setupVideoPlayer() {
        this.videoContainer = document.querySelector('.video-container');
        this.playButton = document.querySelector('.video-play-button');
        this.placeholder = document.querySelector('.video-placeholder');

        if (!this.videoContainer || !this.playButton) {
            console.warn('Video components not found');
            return;
        }

        this.setupEventListeners();
        this.setupAccessibility();
        
        // Add pulse animation to play button
        this.startPulseAnimation();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Play button click
        this.playButton.addEventListener('click', (e) => this.handlePlayClick(e));
        
        // Keyboard support for play button
        this.playButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handlePlayClick(e);
            }
        });

        // Video container click (when video is loaded)
        this.videoContainer.addEventListener('click', (e) => {
            if (this.videoElement && e.target !== this.playButton) {
                this.toggleVideoPlayback();
            }
        });

        // Handle video events (when video is loaded)
        if (this.videoElement) {
            this.setupVideoEvents();
        }
    }

    /**
     * Set up accessibility features
     */
    setupAccessibility() {
        // Ensure play button is properly labeled
        if (!this.playButton.getAttribute('aria-label')) {
            this.playButton.setAttribute('aria-label', 'Play career launch preview video');
        }

        // Add role to video container
        this.videoContainer.setAttribute('role', 'button');
        this.videoContainer.setAttribute('tabindex', '0');
        this.videoContainer.setAttribute('aria-label', 'Video preview - Click to play');
    }

    /**
     * Handle play button click
     * @param {Event} e - Click event
     */
    async handlePlayClick(e) {
        e.stopPropagation();
        
        if (this.videoConfig.videoUrl) {
            await this.loadAndPlayVideo();
        } else {
            this.showVideoComingSoon();
        }
    }

    /**
     * Load and play video
     */
    async loadAndPlayVideo() {
        if (!this.isVideoLoaded) {
            await this.createVideoElement();
        }

        if (this.videoElement) {
            this.toggleVideoPlayback();
        }
    }

    /**
     * Create video element
     */
    async createVideoElement() {
        try {
            // Remove placeholder
            if (this.placeholder) {
                this.placeholder.style.opacity = '0';
                setTimeout(() => {
                    if (this.placeholder.parentNode) {
                        this.placeholder.parentNode.removeChild(this.placeholder);
                    }
                }, 300);
            }

            // Create video element
            this.videoElement = document.createElement('video');
            this.videoElement.className = 'bento-video-element';
            this.videoElement.controls = this.videoConfig.controls;
            this.videoElement.muted = this.videoConfig.muted;
            this.videoElement.preload = this.videoConfig.preload;
            
            if (this.videoConfig.posterUrl) {
                this.videoElement.poster = this.videoConfig.posterUrl;
            }

            // Set source
            const source = document.createElement('source');
            source.src = this.videoConfig.videoUrl;
            source.type = 'video/mp4';
            this.videoElement.appendChild(source);

            // Add to container
            this.videoContainer.appendChild(this.videoElement);
            
            // Set up video events
            this.setupVideoEvents();
            
            // Load video
            await new Promise((resolve, reject) => {
                this.videoElement.addEventListener('loadeddata', resolve);
                this.videoElement.addEventListener('error', reject);
                this.videoElement.load();
            });

            this.isVideoLoaded = true;
            this.updatePlayButtonState();

        } catch (error) {
            console.error('Failed to load video:', error);
            this.showVideoError();
        }
    }

    /**
     * Set up video event listeners
     */
    setupVideoEvents() {
        if (!this.videoElement) return;

        this.videoElement.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButtonState();
            this.stopPulseAnimation();
            this.trackVideoEvent('video_play');
        });

        this.videoElement.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButtonState();
            this.trackVideoEvent('video_pause');
        });

        this.videoElement.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButtonState();
            this.startPulseAnimation();
            this.trackVideoEvent('video_complete');
        });

        this.videoElement.addEventListener('error', (e) => {
            console.error('Video playback error:', e);
            this.showVideoError();
        });

        // Progress tracking
        this.videoElement.addEventListener('timeupdate', () => {
            this.trackVideoProgress();
        });
    }

    /**
     * Toggle video playback
     */
    async toggleVideoPlayback() {
        if (!this.videoElement) return;

        try {
            if (this.isPlaying) {
                this.videoElement.pause();
            } else {
                await this.videoElement.play();
            }
        } catch (error) {
            console.error('Video playback error:', error);
            this.showVideoError();
        }
    }

    /**
     * Update play button state
     */
    updatePlayButtonState() {
        if (!this.playButton) return;

        if (this.isPlaying) {
            this.playButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
            `;
            this.playButton.setAttribute('aria-label', 'Pause video');
        } else {
            this.playButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
                </svg>
            `;
            this.playButton.setAttribute('aria-label', 'Play career launch preview video');
        }
    }

    /**
     * Show "Coming Soon" message
     */
    showVideoComingSoon() {
        if (this.placeholder) {
            const span = this.placeholder.querySelector('span');
            if (span) {
                const originalText = span.textContent;
                span.textContent = 'Coming Soon!';
                
                // Revert after 2 seconds
                setTimeout(() => {
                    span.textContent = originalText;
                }, 2000);
            }
        }

        // Add temporary visual feedback
        this.playButton.style.transform = 'translate(-50%, -50%) scale(1.2)';
        setTimeout(() => {
            this.playButton.style.transform = '';
        }, 200);

        this.trackVideoEvent('video_preview_clicked');
    }

    /**
     * Show video error state
     */
    showVideoError() {
        if (this.placeholder) {
            this.placeholder.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
                <span>Video Unavailable</span>
            `;
        }

        this.playButton.style.display = 'none';
    }

    /**
     * Start pulse animation for play button
     */
    startPulseAnimation() {
        if (this.playButton && !this.isPlaying) {
            this.playButton.classList.add('pulse');
        }
    }

    /**
     * Stop pulse animation for play button
     */
    stopPulseAnimation() {
        if (this.playButton) {
            this.playButton.classList.remove('pulse');
        }
    }

    /**
     * Track video progress for analytics
     */
    trackVideoProgress() {
        if (!this.videoElement || this.videoElement.duration === 0) return;

        const progress = (this.videoElement.currentTime / this.videoElement.duration) * 100;
        
        // Track quartile milestones
        if (progress >= 25 && !this.hasTracked25) {
            this.trackVideoEvent('video_25_percent');
            this.hasTracked25 = true;
        } else if (progress >= 50 && !this.hasTracked50) {
            this.trackVideoEvent('video_50_percent');
            this.hasTracked50 = true;
        } else if (progress >= 75 && !this.hasTracked75) {
            this.trackVideoEvent('video_75_percent');
            this.hasTracked75 = true;
        }
    }

    /**
     * Track video events
     * @param {string} event - Event name
     * @param {Object} properties - Event properties
     */
    trackVideoEvent(event, properties = {}) {
        console.log('Video event tracked:', event, properties);
        
        // Analytics integration would go here
        // Example:
        // if (window.gtag) {
        //     window.gtag('event', event, {
        //         event_category: 'Video',
        //         ...properties
        //     });
        // }
    }

    /**
     * Set video URL (for when video content becomes available)
     * @param {string} url - Video URL
     * @param {string} posterUrl - Optional poster image URL
     */
    setVideoUrl(url, posterUrl = null) {
        this.videoConfig.videoUrl = url;
        this.videoConfig.posterUrl = posterUrl;
        
        // Update placeholder text
        if (this.placeholder) {
            const span = this.placeholder.querySelector('span');
            if (span) {
                span.textContent = 'Click to Play';
            }
        }
        
        // Remove pulse animation since video is now available
        this.stopPulseAnimation();
    }

    /**
     * Preload video for better UX
     */
    preloadVideo() {
        if (this.videoConfig.videoUrl && !this.isVideoLoaded) {
            // Create video element but don't add to DOM yet
            const tempVideo = document.createElement('video');
            tempVideo.preload = 'metadata';
            tempVideo.muted = true;
            tempVideo.src = this.videoConfig.videoUrl;
            tempVideo.load();
            
            tempVideo.addEventListener('loadeddata', () => {
                console.log('Video preloaded successfully');
            });
        }
    }

    /**
     * Clean up video player
     */
    destroy() {
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.src = '';
            this.videoElement.load();
        }
        
        this.stopPulseAnimation();
        
        // Remove event listeners would go here if needed
    }
}

// Initialize video player when script loads
window.addEventListener('load', () => {
    window.videoPlayer = new VideoPlayer();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoPlayer;
}