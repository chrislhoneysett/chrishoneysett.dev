export {}

declare global {
  interface Window {
    umami?: {
      identify: (id: string, data?: Record<string, unknown>) => void
    }
  }
}
