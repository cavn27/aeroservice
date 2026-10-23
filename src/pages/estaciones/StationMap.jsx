import { lazy, Suspense } from 'react'

// Con VITE_GOOGLE_MAPS_API_KEY (en .env.local) se usa Google Maps, como en Copec.
// Sin clave, se usa Leaflet con un mapa base gratuito. Cada uno se descarga solo cuando se necesita.
const hasGoogleKey = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
const MapImpl = hasGoogleKey ? lazy(() => import('./maps/GoogleStationMap')) : lazy(() => import('./maps/LeafletMap'))

export default function StationMap(props) {
  return (
    <Suspense fallback={<div className="size-full animate-pulse bg-surface" />}>
      <MapImpl {...props} />
    </Suspense>
  )
}
