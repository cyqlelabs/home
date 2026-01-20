// Google Analytics gtag type definitions

interface Window {
  gtag: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: Record<string, any>,
  ) => void;
  dataLayer: any[];
}
