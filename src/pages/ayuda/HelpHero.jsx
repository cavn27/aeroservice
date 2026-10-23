import { useId, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Search } from 'lucide-react'
import { popularQuestions, searchQuestions } from './helpIndex'

export default function HelpHero({ onOpen }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [focused, setFocused] = useState(false)
  const listId = useId()

  const results = useMemo(() => searchQuestions(query), [query])
  const showResults = focused && query.trim().length > 0

  const choose = (item) => {
    onOpen(item)
    setFocused(false)
  }

  const onKeyDown = (e) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[active])
    }
  }

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-navy-500 via-navy-600 to-navy-800">
      {/* Acentos diagonales y esfera de la línea gráfica */}
      <div className="pointer-events-none absolute -left-24 -top-10 -z-10 h-[140%] w-40 rotate-[38deg] bg-gradient-to-b from-white/15 to-white/0" />
      <div className="pointer-events-none absolute -bottom-10 right-0 -z-10 hidden h-[130%] w-48 origin-bottom-right rotate-[38deg] bg-gradient-to-t from-white/25 to-white/0 md:block" />
      <motion.div
        className="pointer-events-none absolute bottom-14 right-[7%] -z-10 hidden size-24 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0,#bfdbfe_25%,#3b82f6_60%,#1e3a8a_100%)] shadow-[0_0_60px_rgb(191_219_254/0.5)] md:block"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 120, damping: 14 }}
      />

      <div className="container-page grid gap-14 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">Centro de Ayuda</h1>
          <p className="mt-5 text-xl text-white/85 sm:text-2xl">¿En qué podemos ayudarte?</p>

          <div className="relative mt-10 max-w-xl">
            <label htmlFor="help-search" className="sr-only">
              Buscar en el centro de ayuda
            </label>
            <div className="flex overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-16px_rgb(7_11_36/0.5)] ring-4 ring-white/0 transition focus-within:ring-white/30">
              <input
                id="help-search"
                type="search"
                role="combobox"
                aria-expanded={showResults}
                aria-controls={listId}
                aria-autocomplete="list"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                onKeyDown={onKeyDown}
                placeholder="Escribe lo que buscas, por ejemplo “fuga”"
                className="h-16 flex-1 px-6 text-lg text-ink outline-none placeholder:text-muted/60"
              />
              <span className="grid w-16 place-items-center border-l border-navy-100 text-navy-600">
                <Search className="size-6" />
              </span>
            </div>

            <AnimatePresence>
              {showResults && (
                <motion.ul
                  id={listId}
                  role="listbox"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-white p-2 shadow-card-hover"
                >
                  {results.length === 0 ? (
                    <li className="px-4 py-5 text-center text-muted">No encontramos resultados para “{query}”.</li>
                  ) : (
                    results.map((r, i) => (
                      <li key={r.key} role="option" aria-selected={i === active}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseEnter={() => setActive(i)}
                          onClick={() => choose(r)}
                          className={`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left transition-colors ${i === active ? 'bg-navy-50' : ''}`}
                        >
                          <span>
                            <span className="block font-medium text-ink">{r.q}</span>
                            <span className="mt-0.5 block text-xs text-muted">
                              {r.tab} · {r.topic}
                            </span>
                          </span>
                          <ArrowRight className="size-4 shrink-0 text-navy-500" />
                        </button>
                      </li>
                    ))
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Preguntas frecuentes</h2>
          <ul className="mt-6 flex flex-col items-start gap-3">
            {popularQuestions.map((p, i) => (
              <motion.li
                key={p.key}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
              >
                <button
                  type="button"
                  onClick={() => onOpen(p)}
                  className="rounded-full border border-white/70 px-6 py-3 text-left font-semibold text-white transition hover:bg-white hover:text-navy-700"
                >
                  {p.q}
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
