'use client'

import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Input } from '../components/Input'
import PasswordStrength from '../components/PasswordStrength'

const Register = () => {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [nameError, setNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('El nombre es requerido')
      return false
    }
    if (name.trim().length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres')
      return false
    }
    setNameError('')
    return true
  }

  const validateLastName = (lastName: string) => {
    if (!lastName.trim()) {
      setLastNameError('El apellido es requerido')
      return false
    }
    if (lastName.trim().length < 2) {
      setLastNameError('El apellido debe tener al menos 2 caracteres')
      return false
    }
    setLastNameError('')
    return true
  }

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (value) validateName(value)
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLastName(value)
    if (value) validateLastName(value)
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

    const isNameValid = validateName(name)
    const isLastNameValid = validateLastName(lastName)
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid) return

    setIsSubmitting(true)

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, {name, lastName, email, password}).then((res) => {
      Swal.fire('Éxito', 'Usuario registrado exitosamente', 'success')
      router.push('/')
    }).catch((err): void => {
      if (err.response?.status === 409) {
        Swal.fire('El usuario ya existe', 'Intenta usar un nuevo correo electrónico', 'error')
        console.log(err.message)
      } else {
        Swal.fire('Error', 'Ocurrió un error', 'error')
        console.log(err.message)
      }
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center" style={{height: "calc(100vh - 56px)"}}>
        <div className="card width-50">
          <h5 className="card-header text-center">Registrarse en Peseta</h5>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="registerName" className="form-label">Nombre</label>
                    <Input
                      type="text"
                      id="registerName"
                      value={name}
                      onChange={handleNameChange}
                      error={nameError}
                      isValid={!nameError && name.length > 0}
                      placeholder="Tu nombre"
                      disabled={isSubmitting}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="registerLastName" className="form-label">Apellido</label>
                    <Input
                      type="text"
                      id="registerLastName"
                      value={lastName}
                      onChange={handleLastNameChange}
                      error={lastNameError}
                      isValid={!lastNameError && lastName.length > 0}
                      placeholder="Tu apellido"
                      disabled={isSubmitting}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="registerEmail" className="form-label">Dirección de correo electrónico</label>
                    <Input
                      type="email"
                      id="registerEmail"
                      value={email}
                      onChange={handleEmailChange}
                      error={emailError}
                      isValid={!emailError && email.length > 0}
                      placeholder="tu@email.com"
                      disabled={isSubmitting}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="registerPassword" className="form-label">Contraseña</label>
                    <Input
                      type="password"
                      id="registerPassword"
                      value={password}
                      onChange={handlePasswordChange}
                      error={passwordError}
                      isValid={!passwordError && password.length >= 6}
                      placeholder="Mínimo 6 caracteres"
                      disabled={isSubmitting}
                    />
                    <PasswordStrength password={password} />
                </div>
                <button
                  type="submit"
                  className='btn btn-primary'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registrando...
                    </>
                  ) : (
                    'Registrarse'
                  )}
                </button>
            </form>
            <div className='mt-3'>
              <Link href="/login" className='text-body-secondary'>
                  <p>¿Ya tienes una cuenta? Inicia sesión aquí</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register