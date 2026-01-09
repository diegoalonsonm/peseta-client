'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import BudgetCard from '../components/BudgetCard'
import EmptyState from '../components/EmptyState'
import SkeletonCard from '../components/SkeletonCard'
import PullToRefresh from '../components/PullToRefresh'
import Breadcrumbs from '../components/Breadcrumbs'
import { IconChartPie, IconPlus } from '@tabler/icons-react'
import { Budget, BudgetAlerts } from '@/types'
import Swal from 'sweetalert2'

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [alerts, setAlerts] = useState<BudgetAlerts | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  axios.defaults.withCredentials = true

  const fetchBudgets = async () => {
    const email = localStorage.getItem('email')

    if (!email) {
      router.push('/login')
      return
    }

    return Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/budgets/${email}`),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/budgets/${email}/alerts`)
    ]).then(([budgetsRes, alertsRes]) => {
      setBudgets(budgetsRes.data)
      setAlerts(alertsRes.data)
    }).catch((err) => {
      console.error('Error fetching budgets:', err)
      if (err.response?.status === 401) {
        router.push('/login')
      }
    })
  }

  const handleRefresh = async () => {
    await fetchBudgets()
  }

  const handleEdit = (budget: Budget) => {
    // TODO: Implement edit functionality
    console.log('Edit budget:', budget)
    Swal.fire({
      title: 'Editar Presupuesto',
      text: 'Funcionalidad de edición en desarrollo',
      icon: 'info'
    })
  }

  const handleDelete = (budgetId: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el presupuesto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const email = localStorage.getItem('email')
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/budgets/${budgetId}`, {
          data: { email }
        }).then(() => {
          Swal.fire({
            title: 'Eliminado',
            text: 'El presupuesto ha sido eliminado',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            fetchBudgets()
          })
        }).catch((err) => {
          console.error('Error deleting budget:', err)
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el presupuesto',
            icon: 'error'
          })
        })
      }
    })
  }

  useEffect(() => {
    setIsLoading(true)
    fetchBudgets().finally(() => {
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Presupuestos' }
          ]}
        />
        <div className={`sticky-header ${isScrolled ? 'scrolled' : ''}`}>
          <div className="row text-center">
            <div className="col">
              <h2>Presupuestos</h2>
              {!isLoading && alerts && alerts.totalAlerts > 0 && (
                <p className="h6 fw-normal mt-2 text-warning">
                  {alerts.totalAlerts} alerta{alerts.totalAlerts > 1 ? 's' : ''} activa{alerts.totalAlerts > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="row width-50 mt-3 mx-auto">
          <div className="col">
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-primary"
                onClick={() => router.push('/budgets/create')}
              >
                <IconPlus size={20} className="me-2" />
                Crear Presupuesto
              </button>
            </div>

            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : budgets.length > 0 ? (
              budgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyState
                icon={<IconChartPie />}
                title="No hay presupuestos creados"
                message="Aún no has creado ningún presupuesto. ¿Quieres empezar a controlar tus gastos por categoría?"
                actionText="Crear primer presupuesto"
                actionLink="/budgets/create"
              />
            )}
          </div>
        </div>
      </div>
    </PullToRefresh>
  )
}

export default BudgetsPage
