type AnalyticsEvent = {
  name: string
  properties?: Record<string, any>
}

export const analytics = {
  track: (eventName: string, properties?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event)
    }
    
    // TODO: Integrate with PostHog or other analytics service
  },
}