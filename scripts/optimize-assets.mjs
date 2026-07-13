// One-off asset pipeline: source JPEGs in /assets -> optimized WebP in /public/assets.
// Also emits src/assets.manifest.json with intrinsic dimensions so <img> can carry
// width/height (prevents layout shift / CLS). Run: npm run optimize:assets
import sharp from 'sharp'
import { readdirSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

const SRC = 'assets'
const OUT = 'public/assets'
const MANIFEST = 'src/assets.manifest.json'
const MAX_EDGE = 1400 // cap longest side; portraits/figures never displayed larger
const QUALITY = 80

mkdirSync(OUT, { recursive: true })

const manifest = {}
const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f))

for (const file of files) {
  const name = basename(file, extname(file))
  const outFile = `${name}.webp`
  const pipeline = sharp(join(SRC, file)).rotate()
  const meta = await pipeline.metadata()

  const scale = Math.min(1, MAX_EDGE / Math.max(meta.width, meta.height))
  const w = Math.round(meta.width * scale)
  const h = Math.round(meta.height * scale)

  await pipeline
    .resize(w, h, { withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(join(OUT, outFile))

  const before = (statSync(join(SRC, file)).size / 1024) | 0
  const after = (statSync(join(OUT, outFile)).size / 1024) | 0
  manifest[`assets/${outFile}`] = { width: w, height: h }
  console.log(`${file} -> ${outFile}  ${w}x${h}  ${before}KB -> ${after}KB`)
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\nWrote ${MANIFEST} (${Object.keys(manifest).length} entries)`)
