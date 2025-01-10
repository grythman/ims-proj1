import * as Sentry from '@sentry/react';

export class AppError extends Error {
    constructor(message, code, metadata = {}) {
        super(message);
        this.code = code;
        this.metadata = metadata;
    }
}

export const errorHandler = (error, componentStack) => {
    if (error instanceof AppError) {
        // Handle application-specific errors
        console.error(`App Error (${error.code}):`, error.message);
        if (process.env.NODE_ENV === 'production') {
            Sentry.captureException(error, {
                extra: {
                    code: error.code,
                    metadata: error.metadata,
                    componentStack
                }
            });
        }
    } else {
        // Handle unexpected errors
        console.error('Unexpected Error:', error);
        if (process.env.NODE_ENV === 'production') {
            Sentry.captureException(error, {
                extra: { componentStack }
            });
        }
    }
};

export const handleApiError = (error) => {
    console.error('API Error:', error);

    if (error.response) {
        // Server responded with error
        const { status, data } = error.response;
        
        switch (status) {
            case 400:
                return data.detail || 'Invalid request';
            case 401:
                return 'Authentication required';
            case 403:
                return 'Access denied';
            case 404:
                return 'Resource not found';
            case 500:
                return 'Server error';
            default:
                return data.detail || 'An error occurred';
        }
    } else if (error.request) {
        // Request made but no response
        return 'Network error';
    } else {
        // Something else happened
        return error.message || 'An unexpected error occurred';
    }
};

export const formatValidationErrors = (errors) => {
    if (typeof errors === 'string') return errors;
    if (Array.isArray(errors)) return errors.join(', ');
    if (typeof errors === 'object') {
        return Object.entries(errors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
    }
    return 'An error occurred';
}; 