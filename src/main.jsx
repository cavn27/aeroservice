import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router'
import './index.css'
import Layout from './components/layout/Layout'
import PersonasPage from './pages/personas/PersonasPage'
import EmpresasPage from './pages/empresas/EmpresasPage'
import DistribuidoresPage from './pages/distribuidores/DistribuidoresPage'
import ProveedoresPage from './pages/proveedores/ProveedoresPage'
import AyudaPage from './pages/ayuda/AyudaPage'
import EstacionesPage from './pages/estaciones/EstacionesPage'
import IngresarPage from './pages/ingresar/IngresarPage'
import { AuthProvider } from './auth/AuthProvider'
import RequireAuth from './auth/RequireAuth'

// El portal administrativo se descarga solo al entrar (incluye librerías de gráficos).
const load = (importer) => () => importer().then((m) => ({ Component: m.default }))

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/personas" replace /> },
      { path: 'personas', element: <PersonasPage /> },
      { path: 'empresas', element: <EmpresasPage /> },
      { path: 'distribuidores', element: <DistribuidoresPage /> },
      { path: 'proveedores', element: <ProveedoresPage /> },
      { path: 'ayuda', element: <AyudaPage /> },
      { path: 'estaciones', element: <EstacionesPage /> },
      { path: '*', element: <Navigate to="/personas" replace /> },
    ],
  },
  // Login y portal administrativo: fuera del layout del sitio público.
  { path: 'ingresar', element: <IngresarPage /> },
  {
    path: 'admin',
    element: (
      <RequireAuth>
        <Outlet />
      </RequireAuth>
    ),
    children: [
      {
        lazy: load(() => import('./admin/AdminLayout')),
        children: [
          { index: true, lazy: load(() => import('./admin/aeroservice/ResumenPage')) },
          { path: 'pedidos', lazy: load(() => import('./admin/aeroservice/PedidosPage')) },
          { path: 'reportes', lazy: load(() => import('./admin/aeroservice/ReportesPage')) },
          { path: 'personal', lazy: load(() => import('./admin/aeroservice/PersonalPage')) },
          { path: '*', lazy: load(() => import('./admin/AdminPlaceholder')) },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
