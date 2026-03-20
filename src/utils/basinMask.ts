/**
 * 流域多边形裁剪栅格：与 ImageLayer 四角 bounds 对齐，流域外透明。
 * 使用离屏 path + destination-in（由浏览器栅格化），避免逐像素射线法阻塞主线程。
 */

export interface RasterGeoBounds {
  west: number
  south: number
  east: number
  north: number
}

type PolygonCoords = number[][][]
type MultiPolygonCoords = number[][][][]

function addPolygonRingsToPath(
  ctx: CanvasRenderingContext2D,
  polygon: PolygonCoords,
  lonToX: (lon: number) => number,
  latToY: (lat: number) => number,
): void {
  for (const ring of polygon) {
    if (!ring?.length) {
      continue
    }
    ctx.moveTo(lonToX(ring[0][0]), latToY(ring[0][1]))
    for (let i = 1; i < ring.length; i++) {
      ctx.lineTo(lonToX(ring[i][0]), latToY(ring[i][1]))
    }
    ctx.closePath()
  }
}

/**
 * 将栅格 canvas 在 bounds 外与流域多边形外裁为透明（destination-in 白填充掩膜）。
 */
export function applyBasinMaskToCanvas(
  canvas: HTMLCanvasElement,
  bounds: RasterGeoBounds,
  geometry: { type: string; coordinates: unknown },
): void {
  const w = canvas.width
  const h = canvas.height
  const { west, south, east, north } = bounds
  if (!(east > west && north > south && w > 0 && h > 0)) {
    return
  }

  const lonToX = (lon: number) => ((lon - west) / (east - west)) * w
  const latToY = (lat: number) => ((north - lat) / (north - south)) * h

  const mask = document.createElement('canvas')
  mask.width = w
  mask.height = h
  const mctx = mask.getContext('2d')
  if (!mctx) {
    return
  }

  mctx.clearRect(0, 0, w, h)
  mctx.fillStyle = '#ffffff'
  mctx.beginPath()

  if (geometry.type === 'Polygon') {
    addPolygonRingsToPath(mctx, geometry.coordinates as PolygonCoords, lonToX, latToY)
  }
  else if (geometry.type === 'MultiPolygon') {
    for (const poly of geometry.coordinates as MultiPolygonCoords) {
      addPolygonRingsToPath(mctx, poly, lonToX, latToY)
    }
  }
  else {
    return
  }

  mctx.fill('evenodd')

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }
  ctx.save()
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(mask, 0, 0)
  ctx.restore()
}
