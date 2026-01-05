'use client'

import { useEffect, useState } from 'react'
import axios from "axios"
import IncomeExpenseCard from "../../components/IncomeExpenseCard"
import EmptyState from "../../components/EmptyState"
import SkeletonCard from "../../components/SkeletonCard"
import { IconCoin } from "@tabler/icons-react"

const AllIncomes = () => {
    const [incomes, setIncomes] = useState([])
    const [amount, setAmount] = useState(0.0)
    const [isLoading, setIsLoading] = useState(true)

    axios.defaults.withCredentials = true

    useEffect(() => {
        const email = localStorage.getItem('email')

        Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/incomes/${email}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/incomes/total/${email}`)
        ]).then(([incomesRes, totalRes]) => {
            setIncomes(incomesRes.data)
            setAmount(totalRes.data[0].totalAmount)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsLoading(false)
        })

    }, [])

  return (
    <div className='container'>
        <div className="row mt-2 text-center">
            <div className="col">
                <h2>
                    Todos los Ingresos
                </h2>
            </div>
        </div>
        {!isLoading && incomes.length > 0 && (
            <div className="row mt-2 text-center">
                <p className='h4 fw-normal'>Total ingresado: <span className='text-info-emphasis'>{amount}</span></p>
            </div>
        )}
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
  )
}

export default AllIncomes