import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import emblem from '../../../assets/emblem.png'
import MapControls from './MapControls'
import { boundsOf } from './bounds'

// Mapa de respaldo (sin clave de Google). Estilo "Alidade Smooth" de Stadia Maps: claro y limpio.
// Gratis en localhost; en producción registra el dominio en https://client.stadiamaps.com (plan gratuito).

const toLeaflet = (b) => L.latLngBounds([b.south, b.west], [b.north, b.east])

// Pin con el emblema de Aerogas. El seleccionado crece y se marca en rojo.
const stationIcon = (active) =>
  L.divIcon({
    className: '',
    iconSize: [48, 58],
    iconAnchor: [24, 56],
    tooltipAnchor: [0, -52],
    html: `
      <div class="ag-pin ${active ? 'ag-pin--active' : ''}">
        <div class="ag-pin__head"><img src="${emblem}" alt="" /></div>
        <div class="ag-pin__tail"></div>
      </div>`,
  })

const userIcon = L.divIcon({
  className: '',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  html: '<div class="ag-user"><span></span></div>',
})

// Informa los límites visibles cada vez que el usuario mueve o hace zoom en el mapa.
const toPlain = (b) => ({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() })

function BoundsWatcher({ onChange }) {
  const map = useMapEvents({ moveend: () => onChange(toPlain(map.getBounds())) })
  useEffect(() => {
    onChange(toPlain(map.getBounds()))
  }, [map, onChange])
  return null
}

// Recalcula el tamaño del mapa cuando cambia su contenedor (p. ej. si se montó oculto o con tamaño 0)
// y encuadra las estaciones la primera vez que tiene un tamaño real.
function SizeWatcher({ initialBounds }) {
  const map = useMap()
  useEffect(() => {
    let fitted = false
    const observer = new ResizeObserver(([entry]) => {
      map.invalidateSize()
      if (!fitted && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        fitted = true
        map.fitBounds(initialBounds, { animate: false })
      }
    })
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map, initialBounds])
  return null
}

// Mueve el mapa cuando cambia el objetivo (estación seleccionada, resultados de búsqueda o ubicación).
function Controller({ target, onLocate, locating }) {
  const map = useMap()
  useEffect(() => {
    if (!target) return
    if (target.points) map.flyToBounds(toLeaflet(boundsOf(target.points)), { padding: [60, 60], maxZoom: 16, duration: 0.8 })
    else map.flyTo(target.center, target.zoom ?? 16, { duration: 0.8 })
  }, [map, target])
  return <MapControls onZoomIn={() => map.zoomIn()} onZoomOut={() => map.zoomOut()} onLocate={onLocate} locating={locating} />
}

export default function LeafletMap({ stations, selectedId, hoveredId, userPos, target, onSelect, onHover, onBoundsChange, onLocate, locating }) {
  // Vista inicial: encuadra todas las estaciones.
  const [initialBounds] = useState(() => toLeaflet(boundsOf(stations, 0.6)))

  return (
    <MapContainer bounds={initialBounds} zoomControl={false} className="size-full">
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        maxZoom={20}
      />
      <SizeWatcher initialBounds={initialBounds} />
      <BoundsWatcher onChange={onBoundsChange} />
      <Controller target={target} onLocate={onLocate} locating={locating} />

      {stations.map((s) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={stationIcon(s.id === selectedId || s.id === hoveredId)}
          zIndexOffset={s.id === selectedId ? 1000 : 0}
          eventHandlers={{
            click: () => onSelect(s.id),
            mouseover: () => onHover(s.id),
            mouseout: () => onHover(null),
          }}
        >
          <Tooltip direction="top" className="ag-tooltip">
            {s.name}
          </Tooltip>
        </Marker>
      ))}

      {userPos && <Marker position={userPos} icon={userIcon} interactive={false} />}
    </MapContainer>
  )
}
