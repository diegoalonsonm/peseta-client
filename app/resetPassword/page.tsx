'use client'

import { useState } from 'react'
import { Button } from '../components/Button'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const ResetPassword = () => {
    const [email, setEmail] = useState('')

    //const data = { email }

    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        Swal.fire({
            title: "Confirmar Correo Electrónico",
            text: "Asegúrate de enviar el correo electrónico correcto",
            icon: "info",
            showDenyButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Enviar correo",
            denyButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Correo recibido!',
                    text: 'Tu contraseña será enviada a tu correo electrónico. ¡Recuerda revisar todas tus carpetas!'
                })
                axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/recovery`, {email}).then((res) => {
                  router.push('/login')              
                }).catch((err) => {
                  Swal.fire('Error', 'Ha ocurrido un error. Por favor inténtalo de nuevo', 'error')
                  console.log(err.response)
                })
            }
        })
    }

    return (
    <>
      <div className="d-flex justify-content-center align-items-center" style={{height: "calc(100vh - 56px)"}}>
        <div className="card width-50">
          <h5 className="card-header text-center">Restablecer Contraseña</h5>
          <div className="card-body">
            <p className='text-body-secondary'>Por favor ingresa tu correo electrónico para que podamos restablecer tu contraseña</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="resetPassEmail" className="form-label">Dirección de correo electrónico</label>
                    <input type="email" className="form-control" id="resetPassEmail" aria-describedby="emailHelp"
                      onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button text='Enviar correo' type='submit' className='btn-primary'/>          
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPassword