'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Input } from '../../../components/Input'
import CategorySelector from '../../../components/CategorySelector'
import BackButton from '../../../components/BackButton'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { IconFileDescription, IconCoins, IconCalendar } from '@tabler/icons-react'
import axios from 'axios'
import Swal from 'sweetalert2'

const EditExpense = () => {
  const params = useParams()
  const router = useRouter()
  const expenseId = params.expenseId as string

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(0)
  const [date, setDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [budgetInfo, setBudgetInfo] = useState<any>(null)

  const [descriptionError, setDescriptionError] = useState('')
  const [amountError, setAmountError] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [dateError, setDateError] = useState('')

  const email = typeof window !== 'undefined' ? localStorage.getItem('email') ?? '' : ''

  // Fetch expense data on mount
  useEffect(() => {
    if (!email) {
      router.push('/login')
      return
    }

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/expenses/single/${expenseId}?email=${email}`)
      .then((res) => {
        const expense = res.data
        setDescription(expense.description)
        setAmount(expense.amount.toString())
        setCategory(expense.categoryId)
        setDate(expense.date)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching expense:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el gasto. Es posible que no exista o no tengas permiso para editarlo.'
        }).then(() => {
          router.push('/')
        })
      })
  }, [expenseId, email, router])

  // Fetch budget when category changes
  useEffect(() => {
    if (category > 0 && email) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/budgets/${email}/category/${category}`)
        .then(res => setBudgetInfo(res.data))
        .catch(() => setBudgetInfo(null))
    } else {
      setBudgetInfo(null)
    }
  }, [category, email])

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

  const validateDate = (dateStr: string) => {
    if (!dateStr) {
      setDateError('La fecha es requerida')
      return false
    }

    const selectedDate = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate > today) {
      setDateError('La fecha no puede ser futura')
      return false
    }

    setDateError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isDescValid = validateDescription(description)
    const isAmountValid = validateAmount(amount)
    const isCatValid = validateCategory(category)
    const isDateValid = validateDate(date)

    if (!isDescValid || !isAmountValid || !isCatValid || !isDateValid) return

    setIsSubmitting(true)

    const data = {
      email,
      description,
      amount: parseFloat(amount),
      category,
      date
    }

    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${expenseId}`, data)
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Gasto actualizado',
            text: 'El gasto ha sido actualizado exitosamente',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            router.push('/')
          })
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data || 'Hubo un error actualizando el gasto'
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="row text-center mt-5">
          <div className="col">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando gasto...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Gastos' },
          { label: 'Editar Gasto' }
        ]}
      />
      <BackButton href="/" text="Volver al inicio" />
      <div className="row text-center mt-3">
        <div className="col">
          <h2>Editar Gasto</h2>
        </div>
      </div>
      <div className="row mt-3 mx-auto width-50">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <div className="form-card">
              <h3 className="form-section-title">Detalles del Gasto</h3>

              <Input
                type="text"
                id="description"
                label="Descripción"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (e.target.value) validateDescription(e.target.value)
                }}
                error={descriptionError}
                isValid={!descriptionError && description.length > 0}
                placeholder="Ej: Almuerzo, gasolina, etc."
                disabled={isSubmitting}
                icon={<IconFileDescription size={20} />}
                floatingLabel={true}
                helperText="Describe brevemente tu gasto"
                required={true}
              />

              <Input
                type="number"
                id="amount"
                label="Cantidad"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  if (e.target.value) validateAmount(e.target.value)
                }}
                error={amountError}
                isValid={!amountError && amount.length > 0}
                placeholder="1.00"
                disabled={isSubmitting}
                min="1"
                step="1"
                icon={<IconCoins size={20} />}
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
                type="expense"
                error={categoryError}
                disabled={isSubmitting}
              />

              <Input
                type="date"
                id="date"
                label="Fecha"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  if (e.target.value) validateDate(e.target.value)
                }}
                error={dateError}
                isValid={!dateError && date.length > 0}
                disabled={isSubmitting}
                icon={<IconCalendar size={20} />}
                floatingLabel={true}
                helperText="La fecha no puede ser futura"
                required={true}
              />

              {budgetInfo && (
                <div className="alert alert-info mt-3">
                  <h6 className="alert-heading mb-2">Presupuesto de {budgetInfo.categoryName}</h6>
                  <p className="mb-1">
                    Disponible: <strong>₡{budgetInfo.remaining.toLocaleString('es-CR', { minimumFractionDigits: 2 })}</strong>
                  </p>
                  <p className="mb-0 text-muted">
                    Has gastado ₡{budgetInfo.totalSpent.toLocaleString('es-CR', { minimumFractionDigits: 2 })} de ₡{budgetInfo.limitAmount.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
                  </p>
                  {amount && parseFloat(amount) > budgetInfo.remaining && (
                    <p className="text-danger fw-bold mb-0 mt-2">
                      ⚠️ Esta cantidad excederá tu presupuesto por ₡{(parseFloat(amount) - budgetInfo.remaining).toLocaleString('es-CR', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>
              )}
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
                    Actualizando...
                  </>
                ) : (
                  'Actualizar gasto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditExpense
