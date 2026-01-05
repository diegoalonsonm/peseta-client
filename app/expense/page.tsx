'use client'

import { useEffect, useState } from 'react'
import { Input } from '../components/Input'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

const Expense = () => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [descriptionError, setDescriptionError] = useState('')
  const [amountError, setAmountError] = useState('')
  const [categoryError, setCategoryError] = useState('')

  var email = ''

  if (typeof window !== 'undefined') {
    email = localStorage.getItem('email') ?? ''
  }

  const router = useRouter()

  const validateDescription = (desc: string) => {
    if (!desc.trim()) {
      setDescriptionError('La descripción es requerida')
      return false
    }
    if (desc.trim().length < 3) {
      setDescriptionError('La descripción debe tener al menos 3 caracteres')
      return false
    }
    setDescriptionError('')
    return true
  }

  const validateAmount = (amt: string) => {
    const numAmount = parseFloat(amt)
    if (!amt || isNaN(numAmount)) {
      setAmountError('La cantidad es requerida')
      return false
    }
    if (numAmount < 1) {
      setAmountError('La cantidad debe ser al menos 1')
      return false
    }
    setAmountError('')
    return true
  }

  const validateCategory = (cat: number) => {
    if (cat === 0) {
      setCategoryError('Por favor selecciona una categoría')
      return false
    }
    setCategoryError('')
    return true
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDescription(value)
    if (value) validateDescription(value)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    if (value) validateAmount(value)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)
    setCategory(value)
    if (value) validateCategory(value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isDescValid = validateDescription(description)
    const isAmountValid = validateAmount(amount)
    const isCatValid = validateCategory(category)

    if (!isDescValid || !isAmountValid || !isCatValid) return

    setIsSubmitting(true)

    const data = {description, amount: parseFloat(amount), category, email}

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
              <Input
                type="text"
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                error={descriptionError}
                isValid={!descriptionError && description.length > 0}
                placeholder="Ej: Almuerzo, gasolina, etc."
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="amount">Cantidad</label>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                error={amountError}
                isValid={!amountError && amount.length > 0}
                placeholder="1.00"
                disabled={isSubmitting}
                min="1"
                step="1"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="category">Categoría</label>
              <select
                className={`form-control ${categoryError ? 'is-invalid' : category > 0 ? 'is-valid' : ''}`}
                id="category"
                value={category}
                onChange={handleCategoryChange}
                disabled={isSubmitting}
              >
                <option value="0">Selecciona la categoría correspondiente</option>
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
              {categoryError && <div className="invalid-feedback d-block">{categoryError}</div>}
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