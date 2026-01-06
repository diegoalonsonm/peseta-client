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
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada exitosamente',
          text: '¡Gracias por usar Peseta!'
        })
        localStorage.removeItem('email')
        setTimeout(() => {        
          if (result.isConfirmed) {
            axios.get('http://localhost:3930/logout').then((res) => {
              router.push('/login')
            }).catch((err) => {
              console.log(err)
            })
          }
        }, 1000)
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
