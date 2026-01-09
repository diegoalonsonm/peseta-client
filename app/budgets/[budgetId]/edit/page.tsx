'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Input } from '../../../components/Input'
import BackButton from '../../../components/BackButton'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { IconChartPie, IconCoins, IconCalendar } from '@tabler/icons-react'

type PeriodType = 'weekly' | 'biweekly' | 'monthly'

const EditBudget = () => {
  const params = useParams()
  const router = useRouter()
  const budgetId = params.budgetId as string

  const [limitAmount, setLimitAmount] = useState('')
  const [periodType, setPeriodType] = useState<PeriodType>('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [limitError, setLimitError] = useState('')

  const email = typeof window !== 'undefined' ? localStorage.getItem('email') ?? '' : ''

  // Calculate endDate based on startDate and periodType
  const calculateEndDate = (start: string, period: PeriodType): string => {
    if (!start) return ''

    const [year, month, day] = start.split('-').map(Number)
    const startDateObj = new Date(year, month - 1, day)
    let endDateObj: Date

    switch (period) {
      case 'weekly':
        endDateObj = new Date(startDateObj)
        endDateObj.setDate(endDateObj.getDate() + 6)
        break
      case 'biweekly':
        endDateObj = new Date(startDateObj)
        endDateObj.setDate(endDateObj.getDate() + 13)
        break
      case 'monthly':
        endDateObj = new Date(startDateObj.getFullYear(), startDateObj.getMonth() + 1, 0)
        break
      default:
        return ''
    }

    const endYear = endDateObj.getFullYear()
    const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0')
    const endDay = String(endDateObj.getDate()).padStart(2, '0')
    return `${endYear}-${endMonth}-${endDay}`
  }

  // Fetch budget data on mount
  useEffect(() => {
    if (!email) {
      router.push('/login')
      return
    }

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/budgets/single/${budgetId}?email=${email}`)
      .then((res) => {
        const budget = res.data
        setLimitAmount(budget.limitAmount.toString())
        setPeriodType(budget.periodType)
        setStartDate(budget.startDate)
        setEndDate(budget.endDate)
        setCategoryName(budget.categoryName)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching budget:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el presupuesto. Es posible que no exista o no tengas permiso para editarlo.'
        }).then(() => {
          router.push('/budgets')
        })
      })
  }, [budgetId, email, router])

  // Recalculate endDate when periodType or startDate changes
  useEffect(() => {
    if (startDate && periodType) {
      const newEndDate = calculateEndDate(startDate, periodType)
      setEndDate(newEndDate)
    }
  }, [startDate, periodType])

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isLimitValid = validateLimit(limitAmount)

    if (!isLimitValid) return

    setIsSubmitting(true)

    const data = {
      email,
      limitAmount: parseFloat(limitAmount),
      periodType,
      startDate,
      endDate
    }

    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/budgets/${budgetId}`, data)
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Presupuesto actualizado',
            text: 'El presupuesto ha sido actualizado exitosamente',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            router.push('/budgets')
          })
        }
      })
      .catch((err) => {
        console.error('Error updating budget:', err)
        let errorMessage = 'No se pudo actualizar el presupuesto'

        if (err.response?.data) {
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

  if (isLoading) {
    return (
      <div className="container">
        <div className="row text-center mt-5">
          <div className="col">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando presupuesto...</p>
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
          { label: 'Presupuestos', href: '/budgets' },
          { label: 'Editar Presupuesto' }
        ]}
      />
      <BackButton />

      <div className="row">
        <div className="col">
          <h2 className="text-center mb-4">Editar Presupuesto</h2>
          <div className="alert alert-info text-center">
            <strong>Categoría: {categoryName}</strong>
            <p className="mb-0 mt-2 text-muted">La categoría no puede ser modificada</p>
          </div>
        </div>
      </div>

      <div className="row width-50 mx-auto">
        <div className="col">
          <form onSubmit={handleSubmit}>
            {/* Limit Amount */}
            <div className="mb-3">
              <Input
                type="number"
                id="limitAmount"
                label="Límite de Gasto"
                placeholder="Ej: 50000"
                value={limitAmount}
                onChange={(e) => {
                  setLimitAmount(e.target.value)
                  if (e.target.value) validateLimit(e.target.value)
                }}
                error={limitError}
                step="0.01"
                min="0"
                icon={<IconCoins size={20} />}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Period Type */}
            <div className="mb-3">
              <label className="form-label">Período</label>
              <select
                className="form-select"
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as PeriodType)}
                disabled={isSubmitting}
              >
                <option value="weekly">Semanal (7 días)</option>
                <option value="biweekly">Quincenal (14 días)</option>
                <option value="monthly">Mensual (calendario)</option>
              </select>
              <div className="form-text">
                {periodType === 'weekly' && 'El presupuesto se reinicia cada 7 días'}
                {periodType === 'biweekly' && 'El presupuesto se reinicia cada 14 días'}
                {periodType === 'monthly' && 'El presupuesto se reinicia el 1° de cada mes'}
              </div>
              <div className="alert alert-warning mt-2">
                ⚠️ Cambiar el tipo de período recalculará automáticamente la fecha de fin
              </div>
            </div>

            {/* Start Date */}
            <div className="mb-3">
              <Input
                type="date"
                id="startDate"
                label="Fecha de Inicio"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                icon={<IconCalendar size={20} />}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* End Date (Read-only, auto-calculated) */}
            <div className="mb-3">
              <Input
                type="date"
                id="endDate"
                label="Fecha de Fin (calculada automáticamente)"
                value={endDate}
                icon={<IconCalendar size={20} />}
                disabled={true}
              />
              <div className="form-text">
                Esta fecha se calcula automáticamente según el tipo de período
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
                    Actualizando...
                  </>
                ) : (
                  <>
                    <IconChartPie size={20} className="me-2" />
                    Actualizar Presupuesto
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

export default EditBudget
