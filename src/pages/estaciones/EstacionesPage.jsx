import { useCallback, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import StationMap from './StationMap'
import { FiltersButton, FiltersPanel, StationDetail, StationList } from './StationPanel'
import { distanceKm } from './geo'
import { inBounds } from './maps/bounds'
import { products, stations } from '../../data/estaciones'

const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()


const selectClass =
  'h-11 min-w-0 flex-1 rounded-xl border border-navy-100 bg-white px-3 text-sm font-medium text-ink outline-none focus:border-navy-500 focus:ring-4 focus:ring-navy-500/15'

export default function EstacionesPage() {
  const [query, setQuery] = useState('')
  const [productId, setProductId] = useState(products[0].id)
  const [sort, setSort] = useState('distance')
  const [serviceFilter, setServiceFilter] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [bounds, setBounds] = useState(null)
  const [userPos, setUserPos] = useState(null)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [target, setTarget] = useState(null)

  const product = products.find((p) => p.id === productId)

  // Estaciones que cumplen producto + servicios (son las que se dibujan en el mapa).
  const available = useMemo(
    () => stations.filter((s) => productId in s.products && serviceFilter.every((id) => s.services.includes(id))),
    [productId, serviceFilter],
  )

  const matchesQuery = useCallback(
    (s) => {
      const q = normalize(query.trim())
      return normalize(`${s.name} ${s.address} ${s.city}`).includes(q)
    },
    [query],
  )

  const distances = useMemo(
    () => (userPos ? Object.fromEntries(stations.map((s) => [s.id, distanceKm(userPos, [s.lat, s.lng])])) : {}),
    [userPos],
  )

  // La lista muestra lo que coincide con la búsqueda o, si no se busca nada, lo visible en el mapa.
  const listed = useMemo(() => {
    const searching = query.trim().length > 0
    const list = available.filter((s) => (searching ? matchesQuery(s) : inBounds(bounds, s)))
    const byName = (a, b) => a.name.localeCompare(b.name)
    return [...list].sort(sort === 'distance' && userPos ? (a, b) => distances[a.id] - distances[b.id] : byName)
  }, [available, bounds, query, matchesQuery, sort, userPos, distances])

  const selected = stations.find((s) => s.id === selectedId)

  const select = (id) => {
    setSelectedId(id)
    const s = stations.find((x) => x.id === id)
    setTarget({ center: [s.lat, s.lng], zoom: 16 })
  }

  const onSearch = (value) => {
    setQuery(value)
    setSelectedId(null)
    const q = normalize(value.trim())
    if (!q) return
    const matches = available.filter((s) => normalize(`${s.name} ${s.address} ${s.city}`).includes(q))
    if (matches.length) setTarget({ points: matches })
  }

  const showAll = () => {
    setQuery('')
    setServiceFilter([])
    setTarget({ points: stations })
  }

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setGeoError('Tu navegador no permite obtener la ubicación.')
      return
    }
    setLocating(true)
    setGeoError('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude]
        setUserPos(pos)
        setSort('distance')
        setTarget({ center: pos, zoom: 14 })
        setLocating(false)
      },
      () => {
        setGeoError('No pudimos obtener tu ubicación. Revisa los permisos del navegador.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const toggleService = (id) => setServiceFilter((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  return (
    <>
      <title>Aerogas | Buscador de estaciones</title>
      <section className="flex flex-col-reverse border-t border-navy-50 lg:h-[calc(100dvh-88px)] lg:min-h-[620px] lg:flex-row">
        {/* Panel lateral */}
        <aside className="flex flex-col bg-white lg:w-[420px] lg:shrink-0 lg:border-r lg:border-navy-100">
          <div className="border-b border-navy-50 p-5">
            <h1 className="text-2xl font-bold tracking-tight">Buscador de estaciones</h1>
            <label className="relative mt-4 block">
              <span className="sr-only">Buscar una estación</span>
              <input
                type="text"
                inputMode="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Buscar por nombre o dirección"
                className="h-12 w-full rounded-xl border border-navy-100 bg-white pl-4 pr-11 outline-none transition focus:border-navy-500 focus:ring-4 focus:ring-navy-500/15"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Limpiar búsqueda"
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface"
                >
                  <X className="size-4" />
                </button>
              ) : (
                <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-navy-500" />
              )}
            </label>
            <div className="mt-3 flex gap-2">
              <FiltersButton open={filtersOpen} count={serviceFilter.length} onToggle={() => setFiltersOpen((o) => !o)} />
              <label className="contents">
                <span className="sr-only">Producto</span>
                <select value={productId} onChange={(e) => setProductId(e.target.value)} className={selectClass}>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="contents">
                <span className="sr-only">Ordenar</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
                  <option value="distance">Más cercanas</option>
                  <option value="name">Nombre</option>
                </select>
              </label>
            </div>
            <FiltersPanel open={filtersOpen} selected={serviceFilter} onToggle={toggleService} onClear={() => setServiceFilter([])} />
            {sort === 'distance' && !userPos && (
              <button type="button" onClick={locate} className="mt-3 text-sm font-semibold text-navy-600 hover:underline">
                Activa tu ubicación para ver las estaciones más cercanas
              </button>
            )}
            {geoError && <p className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-700">{geoError}</p>}
          </div>

          <div className="flex-1 overflow-y-auto p-5 lg:min-h-0">
            {selected ? (
              <StationDetail station={selected} product={product} distance={distances[selected.id]} onBack={() => setSelectedId(null)} />
            ) : (
              <>
                <p className="mb-4 text-sm text-muted" aria-live="polite">
                  {listed.length === 1 ? '1 estación' : `${listed.length} estaciones`}{' '}
                  {query.trim() ? (listed.length === 1 ? 'encontrada' : 'encontradas') : 'en esta zona'}
                </p>
                <StationList
                  stations={listed}
                  product={product}
                  distances={distances}
                  hoveredId={hoveredId}
                  onSelect={select}
                  onHover={setHoveredId}
                  onShowAll={showAll}
                  searching={query.trim().length > 0}
                />
              </>
            )}
          </div>
        </aside>

        {/* Mapa */}
        <div className="relative isolate h-[55vh] min-h-[380px] lg:h-auto lg:min-h-0 lg:flex-1">
          <StationMap
            stations={available}
            selectedId={selectedId}
            hoveredId={hoveredId}
            userPos={userPos}
            target={target}
            onSelect={select}
            onHover={setHoveredId}
            onBoundsChange={setBounds}
            onLocate={locate}
            locating={locating}
          />
        </div>
      </section>
    </>
  )
}
