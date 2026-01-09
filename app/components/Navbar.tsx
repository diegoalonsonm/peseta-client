'use client'

import React from 'react'
import { Button } from './Button'
import axios from 'axios'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { IconLogout, IconUserCircle, IconChartBar, IconHome } from '@tabler/icons-react'
import { useRouter, usePathname } from 'next/navigation'

export const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const handleDelete = () => {
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

  return (
  <nav className="navbar-mobile bg-body-tertiary">
    <div className="container-fluid">
      <Link href="/" className='navbar-brand'>
        Peseta
      </Link>
    </div>
  </nav>
  )
}
