'use client'

import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

const Expense = () => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0.0)
  const [category, setCategory] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  var email = ''

  if (typeof window !== 'undefined') {
    email = localStorage.getItem('email') ?? ''
  }

  const data = {description, amount, category, email}

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/expenses`, data).then((res) => {
      if (res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Gasto agregado',
          text: 'Tu gasto ha sido agregado exitosamente'
        })
        router.push('/')
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error agregando el gasto'
        })
      }
    }).catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error agregando el gasto'
      })
      console.log(err)
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <div className="container">
      <div className="row text-center mt-5">
        <div className="col">
          <h2>Nuevo Gasto</h2>
        </div>
      </div>
      <div className="row mt-3 mx-auto width-50">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="description">Descripción</label>
              <input type="text" className="form-control" id="description" aria-describedby="description"
                placeholder="Ingresa la descripción" onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="amount">Cantidad</label>
              <input type="number" step="0.01" className="form-control" id="amount" placeholder="Ingresa la cantidad"
                onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="category">Categoría</label>
              <select className="form-control" id="category" onChange={(e) => setCategory(Number(e.target.value))}>
                <option>Selecciona la categoría correspondiente</option>
                <option value="1">Comida</option>
                <option value="2">Transporte</option>
                <option value="3">Salud</option>
                <option value="4">Educación</option>
                <option value="5">Entretenimiento</option>
                <option value="6">Ropa</option>
                <option value="7">Alquiler</option>
                <option value="8">Servicios</option>
                <option value="15">Otro</option>
              </select>
            </div>
            <button
              type="submit"
              className='btn btn-info text-white'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Agregando...
                </>
              ) : (
                'Agregar gasto'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Expense