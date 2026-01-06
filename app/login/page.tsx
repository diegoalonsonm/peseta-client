'use client'

import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { IconMail, IconLock } from '@tabler/icons-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  axios.defaults.withCredentials = true

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('El correo electrónico es requerido')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Por favor ingresa un correo electrónico válido')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('La contraseña es requerida')
      return false
    }
    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value) validateEmail(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (value) validatePassword(value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) return

    setIsSubmitting(true)

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { email, password }).then((res) => {
      if (res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Bienvenido a Peseta'
        })
        router.push('/')
        localStorage.setItem('email', email)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales inválidas',
          text: 'Por favor verifica tu correo electrónico y contraseña e inténtalo de nuevo.'
        })
      }
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales inválidas',
        text: 'Por favor verifica tu correo electrónico y contraseña e inténtalo de nuevo.'
      })
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center" style={{height: "calc(100vh - 56px)"}}>
        <div className="card width-50">
          <h5 className="card-header text-center">Iniciar sesión en Peseta</h5>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                id='loginEmail'
                label="Correo electrónico"
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                isValid={!emailError && email.length > 0}
                placeholder="tu@email.com"
                disabled={isSubmitting}
                icon={<IconMail size={20} />}
                floatingLabel={true}
                required={true}
              />

              <Input
                type="password"
                id="loginPass"
                label="Contraseña"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                isValid={!passwordError && password.length > 0}
                placeholder="Ingresa tu contraseña"
                disabled={isSubmitting}
                icon={<IconLock size={20} />}
                floatingLabel={true}
                helperText="Mínimo 6 caracteres"
                required={true}
              />

              <div className="mb-3 d-flex align-items-center">
                <button
                  type="submit"
                  className='btn btn-primary'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
                <Link href="/resetPassword" className='ms-3 mt-2'>
                  <p>¿Olvidaste tu contraseña? Haz clic aquí</p>
                </Link>
              </div>
            </form>
            <div className='mt-3'>
              <Link href="/register" className='text-body-secondary'>
                  <p>¿Aún no tienes una cuenta? Regístrate aquí</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login