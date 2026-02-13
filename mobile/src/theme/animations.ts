/**
 * Premium animation system for Dark Blue Light theme
 * Subtle, smooth, and elegant animations
 */

export const animations = {
    // Timing functions
    easing: {
        standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",      // Material Design standard
        decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",   // Decelerate
        accelerate: "cubic-bezier(0.4, 0.0, 1, 1)",     // Accelerate
        sharp: "cubic-bezier(0.4, 0.0, 0.6, 1)",        // Sharp
        smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",     // Smooth (iOS-like)
    },

    // Durations (in milliseconds)
    duration: {
        fast: 150,
        standard: 250,
        medium: 300,
        slow: 400,
        verySlow: 600,
    },

    // Common animation configurations
    fadeIn: {
        duration: 300,
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    },

    slideIn: {
        duration: 300,
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    },

    scale: {
        duration: 200,
        easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    },

    glow: {
        duration: 2000,
        easing: "ease-in-out",
    },
} as const;
