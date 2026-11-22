/**
 * Privacy-first no-op analytics stub.
 * External analytics, ad pixels, and session-replay scripts are intentionally omitted.
 */
export function safeTrack(
  _eventName: string,
  _properties?: Record<string, string | number | boolean | null | undefined>
): void {
  // Intentionally no-op: zero third-party tracking or telemetry payloads emitted.
}

export function trackCtaClick(_location: string, _label: string): void {}

export function trackBookingClick(_location: string = "direct"): void {}

export function trackCalculatorCompleted(_name: string): void {}

export function trackLeadSubmit(_topic: string): void {}

export function trackNewsletterSubmit(_source: string = "footer"): void {}

export function trackSubscriptionConfirmed(): void {}
