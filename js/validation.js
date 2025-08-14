/* ==================================================
   Form Validation Module
   ================================================== */

class FormValidator {
    constructor() {
        this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        this.errors = {
            REQUIRED: 'This field is required',
            INVALID_EMAIL: 'Please enter a valid email address',
            TOO_LONG: 'Email address is too long (maximum 254 characters)',
            DISPOSABLE_EMAIL: 'Please use a permanent email address',
            GENERIC_ERROR: 'Please check your email address and try again'
        };
        
        // Common disposable email domains to block
        this.disposableDomains = [
            '10minutemail.com',
            'tempmail.org',
            'guerrillamail.com',
            'mailinator.com',
            'temp-mail.org',
            'throwaway.email'
        ];
    }

    /**
     * Validates email format
     * @param {string} email - Email address to validate
     * @returns {Object} - Validation result with isValid and error properties
     */
    validateEmail(email) {
        const result = {
            isValid: false,
            error: null,
            value: email ? email.trim().toLowerCase() : ''
        };

        // Check if email is provided
        if (!result.value) {
            result.error = this.errors.REQUIRED;
            return result;
        }

        // Check length (RFC 5321 limit)
        if (result.value.length > 254) {
            result.error = this.errors.TOO_LONG;
            return result;
        }

        // Check email format
        if (!this.emailRegex.test(result.value)) {
            result.error = this.errors.INVALID_EMAIL;
            return result;
        }

        // Check for disposable email domains
        const domain = result.value.split('@')[1];
        if (this.disposableDomains.includes(domain)) {
            result.error = this.errors.DISPOSABLE_EMAIL;
            return result;
        }

        // Check for obviously fake emails
        if (this.isSuspiciousEmail(result.value)) {
            result.error = this.errors.INVALID_EMAIL;
            return result;
        }

        result.isValid = true;
        return result;
    }

    /**
     * Checks for suspicious email patterns
     * @param {string} email - Email to check
     * @returns {boolean} - True if email seems suspicious
     */
    isSuspiciousEmail(email) {
        const suspiciousPatterns = [
            /^test@/i,
            /^fake@/i,
            /^spam@/i,
            /^noreply@/i,
            /example\.com$/i,
            /localhost$/i,
            /\.local$/i,
            /^\d+@/,  // Numbers only as username
            /^[a-z]{1}@/i,  // Single character username
            /(.)\1{4,}@/i,  // Repeated characters (aaaaa@)
        ];

        return suspiciousPatterns.some(pattern => pattern.test(email));
    }

    /**
     * Real-time email validation with debouncing
     * @param {HTMLInputElement} input - Email input element
     * @param {Function} callback - Callback function for validation result
     * @param {number} delay - Debounce delay in milliseconds
     */
    validateEmailRealTime(input, callback, delay = 300) {
        let timeoutId;

        const validate = () => {
            const result = this.validateEmail(input.value);
            callback(result);
        };

        input.addEventListener('input', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(validate, delay);
        });

        // Immediate validation on blur
        input.addEventListener('blur', validate);
    }

    /**
     * Validates form data before submission
     * @param {FormData} formData - Form data to validate
     * @returns {Object} - Validation result
     */
    validateFormData(formData) {
        const result = {
            isValid: true,
            errors: {},
            data: {}
        };

        // Validate email
        const emailResult = this.validateEmail(formData.get('email'));
        if (!emailResult.isValid) {
            result.isValid = false;
            result.errors.email = emailResult.error;
        } else {
            result.data.email = emailResult.value;
        }

        return result;
    }

    /**
     * Sanitizes input to prevent XSS
     * @param {string} input - Input string to sanitize
     * @returns {string} - Sanitized string
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .trim()
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '');
    }

    /**
     * Shows validation error message
     * @param {HTMLElement} input - Input element
     * @param {string} message - Error message
     */
    showError(input, message) {
        // Add error class to input
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');

        // Find or create error element
        const errorId = input.getAttribute('aria-describedby')?.split(' ').find(id => id.includes('error'));
        let errorElement = errorId ? document.getElementById(errorId) : null;

        if (!errorElement) {
            errorElement = document.querySelector(`#${input.id}-error`);
        }

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
            errorElement.setAttribute('role', 'alert');
        }

        // Focus input if not already focused
        if (document.activeElement !== input) {
            input.focus();
        }
    }

    /**
     * Clears validation error
     * @param {HTMLElement} input - Input element
     */
    clearError(input) {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');

        const errorId = input.getAttribute('aria-describedby')?.split(' ').find(id => id.includes('error'));
        let errorElement = errorId ? document.getElementById(errorId) : null;

        if (!errorElement) {
            errorElement = document.querySelector(`#${input.id}-error`);
        }

        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
            errorElement.removeAttribute('role');
        }
    }

    /**
     * Validates email with enhanced checks
     * @param {string} email - Email to validate
     * @returns {Promise<Object>} - Validation result with additional checks
     */
    async validateEmailEnhanced(email) {
        const basicResult = this.validateEmail(email);
        
        if (!basicResult.isValid) {
            return basicResult;
        }

        // Additional async checks could go here in the future
        // For example: MX record validation, catch-all detection, etc.
        
        return basicResult;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}

// Global instance for immediate use
window.FormValidator = FormValidator;