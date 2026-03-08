/**
 * Reusable style constants to avoid duplication and improve webpack caching
 */

// Noise texture SVG - used for grainy background effects
export const NOISE_TEXTURE_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

// Reusable style objects
export const noiseTextureStyle = {
  backgroundImage: NOISE_TEXTURE_URL,
  backgroundRepeat: 'repeat' as const,
}
