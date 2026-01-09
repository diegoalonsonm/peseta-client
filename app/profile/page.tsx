'use client'

import Image from "next/image"
import picPlaceholder from '../assets/picPlaceholder.webp'
import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Spinner from "../components/Spinner"
import Swal from "sweetalert2"
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconEdit,
  IconLogout,
  IconCamera,
  IconLock
} from '@tabler/icons-react'

const Profile = () => {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [profileImage, setProfileImage] = useState(picPlaceholder)
  const router = useRouter()

  useEffect(() => {
    const userEmail = localStorage.getItem('email') ?? ''
    setEmail(userEmail)

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userEmail}`).then((res) => {
      setName(res.data[0].name)
      setLastName(res.data[0].lastName)
      setCreatedAt(res.data[0].createdAt || new Date().toISOString())
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de que quieres cerrar sesión?",
      text: "Tu sesión expirará después de esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quiero cerrar sesión",
      cancelButtonText: "Cancelar"
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner size="lg" color="primary" />
        <p className="loading-text">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className='container mt-4 mb-5'>
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-center mb-1">Mi Perfil</h2>
          <p className="text-center text-muted">Gestiona tu información personal</p>
        </div>
      </div>

      {/* Profile Picture Card */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="profile-picture-card">
            <div className="profile-picture-wrapper">
              <Image
                src={profileImage}
                alt="Foto de perfil"
                className="profile-picture"
                width={120}
                height={120}
              />
              <button
                className="profile-picture-edit-btn"
                disabled
                title="Próximamente"
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <IconCamera size={20} />
              </button>
            </div>
            <div className="profile-picture-info">
              <h3 className="profile-name">{name} {lastName}</h3>
              <p className="profile-email">{email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          {/* Personal Information Card */}
          <div className="form-card mb-4">
            <div className="profile-card-header">
              <h3 className="profile-card-title">
                <IconUser size={24} />
                Información Personal
              </h3>
              <Link href="/profile/edit" className="btn btn-outline-primary btn-sm">
                <IconEdit size={18} className="me-1" />
                Editar
              </Link>
            </div>

            <div className="profile-info-grid">
              <div className="profile-info-item">
                <label className="profile-info-label">Nombre</label>
                <div className="profile-info-value">{name}</div>
              </div>

              <div className="profile-info-item">
                <label className="profile-info-label">Apellido</label>
                <div className="profile-info-value">{lastName}</div>
              </div>

              <div className="profile-info-item">
                <label className="profile-info-label">
                  <IconMail size={16} className="me-1" />
                  Correo Electrónico
                </label>
                <div className="profile-info-value">{email}</div>
              </div>

              <div className="profile-info-item">
                <label className="profile-info-label">Contraseña</label>
                <div className="profile-info-value">••••••••</div>
              </div>
            </div>
          </div>

           {/* Security Actions Card */}
           <div className="form-card mb-4">
            <div className="profile-card-header">
              <h3 className="profile-card-title">
                <IconLock size={24} />
                Seguridad
              </h3>
            </div>

            <div className="profile-actions">
              <Link href="/profile/edit" className="profile-action-link">
                <IconLock size={20} />
                <div>
                  <div className="profile-action-title">Cambiar Contraseña</div>
                  <div className="profile-action-description">Actualiza tu contraseña regularmente</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="form-card mb-4">
            <div className="profile-card-header">
              <h3 className="profile-card-title">
                <IconCalendar size={24} />
                Información de la Cuenta
              </h3>
            </div>

            <div className="profile-info-grid">
              <div className="profile-info-item">
                <label className="profile-info-label">Miembro desde</label>
                <div className="profile-info-value">{formatDate(createdAt)}</div>
              </div>

              <div className="profile-info-item">
                <label className="profile-info-label">Estado de la cuenta</label>
                <div className="profile-info-value">
                  <span className="badge bg-success">Activa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Logout Button */}
          <div className="mobile-logout-section d-md-none">
            <button
              className="btn btn-outline-danger w-100"
              onClick={handleLogout}
            >
              <IconLogout size={20} className="me-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile