import { useEffect } from 'react'
import { AdvancedMarker, AdvancedMarkerAnchorPoint, APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import emblem from '../../../assets/emblem.png'
import MapControls from './MapControls'
import { boundsOf } from './bounds'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
// DEMO_MAP_ID sirve para desarrollo; en producción crea un Map ID en Google Cloud (Map Management).
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'

function StationPin({ active }) {
  return (
    <div className={`ag-pin ${active ? 'ag-pin--active' : ''}`}>
      <div className="ag-pin__head">
        <img src={emblem} alt="" />
      </div>
      <div className="ag-pin__tail" />
    </div>
  )
}

// Mueve el mapa cuando cambia el objetivo (estación, resultados de búsqueda o ubicación del usuario).
function Controller({ target, onLocate, locating }) {
  const map = useMap()

  useEffect(() => {
    if (!map || !target) return
    if (target.points) {
      map.fitBounds(boundsOf(target.points), 80)
      if (target.points.length === 1) map.setZoom(16)
    } else {
      map.panTo({ lat: target.center[0], lng: target.center[1] })
      map.setZoom(target.zoom ?? 16)
    }
  }, [map, target])

  return (
    <MapControls
      onZoomIn={() => map?.setZoom((map.getZoom() ?? 14) + 1)}
      onZoomOut={() => map?.setZoom((map.getZoom() ?? 14) - 1)}
      onLocate={onLocate}
      locating={locating}
    />
  )
}

export default function GoogleStationMap({ stations, selectedId, hoveredId, userPos, target, onSelect, onHover, onBoundsChange, onLocate, locating }) {
  return (
    <APIProvider apiKey={API_KEY} language="es" region="PE">
      <Map
        mapId={MAP_ID}
        defaultBounds={{ ...boundsOf(stations, 0.6), padding: 40 }}
        gestureHandling="greedy"
        disableDefaultUI
        clickableIcons={false}
        className="size-full"
        onIdle={({ map }) => {
          const b = map.getBounds()?.toJSON()
          if (b) onBoundsChange(b)
        }}
      >
        {stations.map((s) => {
          const active = s.id === selectedId || s.id === hoveredId
          return (
            <AdvancedMarker
              key={s.id}
              position={{ lat: s.lat, lng: s.lng }}
              title={s.name}
              zIndex={active ? 1000 : 1}
              onClick={() => onSelect(s.id)}
              onMouseEnter={() => onHover(s.id)}
              onMouseLeave={() => onHover(null)}
            >
              <StationPin active={active} />
            </AdvancedMarker>
          )
        })}

        {userPos && (
          <AdvancedMarker position={{ lat: userPos[0], lng: userPos[1] }} anchorPoint={AdvancedMarkerAnchorPoint.CENTER} zIndex={2000}>
            <div className="ag-user">
              <span />
            </div>
          </AdvancedMarker>
        )}
      </Map>
      <Controller target={target} onLocate={onLocate} locating={locating} />
    </APIProvider>
  )
}
