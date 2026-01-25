// Google Analytics event tracking utilities

export const trackEvent = (
  eventName: string,
  eventParams?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    event_callback?: () => void;
    [key: string]: any;
  },
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      ...eventParams,
      transport_type: 'beacon', // Use beacon API for reliable delivery on page unload
    });
  }
};

// Predefined event tracking functions for common CTAs
export const trackCTA = {
  powerOnButton: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'CTA',
      event_label: 'Power On Button - Hero',
      button_location: 'hero_section',
      button_text: 'Start Engine',
      destination: 'https://app.cyqle.in',
      event_callback: callback,
    });
  },

  moreInfoButton: () => {
    trackEvent('click', {
      event_category: 'Navigation',
      event_label: 'More Info Button - Hero',
      button_location: 'hero_section',
      button_text: 'More Info',
    });
  },

  bookDemo: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'CTA',
      event_label: 'Book Demo - Hero',
      button_location: 'hero_section',
      button_text: 'Book Demo',
      destination: 'mailto:demo@cyqle.in',
      event_callback: callback,
    });
  },

  pricingPlan: (planName: string, pricingMode: string, tier?: string) => {
    trackEvent('click', {
      event_category: 'Pricing',
      event_label: `${planName} - ${pricingMode}${tier ? ` - ${tier}` : ''}`,
      button_location: 'pricing_section',
      plan_name: planName,
      pricing_mode: pricingMode,
      ...(tier && { tier }),
    });
  },

  ctaStartTrial: () => {
    trackEvent('click', {
      event_category: 'CTA',
      event_label: 'Get Started Now - Bottom CTA',
      button_location: 'bottom_cta_section',
      button_text: 'Get Started Now',
    });
  },

  ctaScheduleDemo: () => {
    trackEvent('click', {
      event_category: 'CTA',
      event_label: 'Schedule Demo - Bottom CTA',
      button_location: 'bottom_cta_section',
      button_text: 'Schedule Demo',
    });
  },

  navbarTryForFree: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'CTA',
      event_label: 'Try for Free - Navbar',
      button_location: 'navbar',
      button_text: 'Try for Free',
      destination: 'https://app.cyqle.in',
      event_callback: callback,
    });
  },

  aboutPageCTA: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'CTA',
      event_label: 'Try Cyqle Free - About Page',
      button_location: 'about_page_cta',
      button_text: 'Try Cyqle Free',
      destination: 'https://app.cyqle.in',
      event_callback: callback,
    });
  },

  exploreFeatures: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Navigation',
      event_label: 'Explore Features - AI Section',
      button_location: 'ai_section',
      button_text: 'Explore Features',
      destination: '#features',
      event_callback: callback,
    });
  },

  footerApiDocs: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Footer',
      event_label: 'API Documentation',
      button_location: 'footer_help_support',
      button_text: 'API Documentation',
      destination: 'https://api.cyqle.in/docs',
      event_callback: callback,
    });
  },

  footerContactSupport: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Footer',
      event_label: 'Contact Support',
      button_location: 'footer_help_support',
      button_text: 'Contact Support',
      destination: 'mailto:support@cyqle.in?subject=Support%20Request%20from%20Website',
      event_callback: callback,
    });
  },

  navbarFeatures: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Navigation',
      event_label: 'Features - Navbar',
      button_location: 'navbar',
      button_text: 'Features',
      destination: '#features',
      event_callback: callback,
    });
  },

  navbarUseCases: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Navigation',
      event_label: 'Use Cases - Navbar',
      button_location: 'navbar',
      button_text: 'Use Cases',
      destination: '#useCases',
      event_callback: callback,
    });
  },

  navbarPricing: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Navigation',
      event_label: 'Pricing - Navbar',
      button_location: 'navbar',
      button_text: 'Pricing',
      destination: '#pricing',
      event_callback: callback,
    });
  },

  navbarAbout: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Navigation',
      event_label: 'About - Navbar',
      button_location: 'navbar',
      button_text: 'About',
      event_callback: callback,
    });
  },

  footerHome: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Footer',
      event_label: 'Home - Logo',
      button_location: 'footer',
      button_text: 'Cyqle Logo',
      event_callback: callback,
    });
  },

  footerAbout: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Footer',
      event_label: 'About Us',
      button_location: 'footer_company',
      button_text: 'About Us',
      event_callback: callback,
    });
  },

  footerPrivacy: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Footer',
      event_label: 'Privacy Policy',
      button_location: 'footer_company',
      button_text: 'Privacy Policy',
      event_callback: callback,
    });
  },

  footerTerms: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Footer',
      event_label: 'Terms of Service',
      button_location: 'footer_company',
      button_text: 'Terms of Service',
      event_callback: callback,
    });
  },

  footerCookies: (callback?: () => void) => {
    trackEvent('click', {
      event_category: 'Footer',
      event_label: 'Cookies',
      button_location: 'footer_company',
      button_text: 'Cookies',
      event_callback: callback,
    });
  },
};

// Helper function for links that navigate away - ensures tracking completes before navigation
export const trackAndNavigate = (
  href: string,
  trackingFn: (callback?: () => void) => void,
  e?: React.MouseEvent,
) => {
  if (e) {
    e.preventDefault();
  }

  let navigated = false;
  const navigate = () => {
    if (!navigated) {
      navigated = true;
      window.location.href = href;
    }
  };

  // Track event with callback
  trackingFn(navigate);

  // Fallback: navigate after 300ms if callback hasn't fired
  setTimeout(navigate, 300);
};
