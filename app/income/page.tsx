'use client'

import { useState } from "react"
import { Input } from '../components/Input'
import CategorySelector from '../components/CategorySelector'
import BackButton from '../components/BackButton'
import Breadcrumbs from '../components/Breadcrumbs'
import { IconFileDescription, IconCurrencyDollar } from '@tabler/icons-react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation"

const Income = () => {
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

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/incomes`, data).then((res) => {
      if (res.data) {
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
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Ingresos' },
          { label: 'Nuevo Ingreso' }
        ]}
      />
      <BackButton href="/" text="Volver al inicio" />
      <div className="row text-center mt-3">
        <div className="col">
          <h2>Nuevo Ingreso</h2>
        </div>
      </div>
      <div className="row mt-3 mx-auto width-50">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <div className="form-card">
              <h3 className="form-section-title">Detalles del Ingreso</h3>

              <Input
                type="text"
                id="description"
                label="Descripción"
                value={description}
                onChange={handleDescriptionChange}
                error={descriptionError}
                isValid={!descriptionError && description.length > 0}
                placeholder="Ej: Salario, inversión, etc."
                disabled={isSubmitting}
                icon={<IconFileDescription size={20} />}
                floatingLabel={true}
                helperText="Describe brevemente tu ingreso"
                required={true}
              />

              <Input
                type="number"
                id="amount"
                label="Cantidad"
                value={amount}
                onChange={handleAmountChange}
                error={amountError}
                isValid={!amountError && amount.length > 0}
                placeholder="1.00"
                disabled={isSubmitting}
                min="1"
                step="1"
                icon={<IconCurrencyDollar size={20} />}
                floatingLabel={true}
                helperText="Monto mínimo: ₡1"
                required={true}
              />

              <CategorySelector
                selectedCategory={category}
                onChange={(categoryId) => {
                  setCategory(categoryId)
                  validateCategory(categoryId)
                }}
                type="income"
                error={categoryError}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-actions">
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
                  'Agregar ingreso'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Income