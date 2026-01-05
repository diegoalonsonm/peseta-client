'use client'

import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  axios.defaults.withCredentials = true

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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
    })  
  }

  const handlePasswordChange = () => {}

  return (
    <>
      <div className="d-flex justify-content-center align-items-center" style={{height: "calc(100vh - 56px)"}}>
        <div className="card width-50">
          <h5 className="card-header text-center">Iniciar sesión en Peseta</h5>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label">Dirección de correo electrónico</label>
                <Input type="email" className='form-control' id='loginEmail' ariaDescribedby='loginEmail'
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="loginPass" className="form-label">Contraseña</label>
                <Input type="password" id="loginPass" className="form-control" onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <Button text='Iniciar Sesión' type='submit' className='btn-primary'/>
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