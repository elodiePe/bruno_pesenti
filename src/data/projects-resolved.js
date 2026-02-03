import raw from '../assets/projects.json'

// Import all images in src/assets/img as URLs (Vite will emit hashed files in production)
const modules = import.meta.glob('../assets/img/**', { eager: true, query: '?url', import: 'default' })

function resolveImg(imgPath) {
  if (!imgPath) return ''
  if (typeof imgPath !== 'string') return imgPath

  const trimmed = imgPath.trim()
  // remote URL or protocol-relative
  if (/^(https?:)?\/\//i.test(trimmed)) return trimmed
  // public-root path (e.g. /assets/...) — leave as-is
  if (trimmed.startsWith('/')) return trimmed

  // Try a few candidate keys that match the glob keys
  const candidates = [
    trimmed,
    // './assets/img/Frame46.png' -> '../assets/img/Frame46.png'
    trimmed.replace(/^\.\//, '../'),
    // '../assets/img/Frame46.png' as-is
    trimmed.replace(/^\.\./, '..'),
    // fallback: filename-based
    `../assets/img/${trimmed.split('/').pop()}`,
  ]

  for (const c of candidates) {
    if (modules[c]) return modules[c]
  }

  // last resort: return original string
  return imgPath
}

export default raw.map((p) => ({
  ...p,
  images: (p.images || []).map(resolveImg),
}))
