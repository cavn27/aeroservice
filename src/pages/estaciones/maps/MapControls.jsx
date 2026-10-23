import { LocateFixed, Minus, Plus } from 'lucide-react'

const btn = 'grid size-11 place-items-center bg-white text-navy-700 transition hover:bg-navy-50 disabled:opacity-60'

// Controles flotantes del mapa, comunes a Google Maps y Leaflet.
export default function MapControls({ onZoomIn, onZoomOut, onLocate, locating }) {
  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-3">
      <div className="flex flex-col divide-y divide-navy-100 overflow-hidden rounded-2xl shadow-card-hover">
        <button type="button" aria-label="Acercar" className={btn} onClick={onZoomIn}>
          <Plus className="size-5" />
        </button>
        <button type="button" aria-label="Alejar" className={btn} onClick={onZoomOut}>
          <Minus className="size-5" />
        </button>
      </div>
      <button type="button" aria-label="Usar mi ubicación" disabled={locating} onClick={onLocate} className={`${btn} rounded-2xl shadow-card-hover`}>
        <LocateFixed className={`size-5 ${locating ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  )
}
