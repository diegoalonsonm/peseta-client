'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconHome, IconReceipt, IconCoin, IconChartBar, IconUserCircle } from '@tabler/icons-react'

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
        <IconHome size={24} />
        <span>Inicio</span>
      </Link>

      <Link
        href="/expense/all"
        className={`bottom-nav-item ${isActive('/expense') ? 'active' : ''}`}
      >
        <IconReceipt size={24} />
        <span>Gastos</span>
      </Link>

      <Link
        href="/income/all"
        className={`bottom-nav-item ${isActive('/income') ? 'active' : ''}`}
      >
        <IconCoin size={24} />
        <span>Ingresos</span>
      </Link>

      <Link
        href="/stats"
        className={`bottom-nav-item ${isActive('/stats') ? 'active' : ''}`}
      >
        <IconChartBar size={24} />
        <span>Stats</span>
      </Link>

      <Link
        href="/profile"
        className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}
      >
        <IconUserCircle size={24} />
        <span>Perfil</span>
      </Link>
    </nav>
  )
}
