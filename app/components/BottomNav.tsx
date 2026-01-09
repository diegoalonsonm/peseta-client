'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconHome, IconReceipt, IconCoin, IconChartBar, IconUserCircle, IconChartPie } from '@tabler/icons-react'

export default function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  // Don't show bottom nav on login/register pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/resetPassword') {
    return null
  }

  return (
    <nav className="bottom-nav">
      <Link
        href="/"
        className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}
      >
        <IconHome size={22} />
        <span>Inicio</span>
      </Link>

      <Link
        href="/expense/all"
        className={`bottom-nav-item ${isActive('/expense') ? 'active' : ''}`}
      >
        <IconReceipt size={22} />
        <span>Gastos</span>
      </Link>

      <Link
        href="/income/all"
        className={`bottom-nav-item ${isActive('/income') ? 'active' : ''}`}
      >
        <IconCoin size={22} />
        <span>Ingresos</span>
      </Link>

      <Link
        href="/budgets"
        className={`bottom-nav-item ${isActive('/budgets') ? 'active' : ''}`}
      >
        <IconChartPie size={22} />
        <span>Presupuestos</span>
      </Link>

      <Link
        href="/stats"
        className={`bottom-nav-item ${isActive('/stats') ? 'active' : ''}`}
      >
        <IconChartBar size={22} />
        <span>Stats</span>
      </Link>

      <Link
        href="/profile"
        className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}
      >
        <IconUserCircle size={22} />
        <span>Perfil</span>
      </Link>
    </nav>
  )
}
