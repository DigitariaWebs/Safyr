/**
 * Safyr Design System — Asset Registry
 * All image URLs, logo paths, and icon references live here.
 */

export const assets = {
  logo: {
    src: "/logo.png",
    alt: "Safyr — Management & Security Platform",
    width: 120, // intrinsic display width in navbar
    height: 56, // intrinsic display height in navbar
    footerWidth: 140,
    footerHeight: 65,
  },

  // Hero & about section images (Pexels/Unsplash)
  images: {
    hero: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1400&auto=format&fit=crop&q=80",
    about:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=80",
    dashboard:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80",
    team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    hr: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
    payroll:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80",
    compliance:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=80",
    analytics:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
  },

  // Testimonial avatars
  avatars: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80",
  ],
} as const;
