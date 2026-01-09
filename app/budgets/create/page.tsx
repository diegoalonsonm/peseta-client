'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Input } from '../../components/Input'
import CategorySelector from '../../components/CategorySelector'
import BackButton from '../../components/BackButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import { IconChartPie, IconCoins, IconCalendar } from '@tabler/icons-react'
import { BudgetFormData } from '@/types'

const CreateBudget = () => {
  const [formData, setFormData] = useState<BudgetFormData>({
    categoryId: 0,
    limitAmount: '',
    periodType: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [categoryError, setCategoryError] = useState('')
  const [limitError, setLimitError] = useState('')

  const router = useRouter()

  const email = typeof window !== 'undefined' ? localStorage.getItem('email') ?? '' : ''

  const validateCategory = (categoryId: number) => {
    if (categoryId === 0) {
      setCategoryError('Por favor selecciona una categoría')
      return false
    }
    setCategoryError('')
    return true
  }

  const validateLimit = (limit: string) => {
    const numLimit = parseFloat(limit)
    if (!limit || isNaN(numLimit)) {
      setLimitError('El límite es requerido')
      return false
    }
    if (numLimit <= 0) {
      setLimitError('El límite debe ser mayor a 0')
      return false
    }
    setLimitError('')
    return true
  }

  const handleCategoryChange = (categoryId: number) => {
    setFormData({ ...formData, categoryId })
    if (categoryId) validateCategory(categoryId)
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, limitAmount: value })
    if (value) validateLimit(value)
  }

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, periodType: e.target.value as 'weekly' | 'biweekly' | 'monthly' })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, startDate: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isCategoryValid = validateCategory(formData.categoryId)
    const isLimitValid = validateLimit(formData.limitAmount)

    if (!isCategoryValid || !isLimitValid) return

    setIsSubmitting(true)

    const data = {
      email,
      categoryId: formData.categoryId,
      limitAmount: parseFloat(formData.limitAmount),
      periodType: formData.periodType,
      startDate: formData.startDate
    }

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/budgets`, data)
      .then((res) => {
        if (res.data) {
          Swal.fire({
            icon: 'success',
            title: 'Presupuesto creado',
            text: 'El presupuesto ha sido creado exitosamente',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            router.push('/budgets')
          })
        }
      })
      .catch((err) => {
        console.error('Error creating budget:', err)
        let errorMessage = 'No se pudo crear el presupuesto'

        if (err.response?.status === 409) {
          errorMessage = 'Ya existe un presupuesto activo para esta categoría'
        } else if (err.response?.data) {
          errorMessage = err.response.data
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Presupuestos', href: '/budgets' },
          { label: 'Crear Presupuesto' }
        ]}
      />
      <BackButton />

      <div className="row">
        <div className="col">
          <h2 className="text-center mb-4">Crear Presupuesto</h2>
        </div>
      </div>

      <div className="row width-50 mx-auto">
        <div className="col">
          <form onSubmit={handleSubmit}>
            {/* Category Selector */}
            <div className="mb-3">
              <CategorySelector
                type="expense"
                selectedCategory={formData.categoryId}
                onChange={handleCategoryChange}
              />
              {categoryError && (
                <div className="text-danger mt-1">{categoryError}</div>
              )}
            </div>

            {/* Limit Amount */}
            <div className="mb-3">
              <Input
                type="number"
                id="limitAmount"
                label="Límite de Gasto"
                placeholder="Ej: 50000"
                value={formData.limitAmount}
                onChange={handleLimitChange}
                error={limitError}
                step="0.01"
                min="0"
                icon={<IconCoins size={20} />}
                required
              />
            </div>

            {/* Period Type */}
            <div className="mb-3">
              <label className="form-label">Período</label>
              <select
                className="form-select"
                value={formData.periodType}
                onChange={handlePeriodChange}
              >
                <option value="weekly">Semanal (7 días)</option>
                <option value="biweekly">Quincenal (14 días)</option>
                <option value="monthly">Mensual (calendario)</option>
              </select>
              <div className="form-text">
                {formData.periodType === 'weekly' && 'El presupuesto se reinicia cada 7 días'}
                {formData.periodType === 'biweekly' && 'El presupuesto se reinicia cada 14 días'}
                {formData.periodType === 'monthly' && 'El presupuesto se reinicia el 1° de cada mes'}
              </div>
            </div>

            {/* Start Date */}
            <div className="mb-3">
              <Input
                type="date"
                id="startDate"
                label="Fecha de Inicio"
                value={formData.startDate}
                onChange={handleDateChange}
                icon={<IconCalendar size={20} />}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <div className="form-text">
                {formData.periodType === 'monthly'
                  ? 'Para presupuestos mensuales, la fecha de inicio no afecta el período'
                  : 'Los períodos se calcularán desde esta fecha'
                }
              </div>
            </div>

            {/* Submit Button */}
            <div className="d-grid gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creando...
                  </>
                ) : (
                  <>
                    <IconChartPie size={20} className="me-2" />
                    Crear Presupuesto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateBudget
