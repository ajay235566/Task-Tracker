/**
 * Google Analytics Utility
 * Provides a type-safe way to send events to GA4
 */

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    console.warn(`Analytics: gtag not found. Event "${eventName}" not tracked.`, params);
  }
};

// Predefined event types for consistency
export const AnalyticsEvents = {
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  TASK_CREATED: 'task_created',
  TASK_COMPLETED: 'task_completed',
  RESUME_CREATED: 'resume_created',
  RESUME_DOWNLOADED: 'resume_downloaded',
  XP_EARNED: 'xp_earned',
  LEVEL_UP: 'level_up',
  PAGE_VIEW: 'page_view',
  SETTINGS_UPDATED: 'settings_updated',
};
