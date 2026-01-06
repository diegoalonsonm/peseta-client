'use client'

import { useEffect, useState } from 'react'
import axios from "axios"
import IncomeExpenseCard from "../../components/IncomeExpenseCard"
import EmptyState from "../../components/EmptyState"
import SkeletonCard from "../../components/SkeletonCard"
import PullToRefresh from "../../components/PullToRefresh"
import Breadcrumbs from "../../components/Breadcrumbs"
import { IconReceipt } from "@tabler/icons-react"

const AllExpenses = () => {
    const [expenses, setExpenses] = useState([])
    const [amount, setAmount] = useState(0.0)
    const [isLoading, setIsLoading] = useState(true)
    const [isScrolled, setIsScrolled] = useState(false)

    axios.defaults.withCredentials = true

    const fetchExpenses = async () => {
        const email = localStorage.getItem('email')

        return Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${email}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/expenses/totalAmount/${email}`)
        ]).then(([expensesRes, totalRes]) => {
            setExpenses(expensesRes.data)
            setAmount(totalRes.data[0].totalAmount)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleRefresh = async () => {
        await fetchExpenses()
    }

    useEffect(() => {
        setIsLoading(true)
        fetchExpenses().finally(() => {
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
      <div className='container'>
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Gastos', href: '/expense' },
              { label: 'Todos los Gastos' }
            ]}
          />
          <div className={`sticky-header ${isScrolled ? 'scrolled' : ''}`}>
              <div className="row text-center">
                  <div className="col">
                      <h2>Todos los Gastos</h2>
                      {!isLoading && expenses.length > 0 && (
                          <p className='h4 fw-normal mt-2'>
                              Total gastado: <span className='text-info-emphasis'>₡{amount.toFixed(2)}</span>
                          </p>
                      )}
                  </div>
              </div>
          </div>
          <div className="row width-50 mt-3 mx-auto">
              <div className="col">
                  {isLoading ? (
                      <>
                          <SkeletonCard />
                          <SkeletonCard />
                          <SkeletonCard />
                          <SkeletonCard />
                          <SkeletonCard />
                      </>
                  ) : expenses.length > 0 ? (
                      expenses.map((expense: { id: string, description: string, categoryId: number, amount: number, date: string }) => (
                          <IncomeExpenseCard
                              key={expense.id}
                              id={expense.id}
                              description={expense.description}
                              category={expense.categoryId}
                              amount={expense.amount}
                              date={expense.date}
                          />
                      ))
                  ) : (
                      <EmptyState
                          icon={<IconReceipt />}
                          title="No hay gastos registrados"
                          message="Aún no has registrado ningún gasto. ¿Quieres empezar a controlar tus finanzas?"
                          actionText="Agregar primer gasto"
                          actionLink="/expense"
                      />
                  )}
              </div>
          </div>
      </div>
    </PullToRefresh>
  )
}

export default AllExpenses