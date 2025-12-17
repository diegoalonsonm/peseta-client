'use client'

import { useState } from "react"
import { Button } from '../components/Button'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation"

const Income = () => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0.0)
  const [category, setCategory] = useState(0)
  var email = ''

  if (typeof window !== 'undefined') {
    email = localStorage.getItem('email') ?? ''
  }

  const router = useRouter()

  const data = {description, amount, category, email}

  const cleanInputs = () => {
    setDescription('')
    setAmount(0.0)
    setCategory(0)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/incomes`, data).then((res) => {
      if (res.data) {
        cleanInputs()
        Swal.fire({
          icon: 'success',
          title: 'Ingreso agregado',
          text: 'Tu ingreso ha sido agregado exitosamente'
        })
        router.push('/')
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error agregando el ingreso'
        })
      }
    }).catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error agregando el ingreso'
      })
      console.log(err)
    })
  }

  return (
    <div className="container">
      <div className="row text-center mt-5">
        <div className="col">
          <h2>Nuevo Ingreso</h2>
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
                <option value="9">Salario</option>
                <option value="10">Inversión</option>
                <option value="11">Regalo</option>
                <option value="12">Ahorros</option>
                <option value="13">Préstamos</option>
                <option value="14">Seguro</option>
                <option value="15">Otro</option>
              </select>
            </div>
            <Button type="submit" className='btn-info text-white' text='Agregar ingreso' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default Income