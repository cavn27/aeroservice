import { CircleHelp, FileSpreadsheet, FileText, LayoutGrid, MapPin, Megaphone, Settings, ShoppingCart, Users } from 'lucide-react'

// Menú del portal. Aeroservice: KPIs, pedidos y reportes (solo lectura) y Personal
// (el administrador gestiona cuentas; el visualizador solo consulta).
// Lo que no está construido muestra "en construcción".
export const adminNav = [
  {
    title: 'Aeroservice',
    items: [
      { label: 'Resumen', to: '/admin', icon: LayoutGrid, end: true },
      { label: 'Pedidos', to: '/admin/pedidos', icon: ShoppingCart },
      { label: 'Reportes', to: '/admin/reportes', icon: FileSpreadsheet },
      { label: 'Personal', to: '/admin/personal', icon: Users },
    ],
  },
  {
    title: 'Sitio web',
    items: [
      { label: 'Estaciones', to: '/admin/estaciones', icon: MapPin },
      { label: 'Promociones', to: '/admin/promociones', icon: Megaphone },
      { label: 'Noticias', to: '/admin/noticias', icon: FileText },
      { label: 'Preguntas frecuentes', to: '/admin/preguntas', icon: CircleHelp },
      { label: 'Configuración', to: '/admin/configuracion', icon: Settings },
    ],
  },
]

export const findNavItem = (pathname) => adminNav.flatMap((g) => g.items).find((i) => i.to === pathname)
