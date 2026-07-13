import manifest from '@/assets.manifest.json'

type Dimensions = { width: number; height: number }

const dimensions = manifest as Record<string, Dimensions>

/**
 * Resolve a public asset path against Vite's base URL so images load correctly
 * both at the domain root (dev) and under the /portfodio/ GitHub Pages subpath.
 */
export function asset(path: string): string {
  const clean = path.replace(/^\/+/, '')
  return import.meta.env.BASE_URL + clean
}

/** Intrinsic dimensions for an optimized image, used to reserve space (no CLS). */
export function assetSize(path: string): Dimensions | undefined {
  return dimensions[path.replace(/^\/+/, '')]
}
