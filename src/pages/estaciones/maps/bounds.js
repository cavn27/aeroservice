// Límites de mapa independientes del proveedor: { north, south, east, west }.

export const inBounds = (b, { lat, lng }) => !b || (lat <= b.north && lat >= b.south && lng <= b.east && lng >= b.west)

// Rectángulo que contiene todos los puntos, con un margen relativo opcional.
export function boundsOf(points, pad = 0) {
  const lats = points.map((p) => p.lat)
  const lngs = points.map((p) => p.lng)
  const north = Math.max(...lats)
  const south = Math.min(...lats)
  const east = Math.max(...lngs)
  const west = Math.min(...lngs)
  const dLat = Math.max(north - south, 0.004) * pad
  const dLng = Math.max(east - west, 0.004) * pad
  return { north: north + dLat, south: south - dLat, east: east + dLng, west: west - dLng }
}
