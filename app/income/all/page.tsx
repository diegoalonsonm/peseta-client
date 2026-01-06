'use client'

import { useEffect, useState } from 'react'
import axios from "axios"
import IncomeExpenseCard from "../../components/IncomeExpenseCard"
import EmptyState from "../../components/EmptyState"
import SkeletonCard from "../../components/SkeletonCard"
import PullToRefresh from "../../components/PullToRefresh"
import Breadcrumbs from "../../components/Breadcrumbs"
import { IconCoin } from "@tabler/icons-react"

const AllIncomes = () => {
    const [incomes, setIncomes] = useState([])
    const [amount, setAmount] = useState(0.0)
    const [isLoading, setIsLoading] = useState(true)
    const [isScrolled, setIsScrolled] = useState(false)

    axios.defaults.withCredentials = true

    const fetchIncomes = async () => {
        const email = localStorage.getItem('email')

        return Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/incomes/${email}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/incomes/total/${email}`)
        ]).then(([incomesRes, totalRes]) => {
            setIncomes(incomesRes.data)
            setAmount(totalRes.data[0].totalAmount)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleRefresh = async () => {
        await fetchIncomes()
    }

    useEffect(() => {
        setIsLoading(true)
        fetchIncomes().finally(() => {
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
              { label: 'Ingresos', href: '/income' },
              { label: 'Todos los Ingresos' }
            ]}
          />
          <div className={`sticky-header ${isScrolled ? 'scrolled' : ''}`}>
              <div className="row text-center">
                  <div className="col">
                      <h2>Todos los Ingresos</h2>
                      {!isLoading && incomes.length > 0 && (
                          <p className='h4 fw-normal mt-2'>
                              Total ingresado: <span className='text-info-emphasis'>₡{amount.toFixed(2)}</span>
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
                  ) : incomes.length > 0 ? (
                      incomes.map((income: { id: string, description: string, categoryId: number, amount: number, date: string }) => (
                          <IncomeExpenseCard
                              key={income.id}
                              id={income.id}
                              description={income.description}
                              category={income.categoryId}
                              amount={income.amount}
                              date={income.date}
                          />
                      ))
                  ) : (
                      <EmptyState
                          icon={<IconCoin />}
                          title="No hay ingresos registrados"
                          message="Aún no has registrado ningún ingreso. Comienza a trackear tus entradas de dinero."
                          actionText="Agregar primer ingreso"
                          actionLink="/income"
                      />
                  )}
              </div>
          </div>
      </div>
    </PullToRefresh>
  )
}

export default AllIncomes