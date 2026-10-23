import { NavLink } from 'react-router'
import { CircleHelp, MapPin, Search } from 'lucide-react'
import { segments, utilityLinks } from '../../data/site'

const utilityIcons = [CircleHelp, MapPin]

export default function TopBar() {
  return (
    <div className="hidden bg-surface lg:block">
      <div className="container-page flex h-11 items-center justify-between">
        <nav aria-label="Segmentos" className="flex h-full">
          {segments.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              className={({ isActive }) =>
                `flex h-full items-center px-5 text-sm transition-colors ${
                  isActive ? 'bg-white font-semibold text-ink' : 'text-muted hover:text-ink'
                }`
              }
            >
              {s.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-7 text-sm">
          <button type="button" className="flex items-center gap-1.5 font-semibold text-navy-600 hover:text-navy-800">
            <Search className="size-4" /> Buscar
          </button>
          {utilityLinks.map((l, i) => {
            const Icon = utilityIcons[i]
            return (
              <NavLink
                key={l.label}
                to={l.to ?? l.href}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 hover:text-ink ${isActive && l.to ? 'font-semibold text-ink' : 'text-muted'}`
                }
              >
                <Icon className="size-4 text-navy-500" /> {l.label}
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
