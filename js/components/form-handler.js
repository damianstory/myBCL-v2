/* ==================================================
   Form Handler for Zoho API Integration
   ================================================== */

class FormHandler {
    constructor() {
        this.validator = new FormValidator();
        this.form = null;
        this.emailInput = null;
        this.submitButton = null;
        this.errorElement = null;
        this.successElement = null;
        
        // Zoho API configuration (to be updated with real credentials)
        this.apiConfig = {
            endpoint: 'https://forms.zohopublic.com/api/v1/json/forms/{form_id}/entries',
            timeout: 10000,
            maxRetries: 3,
            retryDelay: 1000
        };
        
        this.isSubmitting = false;
        this.submitAttempts = 0;
        
        this.init();
    }

    /**
     * Initialize form handler
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupForm());
        } else {
            this.setupForm();
        }
    }

    /**
     * Set up form elements and event listeners
     */
    setupForm() {
        this.form = document.getElementById('signup-form');
        this.emailInput = document.getElementById('email');
        this.submitButton = this.form?.querySelector('.cta-button');
        this.errorElement = document.getElementById('email-error');
        this.successElement = document.getElementById('form-success');

        if (!this.form || !this.emailInput || !this.submitButton) {
            console.error('Required form elements not found');
            return;
        }

        this.setupEventListeners();
        this.setupAccessibility();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time email validation
        this.validator.validateEmailRealTime(
            this.emailInput,
            (result) => this.handleValidation(result),
            300
        );

        // Enter key handling
        this.emailInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmit(e);
            }
        });

        // Prevent multiple submissions
        this.submitButton.addEventListener('click', (e) => {
            if (this.isSubmitting) {
                e.preventDefault();
                return false;
            }
        });

        // Clear success message when user starts typing again
        this.emailInput.addEventListener('input', () => {
            if (this.successElement.classList.contains('visible')) {
                this.hideSuccess();
                this.resetForm();
            }
        });
    }

    /**
     * Set up accessibility features
     */
    setupAccessibility() {
        // Ensure proper ARIA relationships
        if (!this.emailInput.getAttribute('aria-describedby')) {
            this.emailInput.setAttribute('aria-describedby', 'email-help email-error');
        }

        // Live region for announcements
        if (!document.getElementById('form-announcements')) {
            const announcements = document.createElement('div');
            announcements.id = 'form-announcements';
            announcements.setAttribute('aria-live', 'polite');
            announcements.setAttribute('aria-atomic', 'true');
            announcements.className = 'visually-hidden';
            document.body.appendChild(announcements);
        }
    }

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        // Validate form
        const formData = new FormData(this.form);
        const validation = this.validator.validateFormData(formData);

        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }

        this.isSubmitting = true;
        this.setLoadingState(true);
        
        try {
            const result = await this.submitToZoho(validation.data);
            
            if (result.success) {
                this.handleSuccess(result);
                this.trackConversion('email_signup_success');
            } else {
                this.handleError(result.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleError(this.getErrorMessage(error));
        } finally {
            this.isSubmitting = false;
            this.setLoadingState(false);
        }
    }

    /**
     * Submit data to Zoho API
     * @param {Object} data - Validated form data
     * @returns {Promise<Object>} - Submission result
     */
    async submitToZoho(data) {
        const payload = {
            email: data.email,
            source: 'myblueprint-career-launch-landing',
            timestamp: new Date().toISOString(),
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            event: 'career-launch-agenda-signup'
        };

        // For development/testing, simulate API call
        if (this.isDevelopment()) {
            return this.simulateApiCall(payload);
        }

        return this.makeApiCall(payload);
    }

    /**
     * Make actual API call to Zoho
     * @param {Object} payload - Data to submit
     * @returns {Promise<Object>} - API response
     */
    async makeApiCall(payload, retryCount = 0) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiConfig.timeout);

        try {
            const response = await fetch(this.apiConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return { success: true, data: result };

        } catch (error) {
            clearTimeout(timeoutId);

            // Retry logic
            if (retryCount < this.apiConfig.maxRetries && !controller.signal.aborted) {
                await this.delay(this.apiConfig.retryDelay * (retryCount + 1));
                return this.makeApiCall(payload, retryCount + 1);
            }

            throw error;
        }
    }

    /**
     * Simulate API call for development
     * @param {Object} payload - Data to submit
     * @returns {Promise<Object>} - Simulated response
     */
    async simulateApiCall(payload) {
        console.log('Development mode: Simulating Zoho API call', payload);
        
        // Simulate network delay
        await this.delay(1500);

        // Simulate success with occasional failures for testing
        if (Math.random() < 0.9) {
            return {
                success: true,
                data: {
                    id: 'test-' + Date.now(),
                    email: payload.email,
                    status: 'subscribed'
                }
            };
        } else {
            throw new Error('Simulated API failure for testing');
        }
    }

    /**
     * Handle successful form submission
     * @param {Object} result - Success result from API
     */
    handleSuccess(result) {
        this.showSuccess('Thank you! We\'ll notify you as soon as the agenda is available.');
        this.announceToScreenReader('Email submitted successfully. You will receive notifications about the career launch agenda.');
        
        // Reset form after delay
        setTimeout(() => {
            this.resetForm();
        }, 5000);

        // Set button to success state
        this.submitButton.classList.add('success');
        setTimeout(() => {
            this.submitButton.classList.remove('success');
        }, 3000);
    }

    /**
     * Handle form submission errors
     * @param {string} error - Error message
     */
    handleError(error) {
        const message = this.getErrorMessage(error);
        this.showError(message);
        this.announceToScreenReader(`Form submission failed: ${message}`);
        
        // Focus back to email input
        this.emailInput.focus();
    }

    /**
     * Handle real-time validation results
     * @param {Object} result - Validation result
     */
    handleValidation(result) {
        if (result.isValid) {
            this.validator.clearError(this.emailInput);
        } else if (result.error && this.emailInput.value.length > 0) {
            this.validator.showError(this.emailInput, result.error);
        }
    }

    /**
     * Show validation errors
     * @param {Object} errors - Validation errors
     */
    showValidationErrors(errors) {
        if (errors.email) {
            this.validator.showError(this.emailInput, errors.email);
            this.emailInput.focus();
        }
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        if (this.successElement) {
            this.successElement.textContent = message;
            this.successElement.classList.add('visible');
        }
        
        // Hide any error messages
        this.validator.clearError(this.emailInput);
    }

    /**
     * Hide success message
     */
    hideSuccess() {
        if (this.successElement) {
            this.successElement.classList.remove('visible');
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.validator.showError(this.emailInput, message);
    }

    /**
     * Set loading state
     * @param {boolean} loading - Whether form is loading
     */
    setLoadingState(loading) {
        if (loading) {
            this.submitButton.classList.add('loading');
            this.submitButton.disabled = true;
            this.submitButton.setAttribute('aria-busy', 'true');
            this.emailInput.disabled = true;
        } else {
            this.submitButton.classList.remove('loading');
            this.submitButton.disabled = false;
            this.submitButton.setAttribute('aria-busy', 'false');
            this.emailInput.disabled = false;
        }
    }

    /**
     * Reset form to initial state
     */
    resetForm() {
        this.form.reset();
        this.validator.clearError(this.emailInput);
        this.hideSuccess();
        this.submitButton.classList.remove('success');
        this.isSubmitting = false;
        this.submitAttempts = 0;
    }

    /**
     * Get user-friendly error message
     * @param {string|Error} error - Error object or message
     * @returns {string} - User-friendly error message
     */
    getErrorMessage(error) {
        const errorMessage = error?.message || error;
        
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
            return 'Please check your internet connection and try again.';
        }
        
        if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
            return 'Request timed out. Please try again.';
        }
        
        if (errorMessage.includes('400')) {
            return 'Invalid email address. Please check and try again.';
        }
        
        if (errorMessage.includes('429')) {
            return 'Too many requests. Please wait a moment and try again.';
        }
        
        if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
            return 'Service temporarily unavailable. Please try again in a few minutes.';
        }
        
        return 'Something went wrong. Please try again.';
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        const announcements = document.getElementById('form-announcements');
        if (announcements) {
            announcements.textContent = message;
            setTimeout(() => {
                announcements.textContent = '';
            }, 1000);
        }
    }

    /**
     * Check if running in development mode
     * @returns {boolean} - True if development mode
     */
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.protocol === 'file:' ||
               window.location.hostname.includes('dev') ||
               window.location.hostname.includes('staging');
    }

    /**
     * Track conversion events
     * @param {string} event - Event name
     * @param {Object} properties - Event properties
     */
    trackConversion(event, properties = {}) {
        // Analytics tracking would go here
        console.log('Conversion tracked:', event, properties);
        
        // Example for future analytics integration:
        // if (window.gtag) {
        //     window.gtag('event', event, properties);
        // }
        
        // if (window.fbq) {
        //     window.fbq('track', 'Lead', properties);
        // }
    }

    /**
     * Utility delay function
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} - Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize form handler when script loads
window.addEventListener('load', () => {
    window.formHandler = new FormHandler();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
}