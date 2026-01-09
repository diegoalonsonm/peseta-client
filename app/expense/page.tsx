'use client'

import { useEffect, useState } from 'react'
import { Input } from '../components/Input'
import CategorySelector from '../components/CategorySelector'
import BackButton from '../components/BackButton'
import Breadcrumbs from '../components/Breadcrumbs'
import { IconFileDescription, IconCoins } from '@tabler/icons-react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

const Expense = () => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [budgetInfo, setBudgetInfo] = useState<any>(null)

  const [descriptionError, setDescriptionError] = useState('')
  const [amountError, setAmountError] = useState('')
  const [categoryError, setCategoryError] = useState('')

  const router = useRouter()
  
  var email = ''

  if (typeof window !== 'undefined') {
    email = localStorage.getItem('email') ?? ''
  }

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
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Gastos' },
          { label: 'Nuevo Gasto' }
        ]}
      />
      <BackButton href="/" text="Volver al inicio" />
      <div className="row text-center mt-3">
        <div className="col">
          <h2>Nuevo Gasto</h2>
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
                onChange={handleDescriptionChange}
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
                onChange={handleAmountChange}
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
                      ⚠️ Esta compra excederá tu presupuesto por ₡{(parseFloat(amount) - budgetInfo.remaining).toLocaleString('es-CR', { minimumFractionDigits: 2 })}
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
                    Agregando...
                  </>
                ) : (
                  'Agregar gasto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Expense