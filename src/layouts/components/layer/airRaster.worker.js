/**
 * Web Worker：在后台线程执行 IDW 插值，避免大 CSV 解析后插值阻塞主线程
 */
function bucketPoints(points, minLat, maxLat, minLon, maxLon, nBucketsX, nBucketsY) {
  const buckets = new Map()
  const spanLon = maxLon - minLon || 1
  const spanLat = maxLat - minLat || 1
  for (const p of points) {
    const bx = Math.min(Math.floor(((p.lon - minLon) / spanLon) * nBucketsX), nBucketsX - 1)
    const by = Math.min(Math.floor(((p.lat - minLat) / spanLat) * nBucketsY), nBucketsY - 1)
    const key = `${bx},${by}`
    if (!buckets.has(key)) {
      buckets.set(key, [])
    }
    buckets.get(key).push(p)
  }
  return { buckets, nBucketsX, nBucketsY, minLat, maxLat, minLon, maxLon }
}

/**
 * @param maxInterpDist 最大插值距离（度），超过则视为无数据，避免向无数据区域外推
 */
function idwToGrid(points, bounds, gridW, gridH, idwPower = 2, maxNeighbors = 12, maxInterpDist = 0.15) {
  if (!bounds || points.length === 0) {
    return null
  }
  const { minLat, maxLat, minLon, maxLon } = bounds
  const nBucketsX = 40
  const nBucketsY = 40
  const { buckets, nBucketsX: nx, nBucketsY: ny } = bucketPoints(
    points, minLat, maxLat, minLon, maxLon, nBucketsX, nBucketsY,
  )
  const spanLon = maxLon - minLon || 1
  const spanLat = maxLat - minLat || 1
  const grid = []
  for (let gy = 0; gy < gridH; gy++) {
    const row = []
    const lat = maxLat - (gy + 0.5) / gridH * spanLat
    for (let gx = 0; gx < gridW; gx++) {
      const lon = minLon + (gx + 0.5) / gridW * spanLon
      const bx = Math.min(Math.floor(((lon - minLon) / spanLon) * nx), nx - 1)
      const by = Math.min(Math.floor(((lat - minLat) / spanLat) * ny), ny - 1)
      const candidates = []
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const cx = bx + dx
          const cy = by + dy
          if (cx >= 0 && cx < nx && cy >= 0 && cy < ny) {
            const list = buckets.get(`${cx},${cy}`)
            if (list) {
              candidates.push(...list)
            }
          }
        }
      }
      if (candidates.length === 0) {
        row.push(0)
        continue
      }
      const withDist = candidates.map(p => ({
        ...p,
        d: Math.hypot(p.lat - lat, p.lon - lon) || 1e-10,
      }))
      withDist.sort((a, b) => a.d - b.d)
      const nearest = withDist.slice(0, maxNeighbors)
      // 最近点超过最大插值距离则视为无数据，不外推
      if (nearest[0].d > maxInterpDist) {
        row.push(0)
        continue
      }
      let sumW = 0
      let sumWv = 0
      for (const p of nearest) {
        const w = 1 / (p.d ** idwPower)
        sumW += w
        sumWv += w * p.value
      }
      row.push(sumW > 0 ? sumWv / sumW : 0)
    }
    grid.push(row)
  }
  return grid
}

self.onmessage = (e) => {
  const { points, bounds, gridW = 256, gridH = 256, maxInterpDist = 0.15 } = e.data
  try {
    const grid = idwToGrid(points, bounds, gridW, gridH, 2, 12, maxInterpDist)
    self.postMessage({ grid })
  }
  catch (err) {
    self.postMessage({ error: String(err) })
  }
}
