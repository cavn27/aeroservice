import { Navigate, useLocation } from 'react-router'
import { LoaderCircle } from 'lucide-react'
import { useAuth } from './useAuth'

// Protege las rutas del panel: espera a restaurar la sesión y, sin sesión válida,
// redirige al login recordando a dónde quería ir.
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center text-muted">
        <LoaderCircle className="size-8 animate-spin" aria-label="Cargando" />
      </div>
    )
  }
  if (!user) return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />
  return children
}
