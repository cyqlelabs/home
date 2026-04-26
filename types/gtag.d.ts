// Google Analytics gtag type definitions

interface Window {
  gtag: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: Record<string, any>,
  ) => void;
  dataLayer: any[];
  twq: (
    command: 'config' | 'event' | 'track',
    targetId: string,
    params?: Record<string, any>,
  ) => void;
}
