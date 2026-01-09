'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  IconHome,
  IconChartBar,
  IconUserCircle,
  IconLogout,
  IconChevronLeft,
  IconChevronRight,
  IconReceipt,
  IconCoin,
  IconChartPie
} from '@tabler/icons-react'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Load saved preference from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    const savedPinned = localStorage.getItem('sidebarPinned')
    if (savedState) setIsCollapsed(savedState === 'true')
    if (savedPinned) setIsPinned(savedPinned === 'true')
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
    if (newState) {
      setIsPinned(false)
      localStorage.setItem('sidebarPinned', 'false')
    }
  }

  const togglePin = () => {
    const newPinned = !isPinned
    setIsPinned(newPinned)
    localStorage.setItem('sidebarPinned', String(newPinned))
    if (newPinned) {
      setIsCollapsed(false)
      localStorage.setItem('sidebarCollapsed', 'false')
    }
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de que quieres cerrar sesión?",
      text: "Tu sesión expirará después de esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quiero cerrar sesión"
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove email from localStorage first
        localStorage.removeItem('email')

        // Call logout endpoint to clear cookie
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`).then((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada exitosamente',
            text: '¡Gracias por usar Peseta!'
          }).then(() => {
            router.push('/login')
          })
        }).catch((err) => {
          console.log(err)
          // Even if logout fails, redirect to login
          router.push('/login')
        })
      }
    })
  }

  const shouldExpand = isCollapsed && (isHovered || isPinned)

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${shouldExpand ? 'expanded' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-brand-text">Peseta</span>
        </div>
        {!isCollapsed && (
          <div className="sidebar-controls">
            <button
              className="sidebar-collapse"
              onClick={toggleSidebar}
              title="Contraer"
            >
              <IconChevronLeft size={20} />
            </button>
          </div>
        )}
        {isCollapsed && (
          <button
            className="sidebar-expand-btn"
            onClick={toggleSidebar}
            title="Expandir"
          >
            <IconChevronRight size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <Link
          href="/"
          className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
        >
          <IconHome size={24} />
          <span className="sidebar-link-text">Inicio</span>
        </Link>

        <Link
          href="/expense/all"
          className={`sidebar-link ${isActive('/expense') ? 'active' : ''}`}
        >
          <IconReceipt size={24} />
          <span className="sidebar-link-text">Gastos</span>
        </Link>

        <Link
          href="/income/all"
          className={`sidebar-link ${isActive('/income') ? 'active' : ''}`}
        >
          <IconCoin size={24} />
          <span className="sidebar-link-text">Ingresos</span>
        </Link>

        <Link
          href="/budgets"
          className={`sidebar-link ${isActive('/budgets') ? 'active' : ''}`}
        >
          <IconChartPie size={24} />
          <span className="sidebar-link-text">Presupuestos</span>
        </Link>

        <Link
          href="/stats"
          className={`sidebar-link ${isActive('/stats') ? 'active' : ''}`}
        >
          <IconChartBar size={24} />
          <span className="sidebar-link-text">Estadísticas</span>
        </Link>

        <Link
          href="/profile"
          className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
        >
          <IconUserCircle size={24} />
          <span className="sidebar-link-text">Mi Perfil</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
        >
          <IconLogout size={24} />
          <span className="sidebar-link-text">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
